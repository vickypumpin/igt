import { useState } from "react";
import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { GeomDecor } from "@/components/GeomDecor";
import { ChevronRight, Star, Users, DollarSign, TrendingUp, CheckCircle, Instagram, Youtube, Twitter, Facebook, Building2 } from "lucide-react";

const categories = [
  { icon: "💃", label: "Dance" },
  { icon: "🎮", label: "Gaming" },
  { icon: "📹", label: "Vlogging" },
  { icon: "🎭", label: "Skit Creation" },
  { icon: "💪", label: "Fitness" },
  { icon: "👗", label: "Fashion" },
  { icon: "💄", label: "Beauty" },
  { icon: "😂", label: "Comedy" },
  { icon: "🍳", label: "Food & Cooking" },
  { icon: "✈️", label: "Travel" },
  { icon: "🎵", label: "Music" },
  { icon: "📚", label: "Education" },
];

const stats = [
  { value: "₦18.5M+", label: "Campaign Budgets", icon: DollarSign },
  { value: "148K", label: "Collaborations", icon: Users },
  { value: "18M", label: "Total Reach", icon: TrendingUp },
  { value: "10K+", label: "Verified Trenders", icon: Star },
];

const brandSteps = [
  { step: "1", title: "Create Campaign", desc: "Define your campaign goals, budget, and target audience on our intuitive platform." },
  { step: "2", title: "Find Creators", desc: "Browse and invite the perfect Trenders from our verified pool of 10,000+ creators." },
  { step: "3", title: "Track & Pay", desc: "Monitor campaign performance in real-time and pay creators securely through the platform." },
];

const creatorSteps = [
  { step: "1", title: "Build Profile", desc: "Set up your Trender profile, connect your social handles, and set your content pricing." },
  { step: "2", title: "Get Invited", desc: "Brands discover and invite you to campaigns that match your niche and audience." },
  { step: "3", title: "Create & Earn", desc: "Deliver great content, track your earnings, and withdraw to your bank account." },
];

const agencySteps = [
  { step: "1", title: "Register Agency", desc: "Create your agency account and get a dedicated multi-client dashboard from day one." },
  { step: "2", title: "Add Brand Clients", desc: "Invite your brand clients to the platform. Each gets their own account linked to your agency." },
  { step: "3", title: "Run at Scale", desc: "Manage campaigns, creators, submissions, and payouts across all clients — one login." },
];

const tiers = [
  { name: "Nano", range: "1K–10K", color: "#64748b" },
  { name: "Micro", range: "10K–50K", color: "#0EA5E9" },
  { name: "Mid-tier", range: "50K–250K", color: "#8B5CF6" },
  { name: "Macro", range: "250K–1M", color: "#1DCFB3" },
  { name: "Mega", range: "1M–5M", color: "#F59E0B" },
  { name: "Elite", range: "5M+", color: "#EF4444" },
];

export default function HomePage() {
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");

  return (
    <PublicLayout>
      {/* ── Hero ── */}
      <section
        className="relative overflow-hidden min-h-[560px] flex items-center"
        style={{ background: "linear-gradient(145deg, #1a0a3e 0%, #2d1569 40%, #3d1a85 70%, #4a1fa0 100%)" }}
      >
        <GeomDecor variant="purple" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DCFB3] animate-pulse" />
            West Africa's #1 Influencer Platform
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 max-w-4xl mx-auto">
            Discover <span style={{ color: "#1DCFB3" }}>Influencers</span> &amp; Content Creators<br className="hidden sm:block" /> for your Campaign!
          </h1>
          <p className="text-lg text-white/65 mb-10 max-w-xl mx-auto">
            Ready to Support Trenders? Buy them Gems!
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 p-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/90 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-[#1DCFB3]"
            >
              <option value="">All Platforms</option>
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">Twitter / X</option>
              <option value="facebook">Facebook</option>
              <option value="snapchat">Snapchat</option>
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm bg-white/90 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-[#1DCFB3]"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.label} value={c.label.toLowerCase()}>{c.icon} {c.label}</option>
              ))}
            </select>
            <Link
              href="/register"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-white whitespace-nowrap transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
            >
              Search Now
            </Link>
          </div>

          {/* Platform icons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {[Instagram, Youtube, Twitter, Facebook].map((Icon, i) => (
              <div key={i} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <Icon className="h-4 w-4 text-white/70" />
              </div>
            ))}
            <span className="text-white/40 text-xs ml-1">+ TikTok, Snapchat</span>
          </div>
        </div>
      </section>

      {/* ── Category carousel ── */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center mb-6">Browse by Creator Category</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((c) => (
              <Link
                key={c.label}
                href="/register"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-[#1DCFB3] hover:border-[#1DCFB3] transition-all border border-gray-200 hover:bg-[#1DCFB3]/5"
              >
                <span>{c.icon}</span> {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow" style={{ background: i % 2 === 0 ? "#fafbff" : "white" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(29,207,179,0.12)" }}>
                  <s.icon className="h-5 w-5" style={{ color: "#1DCFB3" }} />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works for Brands ── */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>For Brands &amp; Advertisers</p>
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">Launch your influencer marketing campaign in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {brandSteps.map((s) => (
              <div key={s.step} className="relative bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4" style={{ background: "linear-gradient(135deg, #6B2FCE, #4E22A8)" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/brands" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#6B2FCE" }}>
              Learn more about brand campaigns <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── How it Works for Creators ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>For Influencers &amp; Creators</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Start Earning as a Trender</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">Join thousands of creators monetizing their influence on iGoTrend</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            {creatorSteps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/influencers-creators" className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "#1DCFB3" }}>
              Learn more about becoming a Trender <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── For Agencies ── */}
      <section className="py-20" style={{ background: "linear-gradient(145deg, #0d0826 0%, #1a0a3e 50%, #1a2a5e 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
                <Building2 className="h-3 w-3" />
                For Marketing Agencies
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-5">
                Run Influencer Campaigns for All Your Clients — <span style={{ color: "#1DCFB3" }}>One Dashboard</span>
              </h2>
              <p className="text-white/65 leading-relaxed mb-8">
                iGoTrend has a dedicated agency tier. Register as an agency, invite your brand clients, and manage every campaign, creator, and payout from a single login. Billing is built in — choose subscription or commission per client.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Multi-client dashboard", icon: "🏢" },
                  { label: "Flexible agency billing", icon: "💳" },
                  { label: "Cross-client analytics", icon: "📊" },
                ].map((item) => (
                  <div key={item.label} className="text-center p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-white/70 text-xs font-medium leading-snug">{item.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/agencies"
                className="inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#1DCFB3" }}
              >
                Learn more about the Agency tier <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {agencySteps.map((s) => (
                <div key={s.step} className="flex items-start gap-4 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                    <p className="text-white/55 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/register"
                className="mt-2 w-full inline-block text-center py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Register Your Agency Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Creator tiers ── */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Trender Tiers</h2>
            <p className="mt-3 text-gray-500">Every follower count has a place on iGoTrend</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {tiers.map((t) => (
              <div key={t.name} className="text-center p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ background: `${t.color}18`, border: `2px solid ${t.color}40` }}>
                  <Star className="h-5 w-5" style={{ color: t.color }} />
                </div>
                <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{t.range}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Start?
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Join brands, agencies, and creators already winning on iGoTrend across West Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
            >
              Get Started — It's Free
            </Link>
            <Link
              href="/agencies"
              className="px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Agency? Start Here
            </Link>
            <Link
              href="/brands"
              className="px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Learn About Campaigns
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
