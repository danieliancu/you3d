import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Terms & Conditions | 3D Figure",
  description: "Payment, ordering, shipping, and terms for 3D Figure services.",
};

export default function TermsConditionsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Terms</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Terms and Conditions</h1>
            <p className="text-base md:text-lg text-gray-700">
              Please review the following terms carefully before placing your order with 3D Figure.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Payment & Order</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Currently, for safety and convenience, we prefer to accept credit card &amp; PayPal as our main payment method.
              GB Pounds, U.S Dollars, Australia Dollars, Canadian Dollars and Euro are allowed.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold">Revise &amp; Order Cancel:</span> Within 2 hours upon placing order. To revise or cancel your order, please contact us within 2 hours after placing your order. Notes: We are not always able to revise or cancel an order already dispatched. Orders that have been dispatched will be treated in accordance with our Return policy.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Shipping</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              The orders are supposed to reach your door. Please track the status of the parcel via the tracking number provided in email. Then, contact local post office for parcel if not received within expected shipping time. Finally, contact us for further information.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Notes: Shipping estimates are from day of shipping, not from day of ordering. Customers are responsible for lost parcels due to wrong shipping information.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Modifications</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              you3d.uk reserves the right to modify this website, and the rules and regulations governing its use, at any time. Modifications will be posted on the website, and users are deemed to be apprised of and bound by any changes. you3d.uk may make changes in the products and/or services described in this website at any time.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Disclaimers</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              If parcels get lost due to the wrong shipping address provided by customers, we will not burden any losses. Under this condition, a refund will not be available.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Please note that although we make every effort to photograph our products accurately and describe them in detail, we cannot guarantee every photograph in production will accurately depict the actual color of the merchandise due to changes in screen resolution. Please contact us with any questions about the color, material, or size of any item before purchasing. We are not responsible for any losses caused by improper use, such as overstretching, or being dyed.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
