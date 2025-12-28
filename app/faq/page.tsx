'use client';

import React, { useState } from "react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

const FAQ_ITEMS: { q: string; body: React.ReactNode }[] = [
  {
    q: "SHIPPING & DELIVERY - How can I track my order?",
    body: (
      <div className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
        <p>You will receive a tracking number by email once the order is sent. Track it via “TRACK MY ORDER.”</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to http://www.My3DFigure.co.uk/trackorder/</li>
          <li>Enter the email used to place your order, then click “Check”.</li>
          <li>Click the yellow “Track” button for detailed info.</li>
        </ol>
      </div>
    ),
  },
  {
    q: "SHIPPING & DELIVERY - What if tracking is not updated?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        It may not have synced yet. Try again later. If there is no movement within a week, contact Customer Service via live chat or ticket.
      </p>
    ),
  },
  {
    q: "SHIPPING & DELIVERY - Do you ship worldwide?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Yes. If your country is not listed, contact us. Local taxes or customs fees may apply and are the customer’s responsibility.
      </p>
    ),
  },
  {
    q: "EXCHANGE & RETURN - Return & Cancellation Policy",
    body: (
      <div className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
        <p>New and unworn items: return within 60 days. Personalized items incur a 30% restocking fee; customer pays return/replacement postage.</p>
        <p>Cancellation: orders move to production quickly; cancellations may incur a 30% restocking fee.</p>
        <p>My3DFigureUK may amend this policy; changes will be published here.</p>
      </div>
    ),
  },
  {
    q: "ABOUT PAYMENT - My payment failed",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Common causes: insufficient funds, not authorized by card owner, incorrect billing details, or expired card. If none apply, contact Customer Service with order number, name, and email for an invoice to complete payment.
      </p>
    ),
  },
  {
    q: "ABOUT PAYMENT - Refund policy",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Refunds are processed within 24-48 hours after cancellation confirmation. Bank or issuer timing may vary.
      </p>
    ),
  },
  {
    q: "ABOUT PAYMENT - Accepted methods",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Major credit/debit cards. No cash on delivery or bank transfer. Prices are in GBP; your card is charged in your currency.
      </p>
    ),
  },
  {
    q: "ABOUT PAYMENT - Is it safe to order online?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Yes. We use encryption, server authentication, SSL, and other safeguards. Security and privacy are top priority.
      </p>
    ),
  },
  {
    q: "FAILED DELIVERY & ORDER LOST - What if I do not receive my order?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Track online and contact your carrier and our support. If the address is correct and the package is lost, we will replace or refund. Customers are responsible for losses due to incorrect addresses.
      </p>
    ),
  },
  {
    q: 'ORDER STATUS - Why is my status "Pending"?',
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        After payment, status shows “Processing” until shipped. If it stays “Pending,” contact Customer Service via chat or ticket.
      </p>
    ),
  },
  {
    q: "ORDER STATUS - How do I check my order info?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Use the payment confirmation email or log into your account &gt; MY ORDERS. You can also ask support with your order number (keep it for reference).
      </p>
    ),
  },
  {
    q: "ORDER STATUS - Was my order shipped when I got payment confirmation?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Payment confirmation means payment succeeded and the order is processing. If shipment is delayed, you will be notified.
      </p>
    ),
  },
  {
    q: "ORDER STATUS - Why haven't I received emails or replies?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Your email may be incorrect or filtered. Check spam/junk and use a primary email; adjust spam filters if needed.
      </p>
    ),
  },
  {
    q: "ORDER STATUS - How do I change or cancel after submission?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Contact Customer Service via chat or ticket. If already in shipping, changes or cancellation may not be possible. If it cannot be cancelled and you want to return/exchange later, support can assist.
      </p>
    ),
  },
  {
    q: "ORDER STATUS - How long will delivery take?",
    body: (
      <div className="space-y-2 text-sm md:text-base text-gray-700 leading-relaxed">
        <p>Delivery = Processing + Shipping.</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Processing: personalized items typically 1-5 business days; tracking sent automatically when shipped.</li>
          <li>Shipping: estimate starts from ship date, not order date. Delays can happen due to quality control or remakes.</li>
        </ul>
        <p>Customers are responsible for lost orders due to incorrect addresses.</p>
      </div>
    ),
  },
  {
    q: "BUYING ONLINE - I cannot checkout",
    body: (
      <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-gray-700 leading-relaxed">
        <li>Remove out-of-stock items.</li>
        <li>Complete all required fields (shipping address and method).</li>
        <li>Try another browser; ensure device clock is accurate.</li>
        <li>If still stuck, contact Customer Service via chat or ticket.</li>
      </ul>
    ),
  },
  {
    q: "BUYING ONLINE - Trouble uploading photos",
    body: (
      <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-gray-700 leading-relaxed">
        <li>Check pop-up error messages.</li>
        <li>Try a different browser (desktop) or ensure stable network (mobile).</li>
        <li>Use JPG or PNG (no PDF).</li>
        <li>Try another photo; if still failing, contact Customer Service.</li>
      </ul>
    ),
  },
  {
    q: "BUYING ONLINE - I cannot add items to cart",
    body: (
      <ul className="list-disc list-inside space-y-1 text-sm md:text-base text-gray-700 leading-relaxed">
        <li>Item may be out of stock or has a minimum purchase.</li>
        <li>Required fields may be missing.</li>
        <li>Could be website or network issues - try again later or contact support.</li>
      </ul>
    ),
  },
  {
    q: "COUPON CODE - How can I get a discount?",
    body: (
      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Subscribe to the newsletter for deals and offers, and check www.My3DFigure.co.uk for promotions. Support can assist if you need help applying a code.
      </p>
    ),
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Help Center</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Frequently Asked Questions</h1>
            <p className="text-base md:text-lg text-gray-700">
              Find answers about shipping, returns, payments, order status, buying online, and discounts.
            </p>
          </header>

          <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-0">
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full py-5 flex justify-between items-center text-left"
                  >
                    <span className="text-md font-bold uppercase tracking-wide text-gray-700">{faq.q}</span>
                    <span className="text-gray-400 text-xl font-light">{openIndex === idx ? '-' : '+'}</span>
                  </button>
                  {openIndex === idx && (
                    <div className="pb-5">
                      <div className="text-md text-gray-500 leading-relaxed">{faq.body}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
