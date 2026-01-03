import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Return & Exchange Policy | 3D Figure",
  description: "Details about our 90-day return and exchange policy, steps, coverage, and precautions.",
};

const steps = [
  {
    title: "STEP 1",
    detail: (
      <>
        Contact Customer Service and request return detail.
        <br />
        Email: <a className="underline text-orange-600" href="mailto:office@you3d.uk">office@you3d.uk</a>
      </>
    ),
  },
  { title: "STEP 2", detail: "Customer will receive an email notification once your request is approved." },
  { title: "STEP 3", detail: "The customer packs the package and sends it." },
  { title: "STEP 4", detail: "Get refund or replacement after we receive the products." },
];

const fullCoverage = [
  "The product customization information does not match or there's an error in customization.",
  "We sent the wrong order or item(s), you received any broken items, or the quality of the product you received is poor/defective.",
  "Unclear pictures rendering or lettering.",
  "Wrong or mismatched size.",
];

const noReturn = [
  "Products that exceed the return processing time limit (90 days after the order is signed).",
  "The non-quality issue for personalized products.",
  "Product damaged by misuse, mishandling, or poor maintenance.",
  "Items that have been washed, worn, or soiled and damaged resulting from customer's handling. For safety and hygiene reasons, personal items such as underwear, swimwear, socks, etc.",
  "Chose the wrong size for the product.",
  "Personal Reasons due to personal taste, change of mind etc.",
  "Partial returns or exchange of products from a set item is not acceptable.",
];

const precautions = [
  "Items that are being returned should be new and unworn. They should be kept in its original condition in which you received.",
  "Coupon codes expires after using cannot be restored after return.",
  "For personalized products, if you need to cancel or replace the product or replace the personalized content, you will have to pay 30% of the product price as the customization fee. (Special note: Even if you contact us immediately after placing the order to cancel/modify, we will charge the corresponding production fee because the customized product will be produced immediately once the order is placed in order to ensure a timely production and delivery.)",
  "The return packaging must use the original packaging, and the packaging should be intact.",
  "Return address: 13 Vernon Court,425 Sutton Road, Southend-on-Sea, Essex, SS2 5AP, United Kingdom.",
  "We reserve the right to make any changes to this policy at any time. Notification of any changes will be posted on this page. If you have any questions about cancellations or any of our other policies, please contact our customer service.",
];

export default function ReturnExchangePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Return & Exchange</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">90 Days Return / Exchange Policy</h1>
            <p className="text-base md:text-lg text-gray-700">
              We support a 90-day return policy. If you purchase a warranty, you can extend this period to 180 days.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              {steps.map((step, idx) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600 mb-2">{step.title}</p>
                  <p className="text-sm md:text-base text-gray-800 leading-relaxed">{step.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Full Coverage Return / Exchange Policy</h2>
            <p className="text-sm md:text-base text-gray-700">
              The following reasons are covered by our 90-day full coverage return/exchange policy. We will be responsible for the return postage fees and replacement fees.
            </p>
            <ul className="space-y-3 text-sm md:text-base text-gray-800 list-decimal list-inside">
              {fullCoverage.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">No Return & Exchange</h2>
            <p className="text-sm md:text-base text-gray-700">
              The following reasons are not covered by our 90-day return policy. We are not liable for these issues.
            </p>
            <ul className="space-y-3 text-sm md:text-base text-gray-800 list-decimal list-inside">
              {noReturn.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Precautions for Return and Exchange</h2>
            <ul className="space-y-3 text-sm md:text-base text-gray-800 list-decimal list-inside">
              {precautions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
