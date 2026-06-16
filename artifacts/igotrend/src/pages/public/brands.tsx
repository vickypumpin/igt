import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { GeomDecor } from "@/components/GeomDecor";
import { CheckCircle, TrendingUp, Users, DollarSign, Target, BarChart3, Shield, Zap, ChevronRight } from "lucide-react";

const stats = [
  { value: "₦15,000", label: "Rewards Sent", sub: "avg per campaign" },
  { value: "₦18.5M", label: "Campaign Budgets", sub: "total processed" },
  { value: "148K", label: "Trender Collabs", sub: "completed" },
  { value: "18M/45K", label: "Reach / Engagement", sub: "average per campaign" },
];

const features = [
  {
    icon: Target,
    title: "Precision Targeting",
    desc: "Find creators by niche, tier, platform, location, and engagement rate. Reach exactly the right audience.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    desc: "Monitor campaign performance, track deliverables, and measure ROI from a single dashboard.",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    desc: "Pay creators securely through Flutterwave. Funds are held in escrow until content is delivered.",
  },
  {
    icon: Users,
    title: "10,000+ Verified Creators",
    desc: "Every Trender on our platform is verified for authenticity, engagement, and content quality.",
  },
  {
    icon: Zap,
    title: "Fast Campaign Launch",
    desc: "Set up a campaign and start receiving applications from creators within 24 hours.",
  },
  {
    icon: TrendingUp,
    title: "West Africa Focused",
    desc: "Tap into the fastest-growing creator economy in West Africa across Nigeria, Ghana, and beyond.",
  },
];

const benefits = [
  "Set your own budget and campaign duration",
  "Invite specific creators or let them apply",
  "Review content before it goes live",
  "Track all deliverables in one place",
  "Instant access to creator pricing & rates",
  "Dedicated support PIN for priority help",
];

export default function BrandsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[500px] flex items-center"
        style={{ background: "linear-gradient(145deg, #1a0a3e 0%, #2d1569 40%, #4a1fa0 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
              For Brands &amp; Advertisers
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
              Build Relationships with the Most <span style={{ color: "#1DCFB3" }}>Influential People</span> on Social Media
            </h1>
            <p className="text-lg text-white/65 mb-8 leading-relaxed">
              iGoTrend connects your brand with verified West African creators who genuinely resonate with your audience. Launch campaigns that convert.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-block px-7 py-3.5 rounded-xl font-bold text-white text-center transition-all hover:opacity-90 shadow-lg"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Start a Campaign — Free
              </Link>
              <Link
                href="/login"
                className="inline-block px-7 py-3.5 rounded-xl font-bold text-center transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats overlay */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="text-center p-6 rounded-2xl border border-gray-100"
                style={{ background: i === 0 ? "rgba(107,47,206,0.06)" : i === 1 ? "rgba(29,207,179,0.06)" : "white" }}
              >
                <div className="text-2xl font-extrabold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-gray-700">{s.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform mockup section */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Dashboard Preview</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-5">
                Manage All Your Campaigns in One Place
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                The iGoTrend brand dashboard gives you full visibility into your campaigns, creator applications, payment status, and performance analytics — all in one clean interface.
              </p>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: "#1DCFB3" }} />
                    {b}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6B2FCE, #4E22A8)" }}
              >
                Create Your Brand Account <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mockup card */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200" style={{ background: "#141C35" }}>
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-white/30 text-xs ml-2">iGoTrend Brand Dashboard</span>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { label: "Active Campaigns", value: "12", color: "#1DCFB3" },
                    { label: "Total Spend", value: "₦2.4M", color: "#F59E0B" },
                    { label: "Creator Applications", value: "87", color: "#8B5CF6" },
                    { label: "Content Delivered", value: "234", color: "#10B981" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span className="text-white/60 text-xs">{item.label}</span>
                      <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative glow */}
              <div className="absolute -bottom-4 -right-4 w-48 h-48 rounded-full blur-3xl opacity-20" style={{ background: "#6B2FCE" }} />
            </div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900">Everything You Need to Run Great Campaigns</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">A full suite of tools built for West African brand marketing</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(107,47,206,0.1)" }}>
                  <f.icon className="h-5 w-5" style={{ color: "#6B2FCE" }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Ready to Find Your Perfect Creators?</h2>
          <p className="text-white/65 mb-8">Registration is free. Start your first campaign today.</p>
          <Link
            href="/register"
            className="inline-block px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-lg"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
          >
            Create Free Brand Account
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
