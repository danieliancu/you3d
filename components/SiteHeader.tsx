'use client';

import React, { useState } from 'react';
import Link from 'next/link';

type NavItem = string | { label: string; href: string };

const NAV_LINKS: { label: string; items: NavItem[] }[] = [
  {
    label: 'BY OCCASION',
    items: [
      { label: 'Wedding', href: '/by-occasion/wedding' },
      'Birthday',
      "Mother's Day",
      "Father's Day",
      'Sports',
      'Travel',
      'Graduation',
    ],
  },
  {
    label: 'BY RECIPIENT',
    items: [
      'For Team',
      'For Family',
      'For Dad',
      'For Couple',
      'For Graduates',
      'For Pet Lovers',
      'For Mom',
      'For Brother',
      'For Sister',
      'For Policeman',
      'For Nurse',
      'For Boss',
      'For Travel Lover',
      'For Doctor',
      'For Sport Lover',
      'Cosplay',
    ],
  },
];

const PAGE_LINKS = [
  { label: 'About Us', href: '/about-us' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact Us', href: '/contact-us' },
];

const SiteHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const resolveItem = (item: NavItem) => ({
    label: typeof item === 'string' ? item : item.label,
    href: typeof item === 'string' ? '#' : item.href,
  });

  return (
    <nav className="border-b sticky top-0 bg-white/95 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1" aria-label="3D Figure home">
            <img src="/images/logo.webp" alt="3D Figure logo" className="w-auto" style={{ height: '3rem' }} />
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-gray-700 uppercase">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="relative group">
                <button className="flex items-center gap-1 hover:text-orange-500 transition-colors">
                  {link.label}
                  <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M5.5 7.5l4.5 4.5 4.5-4.5" />
                  </svg>
                </button>
                <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all">
                  <div className="bg-white border border-gray-100 rounded-xl shadow-xl p-3 min-w-[220px]">
                    <div className="grid gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      {link.items.map((item) => {
                        const { label, href } = resolveItem(item);
                        return (
                          <a key={label} href={href} className="px-3 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors">
                            {label}
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {PAGE_LINKS.map((link) => (
              <a key={link.label} href={link.href} className="hover:text-orange-500 transition-colors uppercase">
                {link.label}
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
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-4 text-[11px] font-bold uppercase tracking-wider text-gray-700 uppercase">
            {NAV_LINKS.map((link) => (
              <div key={link.label} className="flex flex-col gap-2">
                <span className="py-2 uppercase">{link.label}</span>
                <div className="grid gap-1 pl-3">
                  {link.items.map((item) => {
                    const { label, href } = resolveItem(item);
                    return (
                      <a
                        key={label}
                        href={href}
                        className="py-1.5 text-gray-600 hover:text-orange-600 transition-colors uppercase"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-2">
              {PAGE_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="py-2 hover:text-orange-600 transition-colors uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteHeader;
