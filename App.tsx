import React, { useState, useRef, useEffect } from 'react';
import { generateStylizedAvatar, validateImage } from './services/geminiService';
import { GenerationResult } from './types';

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
    '2 people (connected)': { current: '80.95', original: '130.00' },
    '1 pet': { current: '45.95', original: '80.00' },
    '1 person + 1 pet': { current: '75.95', original: '130.00' },
    'Non-human figure': { current: '35.95', original: '70.00' },
  },
  '8cm': {
    '1 person': { current: '79.95', original: '130.00' },
    '2 people': { current: '150.00', original: '240.00' },
    '2 people (connected)': { current: '155.00', original: '250.00' },
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
  { id: '1 person', label: '1 person', icon: '👤', slots: [{ role: 'person', label: 'Photo' }] },
  { id: '2 people', label: '2 people', icon: '👥', slots: [{ role: 'person', label: 'Person 1' }, { role: 'person', label: 'Person 2' }] },
  { id: '2 people (connected)', label: '2 people (connected)', icon: '🫂', slots: [{ role: 'person', label: 'Person 1' }, { role: 'person', label: 'Person 2' }] },
  { id: '1 pet', label: '1 pet', icon: '🐕', slots: [{ role: 'pet', label: 'Pet Photo' }] },
  { id: '1 person + 1 pet', label: '1 person + 1 pet', icon: '🧍🐕', slots: [{ role: 'person', label: 'Person' }, { role: 'pet', label: 'Pet' }] },
  { id: 'Non-human figure', label: 'Non-human figure', icon: '🧸', slots: [{ role: 'person', label: 'Figure Photo' }] },
];

const SIZES = ['4cm', '6cm', '8cm', '10cm'];

const App: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState('6cm');
  const [selectedStyle, setSelectedStyle] = useState('1 person');
  const [slots, setSlots] = useState<UploadSlot[]>([]);
  const [isFaqOpen, setIsFaqOpen] = useState<number | null>(null);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const activeStyle = STYLES.find(s => s.id === selectedStyle) || STYLES[0];
  const price = PRICING[selectedSize]?.[selectedStyle] || { current: 'N/A', original: 'N/A' };

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

    if (!PRICING[selectedSize][selectedStyle]) {
      const firstAvailable = Object.keys(PRICING[selectedSize])[0];
      setSelectedStyle(firstAvailable);
    }
  }, [selectedStyle, selectedSize]);

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
      const generatedUrl = await generateStylizedAvatar(slot.userImage, slot.role);
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
    <div className="bg-white min-h-screen text-gray-800 font-sans selection:bg-orange-100">
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
              Understood (OK)
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
               className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-xl"
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

      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black italic tracking-tighter text-blue-600">3D</span>
              <span className="text-2xl font-black italic tracking-tighter text-orange-500">Figure</span>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-gray-700">
              <a href="#" className="text-orange-500">Hot Sale</a>
              <a href="#">Choose Your Figure Style</a>
              <a href="#">Accessories</a>
              <a href="#">By Occasion</a>
              <a href="#">By Recipient</a>
              <a href="#">Greeting Card</a>
              <a href="#">New In</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hidden sm:block"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></button>
            <div className="relative p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">0</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#F7F9FB]">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-24 grid lg:grid-cols-2 items-center gap-12">
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-black text-orange-500 italic uppercase leading-[0.9] tracking-tighter mb-4 drop-shadow-sm">
              20% OFF<br />
              <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">the 2nd</span>
            </h1>
            <button className="mt-8 bg-white px-10 py-4 rounded-full text-orange-600 font-black text-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Shop Now
            </button>
          </div>
          <div className="relative">
             <img 
               src="https://images.unsplash.com/photo-1620428835823-d6353393c521?auto=format&fit=crop&q=80&w=800" 
               alt="Hero" 
               className="w-full h-auto rounded-3xl object-cover shadow-2xl" 
             />
          </div>
        </div>
      </section>

      {/* Product Selection */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-[1fr_1.5fr] divide-x divide-gray-100">
              
              <div className="p-8 lg:p-12">
                <div className="mb-8">
                   <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Choose Your Style:</h2>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                         <span className="text-2xl">{style.icon}</span>
                         <span className="text-[10px] font-bold uppercase leading-tight">{style.label}</span>
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
                  <p className="text-[11px] font-bold text-orange-600 uppercase tracking-widest leading-relaxed">
                    Personalized {selectedStyle} Figurine.<br/>High detailed 3D modeling from your photos.
                  </p>
                </div>
              </div>

              <div className="p-8 lg:p-12 bg-gray-50/30">
                <div className="flex flex-col h-full">
                  <div className="flex flex-wrap gap-2 mb-8 justify-center lg:justify-start">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border font-bold text-[10px] uppercase transition-all ${
                          selectedSize === size
                            ? 'bg-black text-white border-black'
                            : 'bg-white border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative flex flex-col min-h-[400px]">
                    <div className="absolute top-0 left-0 w-full bg-orange-50 py-2 text-center border-b border-orange-100">
                      <span className="text-[10px] font-black uppercase text-orange-600 tracking-widest">Upload Customization</span>
                    </div>
                    
                    <div className="mt-8 flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                      {slots.map((slot) => (
                        <div key={slot.id} className="flex flex-col items-center gap-4">
                          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{slot.label}</p>
                          
                          <div className="w-full flex-1 h-[300px] bg-white rounded-xl border-2 border-dashed border-gray-200 relative overflow-hidden flex flex-col items-center justify-center p-4">
                            {slot.result.status === 'success' ? (
                              <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in relative group">
                                <img src={slot.result.imageUrl} alt="Result" className="h-full w-full object-contain" />
                                
                                <button 
                                  onClick={() => setZoomedImageUrl(slot.result.imageUrl)}
                                  className="absolute top-2 right-2 p-2.5 bg-black/70 text-white rounded-full shadow-lg backdrop-blur-md z-10 hover:bg-orange-500 transition-colors"
                                  title="Magnify Figure"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                  </svg>
                                </button>

                                <button 
                                  onClick={() => setSlots(prev => prev.map(s => s.id === slot.id ? { ...s, result: { ...s.result, status: 'idle' } } : s))}
                                  className="text-[9px] uppercase font-bold text-gray-400 underline mt-2 hover:text-orange-500 transition-colors"
                                >
                                  Change
                                </button>
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
                                    <img src={slot.userImage} className="w-full h-full object-cover rounded-lg opacity-60" />
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
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upload Photo</span>
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

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { author: 'Daphne Clara', text: 'Wow this figurine is so detailed and looks just like my friend who posed for it! Great gift idea.', rating: 5 },
              { author: 'Franklin Sweet', text: "OMG I can't believe how realistic the 3D printed character turned out to be. Perfect present for her birthday.", rating: 5 },
              { author: 'Alger Morris', text: 'The personalization options are awesome and the quality of the figurine is top-notch really cool.', rating: 5 },
              { author: 'Abraham Smith', text: 'What a unique way to surprise someone special with their own likeness in an awesome little statue.', rating: 5 }
            ].map((t, idx) => (
              <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                   <div className="flex gap-1 mb-4">
                     {Array.from({length: t.rating}).map((_, i) => <span key={i} className="text-orange-400 text-[10px]">★</span>)}
                   </div>
                   <p className="text-[11px] leading-relaxed text-gray-600 font-medium italic mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-black text-orange-600 uppercase">
                    {t.author.charAt(0)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide text-gray-900">{t.author}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-black italic text-gray-900 mb-12 tracking-tighter uppercase text-center">Frequently Asked Questions</h2>
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="space-y-4">
              {[
                { q: 'How long does it take?', a: 'Standard production takes 3-5 business days, plus shipping time.' },
                { q: 'Why choose our mini figures?', a: 'We use premium high-detail 3D printing and expert digital sculpting for maximum likeness.' },
                { q: 'Can I change my preview?', a: 'Previews are generated instantly. You can change your photo until you are satisfied with the result.' },
                { q: 'Do you crop the photo for me?', a: 'Our AI and designers handle all composition to ensure the best full-body 3D result.' }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  <button 
                    onClick={() => setIsFaqOpen(isFaqOpen === idx ? null : idx)}
                    className="w-full py-5 flex justify-between items-center text-left"
                  >
                    <span className="text-xs font-bold uppercase tracking-wide text-gray-700">{faq.q}</span>
                    <span className="text-gray-400 text-xl font-light">{isFaqOpen === idx ? '−' : '+'}</span>
                  </button>
                  {isFaqOpen === idx && (
                    <div className="pb-5">
                      <p className="text-xs text-gray-500 leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Terms & Policies</h3>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Track My Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Return & Exchange Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Company Info</h3>
              <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Contact Us</h3>
              <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                <p>Mon. - Fri. 9:00 AM - 6:00 PM</p>
                <p>6050 WESTWOOD AVESTE, CHICAGO IL</p>
                <p>cs@my3dfigure.co.uk</p>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-8">
                <span className="text-xl font-black italic tracking-tighter text-blue-500">3D</span>
                <span className="text-xl font-black italic tracking-tighter text-orange-500">Figure</span>
              </div>
              <div className="flex gap-4">
                 <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">f</a>
                 <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">y</a>
                 <a href="#" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">t</a>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-center">
             <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">© 2024 3DFigure. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

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
    </div>
  );
};

export default App;