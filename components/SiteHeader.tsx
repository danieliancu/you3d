'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  'Hot Sale',
  'Choose Your Figure Style',
  'Accessories',
  'By Occasion',
  'By Recipient',
  'Greeting Card',
  'New In',
];

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1" aria-label="3D Figure home">
            <img src="/images/logo.png" alt="3D Figure logo" className="w-auto" style={{ height: '3rem' }} />
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-gray-700">
            {NAV_LINKS.map((label, idx) => (
              <a key={idx} href="#" className={label === 'Hot Sale' ? 'text-orange-500' : ''}>
                {label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 sm:block">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          <div className="relative p-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute top-1 right-1 bg-orange-500 text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold">
              0
            </span>
          </div>
          <button
            className="p-2 rounded-lg border border-gray-200 bg-white lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-2 text-[11px] font-bold uppercase tracking-wider text-gray-700">
            {NAV_LINKS.map((label, idx) => (
              <a
                key={idx}
                href="#"
                className={`py-2 ${label === 'Hot Sale' ? 'text-orange-500' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteHeader;
