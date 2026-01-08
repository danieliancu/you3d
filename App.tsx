'use client';
import React, { useState, useRef, useEffect } from 'react';
import { generateStylizedAvatar, validateImage } from './services/geminiService';
import { GenerationResult } from './types';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import TestimonialsFaqSection from './components/TestimonialsFaqSection';
import { HOME_FAQ, TESTIMONIALS } from './content/homeSections';

interface UploadSlot {
  id: number;
  role: 'person' | 'pet';
  label: string;
  userImage: string | null;
  result: GenerationResult;
  validationError?: string | null;
}

const PRICING: Record<string, Record<string, { current: string; original: string }>> = {
  '4cm': {
    '1 person': { current: '29.95', original: '75.00' },
    '2 people': { current: '55.95', original: '120.00' },
    '1 pet': { current: '29.95', original: '50.00' },
    '1 person + 1 pet': { current: '55.95', original: '90.00' },
    'Non-human figure': { current: '29.95', original: '50.00' },
  },
  '6cm': {
    '1 person': { current: '39.95', original: '100.00' },
    '2 people': { current: '75.95', original: '189.00' },
    'Couple': { current: '80.95', original: '130.00' },
    '1 pet': { current: '45.95', original: '80.00' },
    '1 person + 1 pet': { current: '75.95', original: '130.00' },
    'Non-human figure': { current: '35.95', original: '70.00' },
  },
  '8cm': {
    '1 person': { current: '79.95', original: '130.00' },
    '2 people': { current: '150.00', original: '240.00' },
    'Couple': { current: '155.00', original: '250.00' },
    '1 pet': { current: '85.95', original: '140.00' },
    '1 person + 1 pet': { current: '150.00', original: '240.00' },
    'Non-human figure': { current: '79.95', original: '130.00' },
  },
  '10cm': {
    '1 person': { current: '120.00', original: '200.00' },
    '2 people': { current: '240.00', original: '380.00' },
  },
};

const STYLES = [
  { id: "1 person", label: "1 person", image: "/images/1person.webp", slots: [{ role: "person", label: "Photo" }] },
  { id: "2 people", label: "2 people", image: "/images/2person.webp", slots: [{ role: "person", label: "Person 1" }, { role: "person", label: "Person 2" }] },
  { id: "Couple", label: "Couple", image: "/images/2personConnected.webp", slots: [{ role: "person", label: "Both people (one photo)" }] },
  { id: "1 pet", label: "1 pet", image: "/images/pet.webp", slots: [{ role: "pet", label: "Pet Photo" }] },
  { id: "1 person + 1 pet", label: "1 person + 1 pet", image: "/images/1person1pet.webp", slots: [{ role: "person", label: "Person" }, { role: "pet", label: "Pet" }] },
  { id: "Non-human figure", label: "Non-human figure", image: "/images/nonhuman.webp", slots: [{ role: "person", label: "Figure Photo" }] },
];

const SIZES = ['4cm', '6cm', '8cm', '10cm'];
const SIZE_INCHES: Record<string, string> = {
  '4cm': '1.57 in',
  '6cm': '2.36 in',
  '8cm': '3.15 in',
  '10cm': '3.93 in',
};

const PRODUCTION_STEPS = [
  {
    title: 'Upload photos and preview',
    description: 'Share your shots and get an instant preview to lock in the pose and likeness.',
    image: '/images/1.webp',
  },
  {
    title: '3D modeling adjustments',
    description: 'Our artists refine details, proportions, and textures for a true-to-photo mini.',
    image: '/images/2.webp',
  },
  {
    title: 'High-detail of 3D printing',
    description: 'Premium printing captures fine features with a smooth, collector-grade finish.',
    image: '/images/3.webp',
  },
  {
    title: 'Secure, careful delivery',
    description: 'Each figurine is checked, packed with care, and shipped with tracking.',
    image: '/images/4.webp',
  },
];


const App: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('6cm');
  const [selectedStyle, setSelectedStyle] = useState('1 person');
  const [slots, setSlots] = useState<UploadSlot[]>([]);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const styleSectionRef = useRef<HTMLElement | null>(null);

  const activeStyle = STYLES.find(s => s.id === selectedStyle) || STYLES[0];
  const price = PRICING[selectedSize]?.[selectedStyle] || { current: 'N/A', original: 'N/A' };

  useEffect(() => {
    if (!PRICING[selectedSize][selectedStyle]) {
      const firstAvailable = Object.keys(PRICING[selectedSize])[0];
      setSelectedStyle(firstAvailable);
    }
  }, [selectedSize, selectedStyle]);

  useEffect(() => {
    const newSlots: UploadSlot[] = activeStyle.slots.map((s, idx) => ({
      id: idx,
      role: s.role as 'person' | 'pet',
      label: s.label,
      userImage: null,
      result: { imageUrl: '', originalUrl: '', status: 'idle' },
      validationError: null
    }));
    setSlots(newSlots);
  }, [selectedStyle]);

  const handleImageUpload = (slotId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlots(prev => prev.map(slot => 
          slot.id === slotId ? { ...slot, userImage: reader.result as string, result: { ...slot.result, status: 'idle' }, validationError: null } : slot
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSlot = async (slotId: number) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.userImage) return;

    setSlots(prev => prev.map(s => s.id === slotId ? {
      ...s,
      result: { ...s.result, status: 'loading' },
      validationError: null
    } : s));

    try {
      // 1. Validate Image First
      const validation = await validateImage(slot.userImage, slot.role, selectedStyle);
      
      if (!validation.isValid) {
        setSlots(prev => prev.map(s => s.id === slotId ? { 
          ...s, 
          result: { ...s.result, status: 'idle' },
          validationError: validation.message
        } : s));
        setValidationWarning(validation.message);
        return;
      }

      // 2. Proceed to Generation
      const generatedUrl = await generateStylizedAvatar(slot.userImage, slot.role, selectedStyle);
      setSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, result: { imageUrl: generatedUrl, originalUrl: slot.userImage!, status: 'success' } } : s
      ));
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found.")) {
        try {
          if ((window as any).aistudio?.openSelectKey) {
            await (window as any).aistudio.openSelectKey();
          }
        } catch (e) {
          console.error("Failed to open key selector:", e);
        }
      }
      setSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, result: { ...s.result, status: 'error', errorMessage: error.message } } : s
      ));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans selection:bg-orange-100">
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

      {/* Zoom Modal - Full Height */}
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

      <SiteHeader />

      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-[#F7F9FB]"
        style={{
          backgroundImage:
            "url('/images/hero.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24 grid lg:grid-cols-2 items-center gap-12 relative z-10">
          <div className="text-center lg:text-left space-y-5">
            <h1
              className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter drop-shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
              style={{ textShadow: '0 2px 8px black' }}
            >
              Turn your photo into a custom 3D figurine
            </h1>
            <p
              className="text-base leading-7 md:text-2xl md:leading-8 font-semibold text-white/90 max-w-xl mx-auto lg:mx-0 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
              style={{ textShadow: '0 2px 8px black' }}
              >
              Upload your photo and instantly preview your character ready for 3D printing. Printed in the UK. Quality guaranteed.
            </p>
            <button
              className="bg-white px-10 py-4 rounded-full text-orange-600 font-black text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
              onClick={() => styleSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            >
              Start customizing
            </button>
          </div>
        </div>
      </section>

      {/* Production Process */}
      <section className="bg-gray-50 py-0 md:py-16 pb-0 mt-0 md:mt-10">
        <div className="max-w-6xl mx-auto px-4">

          {/* Desktop/tablet: full illustrations and descriptions */}
          <div className="hidden md:flex md:flex-row md:items-center md:justify-between gap-8 md:gap-4">
            {PRODUCTION_STEPS.map((step, idx) => (
              <React.Fragment key={step.title}>
                <div className="flex-1 flex flex-col items-center text-center gap-4">
                  <div className="relative pt-12 md:pt-16 pb-8 px-6 w-full h-full flex flex-col items-center text-center gap-4 overflow-visible">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 hidden md:flex">
                      <div className="w-36 h-36 md:w-44 md:h-44 flex items-center justify-center overflow-visible">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="mb-0 md:mb-20 w-32 md:w-44 h-auto max-h-[14rem] md:max-h-[16rem] object-contain drop-shadow-xl"
                        />
                      </div>
                    </div>
                    <div
                      className="absolute -top-10 left-1/2 -translate-x-1/2 md:left-[-12px] md:translate-x-0 md:-top-3 w-20 h-20 rounded-full bg-orange-500 text-white font-black text-xl md:text-xxl flex items-center justify-center shadow-lg"
                      style= {{ fontSize:"4rem" }}
                    >
                      {idx + 1}
                    </div>
                    <div className="mt-0 md:mt-14 space-y-2">
                      <h3 className="text-lg font-black text-gray-900 leading-tight">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
                {idx < PRODUCTION_STEPS.length - 1 && (
                  <div className="hidden md:flex items-center justify-center w-12 shrink-0">
                    <svg className="w-12 h-12 text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8 24h28m-6-8 8 8-8 8" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile: simplified 4-column badges with arrows between */}
          <div className="mt-10 grid grid-cols-4 gap-6 items-start steps-grid md:hidden">
            {PRODUCTION_STEPS.map((step, idx) => (
              <div key={step.title} className="flex flex-col items-center text-center gap-3 step-card relative">
                <div className="step-number rounded-full bg-orange-500 text-white font-black flex items-center justify-center shadow-lg">
                  {idx + 1}
                </div>
                <p className="step-title text-gray-900 font-black leading-tight">
                  {step.title}
                </p>
                {idx < PRODUCTION_STEPS.length - 1 && (
                  <div className="arrow-mobile" aria-hidden="true">
                    <svg className="w-full h-full text-orange-300" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                      <path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M8 24h28m-6-8 8 8-8 8" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Selection */}
      <section className="py-16 md:pt-0 bg-gray-50" ref={styleSectionRef}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-[1fr_1.5fr] divide-x divide-gray-100">
              
              <div className="p-8">
                <div className="mb-8">
                   <h2 className="text-3xl md:text-4xl font-black italic text-gray-900 mb-12 tracking-tighter uppercase text-center">Choose Your Style:</h2>
                   <div className="grid grid-cols-3 gap-3">
                     {STYLES.map((style) => (
                       <button
                         key={style.id}
                         onClick={() => setSelectedStyle(style.id)}
                        disabled={!PRICING[selectedSize][style.id]}
                        className={`p-3 rounded-xl border transition-all text-center flex flex-col items-center gap-2 ${
                          selectedStyle === style.id
                            ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-500/10'
                            : 'border-gray-200 hover:border-orange-200'
                        } ${!PRICING[selectedSize][style.id] ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                       >
                         <img
                           src={style.image}
                           alt={`${style.label} icon`}
                           className="w-32 h-42 object-contain"
                           style={{ mixBlendMode:"multiply" }}
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
                    Personalized {selectedStyle} Figurine.<br/>High detailed 3D modeling from your photos.
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
                            {slot.result.status === 'success' ? (
                              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative group">
                                <img src={slot.result.imageUrl} alt="Result" className="h-full w-full object-cover" />
                                
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
                                    onClick={() => setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, result: { ...s.result, status: 'idle' } } : s))}
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
                                    <img src={slot.userImage} className="w-full h-full object-cover rounded-lg" />
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

                          {slot.userImage && slot.result.status === 'idle' && (
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
                  </div>

                  <button 
                    disabled={!slots.every(s => s.result.status === 'success')}
                    className={`w-full mt-8 py-5 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg transition-all ${
                      slots.every(s => s.result.status === 'success') 
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
      </section>

      <TestimonialsFaqSection faqs={HOME_FAQ} testimonials={TESTIMONIALS} />

      <SiteFooter />

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
        .steps-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }
        .step-card {
          gap: 12px;
          position: relative;
        }
        .step-number {
          width: 76px;
          height: 76px;
          font-size: 36px;
        }
        .step-title {
          font-size: 16px;
        }
        .arrow-mobile {
          position: absolute;
          top: 25%;
          right: clamp(-14px, -1vw, -8px);
          transform: translate(50%, -50%);
          width: clamp(18px, 6vw, 28px);
          height: clamp(18px, 6vw, 28px);
        }
        @media (max-width: 768px) {
          .step-card {
            gap: clamp(10px, 3vw, 14px);
          }
          .step-number {
            width: clamp(48px, 16vw, 64px);
            height: clamp(48px, 16vw, 64px);
            font-size: clamp(24px, 6vw, 32px);
          }
          .step-title {
            font-size: clamp(12px, 3.2vw, 15px);
          }
        }
      `}</style>
    </div>
  );
};

export default App;




