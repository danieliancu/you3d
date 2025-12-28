import type { Metadata } from "next";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata: Metadata = {
  title: "About Us | 3D Figure",
  description: "Learn how My 3D FigureUK turns your memories into lifelike 3D printed figurines.",
};

const highlights = [
  { title: "Exceptional Detail & Quality", text: "We use premium materials and high-resolution 3D printing for smooth textures, expressive features, and true-to-life designs." },
  { title: "Affordable Personalization", text: "Custom gifts should be accessible. Our in-house process keeps prices competitive without compromising quality." },
  { title: "Stress-Free Experience", text: "Upload your photo—we handle the rest. We share previews and updates so you stay in control." },
];

const howItWorks = [
  "Upload a photo (front, profile, or full-body).",
  "Our designers create a detailed 3D model.",
  "You review preview images before we print.",
  "We produce and ship your figure within 7–9 business days.",
];

const creations = [
  "Graduation keepsakes",
  "Anniversary or couple gifts",
  "Memorial tributes for pets",
  "Family portraits in 3D",
  "Office or sports team figures",
  "Surprise blind boxes for fun",
];

const guarantees = [
  "Lifelike Results — You’ll recognize the pose, outfit, and emotion.",
  "Personalized for You — Every figure is truly one of a kind.",
  "Customer First — We’re here from the first click to the final delivery.",
];

export default function AboutUsPage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-gray-50 min-h-screen py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-12">
          <header className="space-y-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-600">About Us</p>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900">Bring Your Memories to Life in 3D</h1>
            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto">
              At My 3D FigureUK, we turn your favorite photos into stunning, lifelike 3D printed figurines — you, loved ones, kids, pets, or team heroes. Every piece is crafted to preserve the moments that matter most.
            </p>
          </header>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">What We Do</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We create custom 3D figurines that capture the essence of real people and pets—from solo portraits to couples, families, and full-body poses.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Why Choose Us?</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {highlights.map((item, idx) => (
                <div key={idx} className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-lg font-bold text-gray-900 mb-2">{item.title}</p>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">What We Stand For</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold">Mission:</span> To turn memories into lasting art through thoughtful, custom-made 3D figures.
            </p>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              <span className="font-semibold">Vision:</span> To become the go-to brand for personalized 3D gifts — the kind that make people say “Wow!”
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm md:text-base text-gray-800">
              {howItWorks.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">What Our Customers Create</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-800">
              {creations.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Our Team</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              We're here to help you design gifts that go beyond the ordinary, supporting customers worldwide with attentive service.
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Our Guarantee</h2>
            <ul className="list-disc list-inside space-y-2 text-sm md:text-base text-gray-800">
              {guarantees.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Questions?</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              📧 Email: <a href="mailto:cs@my3dfigure.co.uk" className="text-orange-600 underline">cs@my3dfigure.co.uk</a>
            </p>
          </section>

          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Cancellation Policy</h2>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              Once your order has been submitted we immediately begin production on personalized items. To cancel, a 30% restocking fee applies. My 3D Figure reserves the right to amend this policy at any time; updates will be published on this page. For inquiries, contact our Customer Service Representatives.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
