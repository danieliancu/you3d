'use client';

import React from 'react';
import SiteHeader from '../../../components/SiteHeader';
import SiteFooter from '../../../components/SiteFooter';
import OccasionCustomizer from '../../../components/OccasionCustomizer';
import TestimonialsFaqSection from '../../../components/TestimonialsFaqSection';
import { HOME_FAQ, TESTIMONIALS } from '../../../content/homeSections';

const WEDDING_PRICING: Record<string, Record<string, { current: string; original: string }>> = {
  '4cm': {
    'Groom': { current: '29.95', original: '75.00' },
    'Bride': { current: '29.95', original: '75.00' },
    'Couple': { current: '55.95', original: '120.00' },
    'Groom + Bride': { current: '55.95', original: '120.00' },
    'Cake': { current: '29.95', original: '75.00' },
  },
  '6cm': {
    'Groom': { current: '39.95', original: '100.00' },
    'Bride': { current: '39.95', original: '100.00' },
    'Couple': { current: '80.95', original: '130.00' },
    'Groom + Bride': { current: '75.95', original: '189.00' },
    'Cake': { current: '39.95', original: '100.00' },
  },
  '8cm': {
    'Groom': { current: '79.95', original: '130.00' },
    'Bride': { current: '79.95', original: '130.00' },
    'Couple': { current: '155.00', original: '250.00' },
    'Groom + Bride': { current: '150.00', original: '240.00' },
    'Cake': { current: '79.95', original: '130.00' },
  },
  '10cm': {
    'Groom': { current: '120.00', original: '200.00' },
    'Bride': { current: '120.00', original: '200.00' },
    'Couple': { current: '240.00', original: '380.00' },
    'Groom + Bride': { current: '240.00', original: '380.00' },
    'Cake': { current: '120.00', original: '200.00' },
  },
};

const WEDDING_STYLES = [
  {
    id: 'Groom',
    label: 'Groom',
    image: '/images/occasion/wedding/wedding-groom.png',
    slots: [{ role: 'person', label: 'Groom Photo' }],
  },
  {
    id: 'Bride',
    label: 'Bride',
    image: '/images/occasion/wedding/wedding-bride.png',
    slots: [{ role: 'person', label: 'Bride Photo' }],
  },
  {
    id: 'Couple',
    label: 'Couple',
    image: '/images/occasion/wedding/wedding-couple-hands.png',
    slots: [{ role: 'person', label: 'Couple Photo' }],
  },
  {
    id: 'Groom + Bride',
    label: 'Groom + Bride',
    image: '/images/occasion/wedding/wedding-groom-bride-2photos.png',
    slots: [
      { role: 'person', label: 'Groom Photo' },
      { role: 'person', label: 'Bride Photo' },
    ],
  },
  {
    id: 'Cake',
    label: 'Cake',
    image: '/images/occasion/wedding/wedding-cake.png',
    slots: [
      { role: 'person', label: 'Groom Photo' },
      { role: 'person', label: 'Bride Photo' },
    ],
  },
];

export default function WeddingOccasionPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <div className="text-center space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-600">By Occasion</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Wedding Collection</h1>
            <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Choose the wedding style, upload photos, and generate a personalized 3D preview ready for printing.
            </p>
          </div>
        </div>

        <OccasionCustomizer
          title="Choose Your Style:"
          styles={WEDDING_STYLES}
          pricing={WEDDING_PRICING}
        />
      </main>
      <TestimonialsFaqSection faqs={HOME_FAQ} testimonials={TESTIMONIALS} />
      <SiteFooter />
    </>
  );
}
