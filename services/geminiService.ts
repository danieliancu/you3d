import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants";

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
  const cleanUserImg = userImageBase64.split(',')[1] || userImageBase64;

  let criteria = "";
  if (styleId === 'Cake') {
    criteria = "The image must contain exactly ONE clear person. If there are zero or multiple people, it is invalid.";
  } else if (styleId === '1 person') {
    criteria = "The image must contain exactly ONE clear person. If there are zero or multiple people, it is invalid.";
  } else if (styleId === '2 people' || styleId === '2 people (connected)') {
    criteria = "The image must contain exactly TWO people. For 'connected', they should be together in the same frame if possible. If there is only one or more than two people, it is invalid.";
  } else if (styleId === 'Couple (holding hands)') {
    criteria = "The image must contain exactly TWO people standing together. If there is only one or more than two people, it is invalid.";
  } else if (styleId === 'Groom + Bride (2 photos)' || styleId === 'Groom' || styleId === 'Bride' || styleId === 'Cake') {
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: cleanUserImg } },
          { text: prompt }
        ],
      },
      config: {
        responseMimeType: "application/json"
      }
    });

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
  
  const cleanUserImg = userImageBase64.split(',')[1] || userImageBase64;
  const cleanSecondaryImg = secondaryImageBase64 ? secondaryImageBase64.split(',')[1] || secondaryImageBase64 : null;

  const roleInstruction = role === 'pet' 
    ? "The subject is a PET. Strictly follow the SITTING posture rules for animals."
    : "The subject is a PERSON. Strictly follow the STANDING 'A' pose posture rules for humans.";

  const connectedInstruction =
    styleId === '2 people (connected)' || styleId === 'Couple (holding hands)'
      ? "The image contains exactly TWO PEOPLE. Generate ONE image that keeps BOTH people together in a warm embrace/hug pose while still respecting the chibi aesthetic. Show the full bodies of both characters, standing close and connected. Do NOT separate them or crop either person."
      : styleId === 'Cake'
        ? "Use BOTH images to create the couple: the first image is the groom and the second image is the bride. Generate ONE image with BOTH people standing together on top of a wedding cake base. The cake should be a low, wide, smooth tier (not tall) so the couple remains the tallest element. The cake is a simple white wedding cake with minimal decoration. Keep both full bodies visible and proportionate."
        : "";

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: cleanUserImg,
          },
        },
        ...(cleanSecondaryImg ? [{
          inlineData: {
            mimeType: 'image/png',
            data: cleanSecondaryImg,
          },
        }] : []),
        {
      text: `${roleInstruction}\n${connectedInstruction ? `${connectedInstruction}\n` : ''}\n${SYSTEM_PROMPT}\n\nADDITIONAL RENDERING RULES (APPLY TO ALL OUTPUTS):\nFOR PEOPLE:\n- Clothing must NOT contain any logos, symbols, patterns, labels, written text or prints.\n- Skin must NOT contain freckles.\n- Elderly people must NOT have detailed wrinkles. The face must look smooth, stylized and youthful but still elderly in proportions (hair gray allowed, but skin smooth).\n- Keep the human as a stylized figure with simplified smooth surfaces.\n- HAIR: convert tight curls into larger, rounded clumps with minimal separation. Use smooth, soft wave blocks instead of individual ringlets; avoid stray strands and deep grooves so the hair prints as a single volume.\n- FACE SIMPLIFICATION: render the mouth as a minimal curved line without teeth unless they are clearly visible in the source. Keep lips flat-toned with no shading.\n- EYES: keep the iris/pupil flat and simple with 1-2 flat colors and a single small highlight. Avoid gradients, multiple rings, eyeliner, or detailed lashes.\n\nFOR PETS / ANIMALS:\n- NO visible fur texture.\n- NO visible whiskers.\n- Surface must be smooth, toy-like, with no fine details like hair strands.\n\nGENERAL:\n- Use flat shading with very few color steps; avoid high-frequency gradients or texture on skin, hair, or clothing.\n- The result is used for a 3D model that does NOT support fine details. Avoid micro-details. Prefer smooth plastic toy-like finish.\n- Maintain the same pose logic already implemented (standing for humans, sitting rules for pets).\n- Keep everything else unchanged.`,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was generated by the model.");
};
