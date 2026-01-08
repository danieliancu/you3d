'use client';

import React, { useState } from 'react';

interface FaqItem {
  q: string;
  body: React.ReactNode;
}

interface Testimonial {
  author: string;
  text: string;
  rating: number;
}

interface TestimonialsFaqSectionProps {
  faqs: FaqItem[];
  testimonials: Testimonial[];
}

const TestimonialsFaqSection: React.FC<TestimonialsFaqSectionProps> = ({ faqs, testimonials }) => {
  const [isFaqOpen, setIsFaqOpen] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const handleNextTestimonial = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <>
      {/* Testimonials */}
      <section className="pt-8 pb-24 md:py-18 bg-gray-50">
        <div className="w-full px-4">
          {/* Desktop/tablet marquee */}
          <div className="overflow-hidden relative hidden md:block">
            <div className="flex gap-6 animate-marquee will-change-transform">
              {testimonials.concat(testimonials).map((t, idx) => (
                <div
                  key={`${t.author}-${idx}`}
                  className="min-w-[260px] sm:min-w-[320px] max-w-sm p-7 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-orange-400 text-lg">★</span>)}
                    </div>
                    <p className="text-base leading-relaxed text-gray-700 font-medium italic mb-6">"{t.text}"</p>
                  </div>
                  <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                    <span className="text-sm font-semibold tracking-wide text-orange-400">{t.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile slider */}
          <div className="md:hidden relative w-full">
            <div className="p-7 bg-white rounded-2xl border border-gray-100 flex flex-col justify-between shadow-sm min-h-[240px]">
              <div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonials[testimonialIndex].rating }).map((_, i) => (
                    <span key={i} className="text-orange-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-base leading-relaxed text-gray-700 font-medium italic mb-6">
                  "{testimonials[testimonialIndex].text}"
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                <span className="text-sm font-semibold tracking-wide text-orange-400">
                  {testimonials[testimonialIndex].author}
                </span>
              </div>
            </div>
            <button
              onClick={handlePrevTestimonial}
              className="absolute -left-3 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 active:scale-95"
              aria-label="Previous testimonial"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNextTestimonial}
              className="absolute -right-3 top-1/2 -translate-y-1/2 p-3 bg-white rounded-full shadow-lg border border-gray-200 active:scale-95"
              aria-label="Next testimonial"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="pb-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black italic text-gray-900 mb-12 tracking-tighter uppercase text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="flex items-center justify-center h-full">
              <img
                src="/images/group.webp"
                alt="Customers with 3D figures"
                className="h-auto md:max-h-96 w-auto relative md:absolute"
                style={{ mixBlendMode: 'multiply', objectFit: 'contain' }}
              />
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 last:border-0">
                    <button
                      onClick={() => setIsFaqOpen(isFaqOpen === idx ? null : idx)}
                      className="w-full py-5 flex justify-between items-center text-left"
                    >
                      <span className="text-md font-bold uppercase tracking-wide text-gray-700">{faq.q}</span>
                      <span className="text-gray-400 text-xl font-light">{isFaqOpen === idx ? '-' : '+'}</span>
                    </button>
                    {isFaqOpen === idx && (
                      <div className="pb-5">
                        <div className="text-md text-gray-500 leading-relaxed">{faq.body}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 22s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 16s;
          }
        }
      `}</style>
    </>
  );
};

export default TestimonialsFaqSection;
