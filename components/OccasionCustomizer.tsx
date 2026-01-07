'use client';

import React, { useEffect, useRef, useState } from 'react';
import { generateStylizedAvatar, validateImage } from '../services/geminiService';
import { GenerationResult } from '../types';

type SlotRole = 'person' | 'pet' | 'object';

interface OccasionStyleSlot {
  role: SlotRole;
  label: string;
}

interface OccasionStyle {
  id: string;
  label: string;
  image?: string | null;
  slots: OccasionStyleSlot[];
  requiresCakeReference?: boolean;
}

interface UploadSlot {
  id: number;
  role: SlotRole;
  label: string;
  userImage: string | null;
  result: GenerationResult;
  validationError?: string | null;
}

interface OccasionCustomizerProps {
  title: string;
  styles: OccasionStyle[];
  pricing: Record<string, Record<string, { current: string; original: string }>>;
}

const SIZES = ['4cm', '6cm', '8cm', '10cm'];
const SIZE_INCHES: Record<string, string> = {
  '4cm': '1.57 in',
  '6cm': '2.36 in',
  '8cm': '3.15 in',
  '10cm': '3.93 in',
};

const OccasionCustomizer: React.FC<OccasionCustomizerProps> = ({ title, styles, pricing }) => {
  const [selectedSize, setSelectedSize] = useState('6cm');
  const [selectedStyle, setSelectedStyle] = useState(styles[0]?.id || '');
  const [slots, setSlots] = useState<UploadSlot[]>([]);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [cakeResultUrl, setCakeResultUrl] = useState<string | null>(null);
  const [cakeResultStatus, setCakeResultStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const activeStyle = styles.find(s => s.id === selectedStyle) || styles[0];
  const price = pricing[selectedSize]?.[selectedStyle] || { current: 'N/A', original: 'N/A' };

  useEffect(() => {
    if (!pricing[selectedSize][selectedStyle]) {
      const firstAvailable = Object.keys(pricing[selectedSize])[0];
      setSelectedStyle(firstAvailable);
    }
  }, [selectedSize, selectedStyle, pricing]);

  useEffect(() => {
    const newSlots: UploadSlot[] = activeStyle.slots.map((s, idx) => ({
      id: idx,
      role: s.role,
      label: s.label,
      userImage: null,
      result: { imageUrl: '', originalUrl: '', status: 'idle' },
      validationError: null,
    }));
    setSlots(newSlots);
    setCakeResultUrl(null);
    setCakeResultStatus('idle');
  }, [selectedStyle, activeStyle.slots]);

  const handleImageUpload = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const uploadedImage = reader.result as string;
      setSlots(prev => prev.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              userImage: uploadedImage,
              result: { ...slot.result, status: 'idle' },
              validationError: null,
            }
          : slot
      ));
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSlot = async (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.userImage) return;

    setSlots(prev => prev.map(s => s.id === slotId ? {
      ...s,
      result: { ...s.result, status: 'loading' },
      validationError: null,
    } : s));

    try {
      const validation = await validateImage(slot.userImage, slot.role, selectedStyle);
      if (!validation.isValid) {
        setSlots(prev => prev.map(s => s.id === slotId ? {
          ...s,
          result: { ...s.result, status: 'idle' },
          validationError: validation.message,
        } : s));
        setValidationWarning(validation.message);
        return;
      }

      const generatedUrl = await generateStylizedAvatar(slot.userImage, slot.role, selectedStyle);
      setSlots(prev => prev.map(s =>
        s.id === slotId ? { ...s, result: { imageUrl: generatedUrl, originalUrl: slot.userImage!, status: 'success' } } : s
      ));
    } catch (error: any) {
      setSlots(prev => prev.map(s =>
        s.id === slotId ? { ...s, result: { ...s.result, status: 'error', errorMessage: error.message } } : s
      ));
    }
  };

  const allReady = selectedStyle === 'Cake'
    ? Boolean(cakeResultUrl)
    : slots.length > 0 && slots.every(slot => slot.result.status === 'success');

  const handleGenerateCake = async () => {
    const groomSlot = slots[0];
    const brideSlot = slots[1];

    if (!groomSlot?.userImage || !brideSlot?.userImage) {
      setValidationWarning('Please upload both groom and bride photos before generating the preview.');
      return;
    }

    setSlots(prev => prev.map(s => ({
      ...s,
      result: { ...s.result, status: 'loading' },
      validationError: null,
    })));
    setCakeResultStatus('loading');

    try {
      const groomValidation = await validateImage(groomSlot.userImage, groomSlot.role, selectedStyle);
      if (!groomValidation.isValid) {
        setSlots(prev => prev.map(s => s.id === groomSlot.id ? {
          ...s,
          result: { ...s.result, status: 'idle' },
          validationError: groomValidation.message,
        } : s));
        setValidationWarning(groomValidation.message);
        setCakeResultStatus('idle');
        return;
      }

      const brideValidation = await validateImage(brideSlot.userImage, brideSlot.role, selectedStyle);
      if (!brideValidation.isValid) {
        setSlots(prev => prev.map(s => s.id === brideSlot.id ? {
          ...s,
          result: { ...s.result, status: 'idle' },
          validationError: brideValidation.message,
        } : s));
        setValidationWarning(brideValidation.message);
        setCakeResultStatus('idle');
        return;
      }

      const generatedUrl = await generateStylizedAvatar(
        groomSlot.userImage,
        groomSlot.role,
        selectedStyle,
        brideSlot.userImage
      );
      setCakeResultUrl(generatedUrl);
      setCakeResultStatus('success');
      setSlots(prev => prev.map(s => ({
        ...s,
        result: { ...s.result, status: 'idle' },
        validationError: null,
      })));
    } catch (error: any) {
      setCakeResultStatus('error');
      setSlots(prev => prev.map(s =>
        s.id === groomSlot?.id || s.id === brideSlot?.id
          ? { ...s, result: { ...s.result, status: 'error', errorMessage: error.message } }
          : s
      ));
    }
  };

  return (
    <section className="py-16 md:pt-0 bg-gray-50">
      {/* Validation Warning Modal */}
      {validationWarning && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 animate-scale-up text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2">Attention!</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-8">{validationWarning}</p>
            <button
              onClick={() => setValidationWarning(null)}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {zoomedImageUrl && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col animate-fade-in">
          <div className="absolute top-6 right-6 z-[110]">
            <button
              onClick={() => setZoomedImageUrl(null)}
              className="p-3 bg-black hover:bg-white/20 rounded-full text-white transition-all shadow-xl"
              aria-label="Close Preview"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-0 md:p-8 overflow-hidden h-screen">
            <img
              src={zoomedImageUrl}
              alt="Zoomed Figure"
              className="h-full w-auto max-w-full object-contain animate-scale-up"
            />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-[1fr_1.5fr] divide-x divide-gray-100">
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-black italic text-gray-900 mb-12 tracking-tighter uppercase text-center">
                  {title}
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {styles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      disabled={!pricing[selectedSize][style.id]}
                      className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-2 ${
                        selectedStyle === style.id
                          ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/10'
                          : 'border-gray-200 hover:border-orange-200'
                      } ${!pricing[selectedSize][style.id] ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                    >
                      <img
                        src={style.image || ''}
                        alt={`${style.label} icon`}
                        className="w-28 h-36 object-contain"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                      <span className="text-md leading-tight">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-gray-900 italic">£{price.current}</span>
                  <span className="text-lg text-gray-400 line-through">£{price.original}</span>
                  <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase ml-2">60% OFF</span>
                </div>
                <p className="hidden md:block text-[11px] font-bold text-orange-600 uppercase tracking-widest leading-relaxed">
                  Personalized {selectedStyle} Figurine.<br />High detailed 3D modeling from your photos.
                </p>
              </div>
            </div>

            <div className="p-8 bg-white">
              <div className="flex flex-col h-full">
                <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border font-bold text-sm transition-all flex flex-col items-center min-w-[86px] ${
                        selectedSize === size
                          ? 'bg-black text-white border-black'
                          : 'bg-white border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span>{size}: {SIZE_INCHES[size]}</span>
                    </button>
                  ))}
                </div>

                <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative flex flex-col min-h-[400px]">
                  <div className="absolute top-0 left-0 w-full bg-orange-50 py-2 text-center border-b border-orange-100">
                    <span className="text-md font-black text-orange-600">Upload Customization</span>
                  </div>

                  <div className="mt-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    {slots.map((slot) => (
                      <div key={slot.id} className="flex flex-col items-center gap-4">
                        <p className="text-md font-black">{slot.label}</p>

                        <div className="w-full flex-1 h-[300px] bg-white rounded-xl border-2 border-dashed border-gray-200 relative overflow-hidden flex flex-col items-center justify-center p-4">
                          {slot.result.status === 'success' && selectedStyle !== 'Cake' ? (
                            <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative group">
                              <img src={slot.result.imageUrl} alt="Result" className="h-full w-full object-contain bg-white" />

                              <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
                                <button
                                  onClick={() => setZoomedImageUrl(slot.result.imageUrl)}
                                  className="p-2.5 bg-black/70 text-white rounded-full shadow-lg backdrop-blur-md hover:bg-orange-500 transition-colors"
                                  title="Magnify Figure"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => {
                                    if (selectedStyle === 'Cake') {
                                      setCakeResultUrl(null);
                                      setCakeResultStatus('idle');
                                    }
                                    setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, result: { ...s.result, status: 'idle' } } : s));
                                  }}
                                  className="p-2.5 bg-black/70 text-white rounded-full shadow-lg backdrop-blur-md hover:bg-orange-500 transition-colors"
                                  title="Reload photo"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v6h6M20 20v-6h-6M5 11a7 7 0 0112.18-3.9M19 13a7 7 0 01-12.18 3.9" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ) : slot.result.status === 'loading' ? (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                              <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Designing Character...</p>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRefs.current[slot.id]?.click()}
                              className={`w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 transition-all group ${slot.validationError ? 'border-red-300 bg-red-50' : ''}`}
                            >
                              {slot.userImage ? (
                                <div className="relative w-full h-full">
                                  <img src={slot.userImage} className="w-full h-full object-cover rounded-lg" alt="Upload preview" />
                                  {slot.validationError && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                      <div className="bg-red-500/80 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl text-center leading-relaxed">
                                        Issue detected
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <>
                                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-gray-100">
                                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
                                  </div>
                                  <span className="text-md font-bold tracking-widest">Upload Photo</span>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            type="file"
                            ref={el => { if (el) fileInputRefs.current[slot.id] = el; }}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(slot.id, e)}
                          />
                        </div>

                        {slot.userImage && slot.result.status === 'idle' && selectedStyle !== 'Cake' && (
                          <button
                            onClick={() => handleGenerateSlot(slot.id)}
                            className={`px-6 py-2 border-2 text-[10px] font-black uppercase rounded-full transition-all tracking-widest ${
                              slot.validationError
                                ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white'
                                : 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white'
                            }`}
                          >
                            {slot.validationError ? 'Retry Photo' : 'Generate Preview'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {selectedStyle === 'Cake' && (
                    <div className="px-4">
                      <div className="w-full h-[320px] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center overflow-hidden bg-white relative">
                        {cakeResultStatus === 'loading' ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Designing Character...</p>
                          </div>
                        ) : cakeResultUrl ? (
                          <div className="w-full h-full relative group">
                            <img src={cakeResultUrl} alt="Result" className="w-full h-full object-contain bg-white" />
                            <button
                              onClick={() => setZoomedImageUrl(cakeResultUrl)}
                              className="absolute top-3 right-3 p-2.5 bg-black/70 text-white rounded-full shadow-lg backdrop-blur-md hover:bg-orange-500 transition-colors"
                              title="Magnify Figure"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Result</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>


                {selectedStyle === 'Cake' && (
                  <button
                    onClick={handleGenerateCake}
                    disabled={!slots.every(slot => slot.userImage)}
                    className={`w-full mt-6 py-3 rounded-full font-black uppercase tracking-widest text-[11px] transition-all border-2 ${
                      slots.every(slot => slot.userImage)
                        ? 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white'
                        : 'border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Generate Preview
                  </button>
                )}

                <button
                  disabled={!allReady}
                  className={`w-full mt-8 py-5 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-all ${
                    allReady
                      ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20 active:translate-y-0.5'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default OccasionCustomizer;
