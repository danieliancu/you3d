import React from 'react';

export const HOME_FAQ: { q: string; body: React.ReactNode }[] = [
  {
    q: 'How long does it take?',
    body: <p className="text-md text-gray-500 leading-relaxed">Standard production takes 3-5 business days, plus shipping time.</p>,
  },
  {
    q: 'Why choose our mini figures?',
    body: <p className="text-md text-gray-500 leading-relaxed">We use premium high-detail 3D printing and expert digital sculpting for maximum likeness.</p>,
  },
  {
    q: 'Can I change my preview? How to charge?',
    body: <p className="text-md text-gray-500 leading-relaxed">Previews are generated instantly and free. You can change your photo and regenerate until you are satisfied before printing.</p>,
  },
  {
    q: 'Do you crop the photo for me?',
    body: <p className="text-md text-gray-500 leading-relaxed">Our AI and designers handle composition to ensure the best full-body 3D result.</p>,
  },
];

export const TESTIMONIALS = [
  { author: 'Daphne Clara', text: 'This figurine is incredibly detailed and looks just like my friend -- best gift idea ever.', rating: 5 },
  { author: 'Franklin Sweet', text: "I can't believe how realistic the 3D printed character turned out. Perfect birthday surprise.", rating: 5 },
  { author: 'Alger Morris', text: 'Personalization options are awesome and the print quality is top-notch.', rating: 5 },
  { author: 'Abraham Smith', text: 'Such a unique way to surprise someone with their own miniature statue.', rating: 5 },
  { author: 'Maya Torres', text: 'The AI preview matched my photo and the final piece looked premium.', rating: 5 },
  { author: 'Leo Martins', text: 'Fast turnaround and the vinyl finish feels like a designer toy.', rating: 5 },
  { author: 'Chloe Bennett', text: 'Loved the pet figurine -- captures all the little markings perfectly.', rating: 5 },
  { author: 'Iris Cole', text: 'Great customer support and the pose guidance made it easy to upload.', rating: 5 },
];
