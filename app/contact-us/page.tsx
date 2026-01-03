import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Contact Us | 3D Figure",
  description: "Get in touch with you3d.uk for order status, support, and FAQs.",
};

const photoTips = [
  "Make sure your photo has good lighting—enough to see details, but not overexposed.",
  "A head-on shot is preferred; include full face, ears, and forehead (avoid side profiles).",
  "Avoid blurry photos; higher clarity yields better results in the final product.",
];

const cancellationPolicy = [
  "We can change color/size/picture or cancel/refund before production. Contact us ASAP with order number, email, and requested changes.",
  "For made-to-order personalized products already in production, changes/cancellations may incur a £9 customization fee per item.",
  "Address changes are possible until the order ships—include current and updated addresses.",
  "See our Return Policy for more details.",
];

const faqs = [
  {
    question: "What payment options are available?",
    answer:
      "We accept all major credit cards. Prices are listed in GBP; your card is charged in your respective currency.",
  },
  {
    question: "How long does it take to receive my product?",
    answer:
      "Production and dispatch take about 7-9 business days. Holiday periods may extend production.",
  },
];

export default function ContactUsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Support</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Contact Us</h1>
            <p className="text-sm md:text-base text-gray-700">
              Want to check your order status? Monday–Friday, 09:00–18:00 UTC+8. Email replies in 24 hrs (Mon–Fri).
            </p>
            <p className="text-sm md:text-base text-gray-700">
              Customer email: <a href="mailto:office@you3d.uk" className="text-orange-600 underline">office@you3d.uk</a>
            </p>
            <p className="text-sm md:text-base text-gray-700">Refer to our FAQ for quick answers.</p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">What makes a good photo?</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-800">
              {photoTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ol>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Change / Cancellation Policy</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-800">
              {cancellationPolicy.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <p className="text-sm md:text-base text-gray-700">
              Contact us with your order number, email address, and desired changes.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">FAQ</h2>
            <div className="space-y-3">
              {faqs.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-sm md:text-base font-semibold text-gray-900 mb-1">{item.question}</p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{item.answer}</p>
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
