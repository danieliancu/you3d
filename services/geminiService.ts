import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const isRetryableError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("Deadline expired")
  );
};

const withRetry = async <T>(fn: () => Promise<T>, retries = 2) => {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryableError(error) || attempt === retries) {
        throw error;
      }
      await sleep(500 * (attempt + 1));
    }
  }
  throw lastError;
};

const ensureDataUrl = (input: string, fallbackMimeType = "image/png") => {
  if (input.startsWith("data:")) {
    return input;
  }
  return `data:${fallbackMimeType};base64,${input}`;
};

const parseDataUrl = (dataUrl: string) => {
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) {
    return { mimeType: "image/png", data: dataUrl };
  }
  return { mimeType: match[1], data: match[2] };
};

const estimateBytesFromBase64 = (base64Data: string) => {
  const padding = base64Data.endsWith("==") ? 2 : base64Data.endsWith("=") ? 1 : 0;
  return Math.floor((base64Data.length * 3) / 4) - padding;
};

const getImageDimensions = async (dataUrl: string) => {
  if (typeof window === "undefined") {
    return { width: 0, height: 0 };
  }
  return await new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
};

const IMAGE_LIMIT_BYTES = 4 * 1024 * 1024;
const IMAGE_LIMIT_PX = 2000;

const checkImageConstraints = async (dataUrl: string) => {
  const { data } = parseDataUrl(dataUrl);
  const bytes = estimateBytesFromBase64(data);
  const { width, height } = await getImageDimensions(dataUrl);
  const maxSide = Math.max(width, height);
  if (bytes > IMAGE_LIMIT_BYTES || maxSide > IMAGE_LIMIT_PX) {
    return "Please upload an image under 4 MB and within 2000 px on the longest side.";
  }
  return "";
};

const resizeImageDataUrl = async (dataUrl: string, maxDim = 1024, quality = 0.85) => {
  if (typeof window === "undefined") {
    return dataUrl;
  }

  return await new Promise<string>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxSide = Math.max(img.width, img.height);
      if (maxSide <= maxDim) {
        resolve(dataUrl);
        return;
      }
      const scale = maxDim / maxSide;
      const targetWidth = Math.round(img.width * scale);
      const targetHeight = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(dataUrl);
        return;
      }
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
};

const getAIClient = () => {
  const apiKey =
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
  }

  return new GoogleGenAI({ apiKey });
};

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export const validateImage = async (userImageBase64: string, role: string, styleId: string): Promise<ValidationResult> => {
  const ai = getAIClient();
  const dataUrl = ensureDataUrl(userImageBase64);
  const sizeMessage = await checkImageConstraints(dataUrl);
  if (sizeMessage) {
    return { isValid: false, message: sizeMessage };
  }
  const resizedDataUrl = await resizeImageDataUrl(dataUrl);
  const cleanUserImg = resizedDataUrl.split(',')[1] || resizedDataUrl;

  let criteria = "";
  if (styleId === '1 person') {
    criteria = "The image must contain exactly ONE clear person. If there are zero or multiple people, it is invalid.";
  } else if (styleId === '2 people') {
    criteria = "This is a single-person upload slot. The image must contain exactly ONE clear person. If there are zero or multiple people, it is invalid.";
  } else if (styleId === 'Couple') {
    criteria = "The image must contain exactly TWO people standing together in the same frame. If there is only one or more than two people, it is invalid.";
  } else if (styleId === 'Groom + Bride (2 photos)' || styleId === 'Groom' || styleId === 'Bride') {
    criteria = "The image must contain exactly ONE clear person. If there are zero or multiple people, it is invalid.";
  } else if (styleId === '1 pet') {
    criteria = "The image must contain exactly ONE animal (dog, cat, etc.). If it's a human, a car, or any non-animal object, it is invalid.";
  } else if (styleId === 'Non-human figure') {
    criteria = "The image must contain a TOY, FIGURINE, or OBJECT. It MUST NOT contain a real human or a real animal.";
  } else if (styleId === '1 person + 1 pet') {
    criteria = "The image should ideally contain a person and a pet, but if this is the person slot, validate one person. If this is the pet slot, validate one pet.";
    if (role === 'person') criteria = "Exactly ONE clear person.";
    else criteria = "Exactly ONE animal.";
  }

  const prompt = `Analyze this image for a 3D figure customization service.
  Criteria: ${criteria}
  Also check for clarity: If the image is extremely blurry, dark, or the subject is too small to see details, it is invalid.

  Respond strictly in JSON format with:
  {
    "isValid": boolean,
    "message": "A short, friendly warning message in English explaining what is wrong if isValid is false, otherwise empty string."
  }`;

  try {
    const response = await withRetry(() => ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: cleanUserImg } },
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json",
        httpOptions: { timeout: 60000 }
      }
    }));

    const result = JSON.parse(response.text || '{"isValid": false, "message": "Error processing validation."}');
    return result;
  } catch (e) {
    console.error("Validation error:", e);
    return { isValid: true, message: "" }; // Fallback to allow if validation fails to avoid blocking user
  }
};

export const generateStylizedAvatar = async (
  userImageBase64: string,
  role: 'person' | 'pet' | 'object',
  styleId?: string,
  secondaryImageBase64?: string
): Promise<string> => {
  const ai = getAIClient();
  
  const primaryDataUrl = ensureDataUrl(userImageBase64);
  const primarySizeMessage = await checkImageConstraints(primaryDataUrl);
  if (primarySizeMessage) {
    throw new Error(primarySizeMessage);
  }
  const resizedPrimaryDataUrl = await resizeImageDataUrl(primaryDataUrl, 1536, 0.9);
  const primaryImage = parseDataUrl(resizedPrimaryDataUrl);

  const secondaryDataUrl = secondaryImageBase64 ? ensureDataUrl(secondaryImageBase64) : null;
  if (secondaryDataUrl) {
    const secondarySizeMessage = await checkImageConstraints(secondaryDataUrl);
    if (secondarySizeMessage) {
      throw new Error(secondarySizeMessage);
    }
  }
  const resizedSecondaryDataUrl = secondaryDataUrl
    ? await resizeImageDataUrl(secondaryDataUrl, 1536, 0.9)
    : null;
  const secondaryParts = resizedSecondaryDataUrl
    ? (() => {
        const secondaryImage = parseDataUrl(resizedSecondaryDataUrl);
        return [{
          inlineData: {
            mimeType: secondaryImage.mimeType,
            data: secondaryImage.data,
          },
        }];
      })()
    : [];

  const roleInstruction = role === 'pet' 
    ? "The subject is a PET. Strictly follow the SITTING posture rules for animals."
    : "The subject is a PERSON. Strictly follow the STANDING 'A' pose posture rules for humans.";

  const connectedInstruction =
    styleId === '2 people (connected)' || styleId === 'Couple (holding hands)' || styleId === 'Couple'
      ? "The image contains exactly TWO PEOPLE. Generate ONE image that keeps BOTH people together in a warm embrace/hug pose while still respecting the chibi aesthetic. Show the full bodies of both characters, standing close and connected. Do NOT separate them or crop either person."
      : styleId === 'Cake'
        ? "Use BOTH images to create the couple: the first image is the groom and the second image is the bride. Generate ONE image with BOTH people standing together on top of a wedding cake base. The cake should be a low, wide, smooth tier (not tall) so the couple remains the tallest element. The cake is a simple white wedding cake with minimal decoration. Keep both full bodies visible and proportionate."
        : "";

  const response = await withRetry(() => ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: primaryImage.mimeType,
            data: primaryImage.data,
          },
        },
        ...secondaryParts,
        {
      text: `${roleInstruction}\n${connectedInstruction ? `${connectedInstruction}\n` : ''}\n${SYSTEM_PROMPT}\n\nADDITIONAL RENDERING RULES (APPLY TO ALL OUTPUTS):\nFOR PEOPLE:\n- Clothing must NOT contain any logos, symbols, patterns, labels, written text or prints.\n- Skin must NOT contain freckles.\n- Elderly people must NOT have detailed wrinkles. The face must look smooth, stylized and youthful but still elderly in proportions (hair gray allowed, but skin smooth).\n- Keep the human as a stylized figure with simplified smooth surfaces.\n- HAIR: convert tight curls into larger, rounded clumps with minimal separation. Use smooth, soft wave blocks instead of individual ringlets; avoid stray strands and deep grooves so the hair prints as a single volume.\n- FACE SIMPLIFICATION: render the mouth as a minimal curved line without teeth unless they are clearly visible in the source. Keep lips flat-toned with no shading.\n- EYES: keep the iris/pupil flat and simple with 1-2 flat colors and a single small highlight. Avoid gradients, multiple rings, eyeliner, or detailed lashes.\n\nFOR PETS / ANIMALS:\n- NO visible fur texture.\n- NO visible whiskers.\n- Surface must be smooth, toy-like, with no fine details like hair strands.\n\nGENERAL:\n- Use flat shading with very few color steps; avoid high-frequency gradients or texture on skin, hair, or clothing.\n- The result is used for a 3D model that does NOT support fine details. Avoid micro-details. Prefer smooth plastic toy-like finish.\n- Maintain the same pose logic already implemented (standing for humans, sitting rules for pets).\n- Keep everything else unchanged.`,
        },
      ],
    },
    config: {
      httpOptions: { timeout: 90000 }
    }
  }), 2);

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was generated by the model.");
};
