"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const SiteFooter: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honey: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.honey.trim()) return; // Honeypot catches simple bots

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    const subject = encodeURIComponent(`Website message from ${name || 'visitor'}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    const mailtoLink = `mailto:dani.iancu@yahoo.com?subject=${subject}&body=${body}`;

    setIsSubmitting(true);
    try {
      window.location.href = mailtoLink;
    } finally {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '', honey: '' });
    }
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-4">

          <div>
          <Link href="/" className="flex items-center gap-1" aria-label="3D Figure home">
            <img src="/images/logo.png" alt="3D Figure logo" className="w-auto mb-4" style={{ height: '3rem' }} />
          </Link>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <li><a href="/about-us" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact-us" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Terms & Policies</h3>
            <ul className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Track My Order</a></li>
              <li><a href="/return-and-exchange" className="hover:text-white transition-colors">Return & Exchange Policy</a></li>
              <li><a href="/terms-of-shipment" className="hover:text-white transition-colors">Terms of Shipment</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-gray-500">Contact Us</h3>
            <div className="space-y-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <p>Mon. - Fri. 9:00 AM - 6:00 PM</p>
              <p>425 Sutton Road, Southend-on-Sea, Essex, SS2 5AP</p>
              <p><a href="mailto:office@you3d.uk">office@you3d.uk</a></p>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Send a Message</h3>
            <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="hidden">
                <label>
                  <span className="sr-only">Leave this field empty</span>
                  <input
                    type="text"
                    name="honey"
                    value={formData.honey}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="new-password"
                  />
                </label>
            </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={80}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none"
                  placeholder="you@example.com"
                  inputMode="email"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  maxLength={1000}
                  rows={4}
                  className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm text-white focus:border-white/40 focus:outline-none resize-none"
                  placeholder="Tell us what you need"
                />
            </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] py-3 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Securely
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/5 text-center">
           <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.3em]">© 2024 You3D. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
