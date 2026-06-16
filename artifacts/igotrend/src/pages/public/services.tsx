import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { GeomDecor } from "@/components/GeomDecor";
import { CheckCircle, Mail, Phone, MessageSquare } from "lucide-react";

const channels = [
  { name: "Instagram", emoji: "📸", color: "#E1306C", desc: "Stories, Reels, Posts, Lives" },
  { name: "Facebook", emoji: "👥", color: "#1877F2", desc: "Posts, Stories, Reels, Lives" },
  { name: "YouTube", emoji: "▶️", color: "#FF0000", desc: "Long-form, Shorts, Lives" },
  { name: "Twitter / X", emoji: "🐦", color: "#1DA1F2", desc: "Tweets, Threads, Spaces" },
  { name: "TikTok", emoji: "🎵", color: "#000000", desc: "Short Videos, Lives, Duets" },
  { name: "Snapchat", emoji: "👻", color: "#FFFC00", desc: "Stories, Snap Ads" },
];

const services = [
  {
    title: "Influencer Campaign Management",
    desc: "End-to-end management of influencer campaigns across all major social platforms. From creator discovery to content delivery and performance reporting.",
    items: ["Creator sourcing & vetting", "Campaign brief creation", "Content review & approval", "Performance analytics"],
  },
  {
    title: "Brand Strategy & Consultation",
    desc: "Our team of West Africa digital marketing experts helps brands develop influencer marketing strategies tailored to local markets.",
    items: ["Market research & audience analysis", "Platform & creator tier recommendations", "Budget optimization", "Campaign timeline planning"],
  },
  {
    title: "Creator Economy Tools",
    desc: "A full suite of tools for creators to manage their brand relationships, track earnings, and grow their audience.",
    items: ["Multi-platform handle management", "Pricing calculator by platform & type", "Earnings dashboard & payout tracking", "Campaign history & portfolio"],
  },
  {
    title: "Agency & B2B Solutions",
    desc: "Designed for marketing agencies managing multiple brand clients. One dashboard, multiple clients, centralized billing.",
    items: ["Multi-client campaign oversight", "White-label reporting options", "Consolidated billing & invoicing", "Dedicated account management"],
  },
];

const whyUs = [
  "Focused exclusively on West Africa — we understand the market",
  "Vetted creator network with verified follower authenticity",
  "Transparent pricing — creators set their own rates",
  "Secure escrow payment system via Flutterwave",
  "Real-time campaign tracking and reporting",
  "Dedicated support for both brands and creators",
];

export default function ServicesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(145deg, #1a0a3e 0%, #2d1569 60%, #3d1a85 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
            Our Services
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
            What Makes Us <span style={{ color: "#1DCFB3" }}>Great</span>
          </h1>
          <p className="text-lg text-white/65 max-w-xl mx-auto mb-8">
            iGoTrend provides the tools, connections, and expertise you need to run successful influencer marketing campaigns in West Africa.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Social channels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Multi-Platform</p>
            <h2 className="text-3xl font-extrabold text-gray-900">All Major Social Channels</h2>
            <p className="mt-3 text-gray-500">We support campaigns across every major platform where your audience lives</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {channels.map((c) => (
              <div
                key={c.name}
                className="text-center p-5 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3"
                  style={{ background: `${c.color}15` }}
                >
                  {c.emoji}
                </div>
                <div className="font-bold text-gray-900 text-sm">{c.name}</div>
                <div className="text-xs text-gray-400 mt-1 leading-snug">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Full Service Suite</h2>
            <p className="mt-3 text-gray-500">From solo brands to large agencies — we have a solution for you</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-5" style={{ background: "linear-gradient(135deg, #6B2FCE, #4E22A8)" }}>
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{s.desc}</p>
                <ul className="space-y-2">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#1DCFB3" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Why iGoTrend</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Built for West Africa, Built for Scale</h2>
              <ul className="space-y-4">
                {whyUs.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#1DCFB3" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="rounded-2xl p-8 border border-gray-100 shadow-sm" style={{ background: "#f8faff" }}>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Talk to an Expert!</h3>
              <p className="text-gray-500 text-sm mb-6">
                Have questions about our services? Our team is happy to walk you through how iGoTrend can work for your brand or agency.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(29,207,179,0.12)" }}>
                    <Mail className="h-4 w-4" style={{ color: "#1DCFB3" }} />
                  </div>
                  <div>
                    <div className="font-semibold">Email Us</div>
                    <div className="text-gray-400">support@igotrend.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(29,207,179,0.12)" }}>
                    <MessageSquare className="h-4 w-4" style={{ color: "#1DCFB3" }} />
                  </div>
                  <div>
                    <div className="font-semibold">Live Chat</div>
                    <div className="text-gray-400">Available Mon–Fri, 9am–6pm WAT</div>
                  </div>
                </div>
              </div>
              <Link
                href="/register"
                className="mt-6 w-full inline-block text-center py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Get Started Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Two-panel photo-style section */}
      <section className="py-0">
        <div className="grid md:grid-cols-2">
          <div
            className="min-h-64 flex flex-col justify-end p-10"
            style={{ background: "linear-gradient(135deg, #1DCFB3 0%, #0FA88E 100%)" }}
          >
            <div className="text-3xl font-extrabold text-white mb-2">For Brands</div>
            <p className="text-white/80 text-sm mb-5">Run campaigns that reach millions of engaged followers across West Africa.</p>
            <Link href="/brands" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[#0FA88E] hover:opacity-90 transition-all w-fit">
              Learn More
            </Link>
          </div>
          <div
            className="min-h-64 flex flex-col justify-end p-10"
            style={{ background: "linear-gradient(135deg, #6B2FCE 0%, #4E22A8 100%)" }}
          >
            <div className="text-3xl font-extrabold text-white mb-2">For Creators</div>
            <p className="text-white/80 text-sm mb-5">Monetize your content and build lasting brand partnerships that pay your rate.</p>
            <Link href="/influencers-creators" className="inline-block px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[#6B2FCE] hover:opacity-90 transition-all w-fit">
              Join as Trender
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
