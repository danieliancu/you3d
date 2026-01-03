import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms of Shipment | 3D Figure",
  description: "Shipping and delivery details, processing times, and rates for 3D Figure orders.",
};

const shippingRates = [
  { name: "Express Shipping (2-5 Business Days)", condition: "£0.00～£49.00", price: "£29.95" },
  { name: "Express Shipping (2-5 Business Days)", condition: "£49.00～£189.00", price: "£25.95" },
  { name: "Express Shipping (2-5 Business Days)", condition: "£189.00 and up", price: "Free" },
  { name: "Priority Shipping (Delivery Time 5-7 Business Days)", condition: "£0.00～£89.00", price: "£11.99" },
  { name: "Priority Shipping (Delivery Time 5-7 Business Days)", condition: "£89.00 and up", price: "Free" },
  { name: "STANDARD (7-9 BUSINESS DAYS)", condition: "£0.00～£59.00", price: "£9.99" },
  { name: "STANDARD (7-9 BUSINESS DAYS)", condition: "£59.00 and up", price: "Free" },
];

export default function TermsOfShipmentPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Shipping</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Terms of Shipment</h1>
            <p className="text-base md:text-lg text-gray-700">
              Delivery Time = Processing Time + Shipping Time. Please review the details below for timelines and policies.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Shipping & Delivery</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Usually production and shipping take up to 7 business days. During holidays, production time may vary.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Processing Time</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              All you3d.uk items are made-to-order. Popular styles ordered by 11PM PST ship the same day; most styles ship within 24 hours. Engraved or personalized orders may take 5-7 working days. During peak holiday and promotional periods, processing times may be longer.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Shipping Time & Rates</h2>
            <div className="grid gap-3">
              {shippingRates.map((rate, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-2 md:items-center bg-gray-50 rounded-2xl border border-gray-100 p-4">
                  <div className="text-sm md:text-base font-semibold text-gray-900">{rate.name}</div>
                  <div className="text-sm md:text-base text-gray-700">{rate.condition}</div>
                  <div className="text-sm md:text-base font-semibold text-orange-600">{rate.price}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Shipping to UK</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We offer FREE Standard Shipping on orders over £59 to the entire UK. For faster service, select Standard Shipping or Expedited. Expedited cannot deliver to P.O. Boxes or military addresses; those are served via Standard Shipping.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Shipping times are estimates from the day of shipping. Delays can occur due to factors such as weather, natural disaster, strikes, or other uncontrollable events.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Tracking My Order</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Once shipped, you will receive tracking details via email. You can also check status on the Track My Order page with your Order ID and Email. If your package is not delivered within the estimated timeframe, contact us for help.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Address Information</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Orders are processed quickly; please provide a correct and complete shipping address. If your shipping address differs from your billing address, specify this during checkout. We are not responsible for lost parcels due to incorrect shipping information.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
