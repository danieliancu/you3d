import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "Privacy Policy | 3D Figure",
  description: "Privacy and cookie statement for you3d.uk, including data collection, use, and rights.",
};

const lastUpdatedPrivacy = "May 21st, 2025";
const lastUpdatedCookie = "May 2nd, 2018";

export default function PrivacyPolicyPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">Privacy Statement / Cookie Statement</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Privacy Policy</h1>
            <p className="text-base md:text-lg text-gray-700">Last Modified: {lastUpdatedPrivacy}</p>
            <p className="text-sm md:text-base text-gray-700">
              This Privacy Statement explains how you3d.uk (“you3d.uk,” “we,” “us,” or “our”) collects, uses, shares, and processes your information.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Collection and Use of Personal Data</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Personal data is information that can directly or indirectly identify you. It does not include data that has been irreversibly anonymized or aggregated.
            </p>
            <div className="space-y-3 text-sm md:text-base text-gray-800">
              <p className="font-semibold">What Personal Data We Collect</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Data you provide: account creation, contact, surveys, help/chat.</li>
                <li>Data about payments: card details, billing, shipping, and contact info.</li>
                <li>Data about use of services/products: device info, IP, OS, browser, usage, diagnostics, location (GPS/IP) where available.</li>
              </ul>
            </div>
            <div className="space-y-3 text-sm md:text-base text-gray-800">
              <p className="font-semibold">How We Use Your Personal Data</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Providing, improving, and developing products/services; research; audits; contests or promotions.</li>
                <li>Communicating with you (with prior consent for marketing); account and policy updates; responding to requests.</li>
                <li>Offering/measuring targeted ads and services (with prior consent).</li>
                <li>Promoting safety and security: verifying accounts, monitoring fraud, investigating suspicious activity.</li>
              </ul>
              <p className="text-xs text-gray-600">You may withdraw consent where required by contacting you3d.uk.</p>
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Disclosure of Personal Data</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-800">
              <li>Service providers: hosting, email, marketing, analytics, order fulfillment, research; obligated to protect data.</li>
              <li>Corporate affiliates and business transactions: mergers, reorganizations, acquisitions, transfers, or bankruptcy events.</li>
              <li>Legal compliance and security: to comply with law, protect safety, enforce terms, investigate fraud.</li>
              <li>Legal basis (EEA): consent (Art. 6(1)(a)), contract (b), legal obligation (c), legitimate interests (f).</li>
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Your Rights</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              You may access, correct, delete, restrict, or object to processing of your personal data. You may receive your data in a structured format and lodge complaints with a data protection authority. We may request information to verify identity. Contact us to exercise rights; we aim to respond within 30 days.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              To close your account or withdraw consent for marketing/ads, contact you3d.uk. We may retain certain data for fraud prevention, legal requirements, analytics, or account recovery.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Third-Party Websites and Services</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Our sites may link to third-party sites/services. Their privacy practices and content are their own. Please review their policies before use.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Data Security, Integrity, and Retention</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We use technical, administrative, and physical measures to protect data. Access is limited to personnel who need it. No system is impenetrable; in case of a breach, we will notify you and authorities where required. We retain data as needed for the purposes in this statement unless longer retention is required by law.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Protect your credentials and devices. If you believe your account security is compromised, contact us immediately.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Children</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Our products/services are intended for adults. We do not knowingly collect data from children under 16. If you learn a child under 16 provided data, contact us to delete it.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Data Transfers, Storage, and Processing Globally</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Data may be transferred outside the EEA to partners, affiliates, and service providers. We use safeguards such as EU model clauses, Privacy Shield where applicable, or binding corporate rules.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Changes to this Privacy Statement</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We may update this statement; minor changes take effect upon posting. Material changes will be prominently noticed. Continued use after the effective date means you accept the revised statement.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Contact Us</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              For questions or to exercise rights, contact: <a href="mailto:office@you3d.uk" className="text-orange-600 underline">office@you3d.uk</a>
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Cookie Statement</h2>
            <p className="text-base md:text-lg text-gray-700">Last Modified: {lastUpdatedCookie}</p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We use cookies and similar technologies to provide, protect, and improve our products and services, personalize content, measure ads, understand behavior, and provide a safer experience.
            </p>
            <div className="space-y-3 text-sm md:text-base text-gray-800">
              <p className="font-semibold">Types of Cookies</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Essential: required for core features (cart, live chat).</li>
                <li>Performance and functionality: usage and preference info to improve experience.</li>
                <li>Analytics and customization: aggregate insights to improve sites and campaigns.</li>
                <li>Advertising: relevance, frequency capping, interest-based ads (may be shared with partners).</li>
                <li>Social networking: enable sharing to social platforms.</li>
              </ul>
            </div>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Third parties may place cookies for ecommerce, analytics, or advertising. Their practices are governed by their policies.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Controls: Use browser/device settings to remove or reject cookies; some features may not work without them. We do not respond to Do Not Track signals.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Our security and privacy practices keep your information safe; we do not sell, share, or rent your information to outside parties without permission.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Collecting Information</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              By using you3d.uk, you authorize us to collect, store, and use your personal information to process orders and memberships, assist with customer service, send promotional material, identify you on forums, manage affiliate/dropship/wholesale/review programs, and verify identity with payment partners.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Data we collect may include registered email, password, nickname, IP address, date/time, browser/OS, requested URLs, shipping address, and other info needed for orders, delivery, payment verification, promotions, newsletters, and support. You can unsubscribe from marketing emails at any time.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
