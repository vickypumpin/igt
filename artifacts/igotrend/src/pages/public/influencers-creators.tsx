import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { GeomDecor } from "@/components/GeomDecor";
import { Star, DollarSign, Shield, TrendingUp, Zap, Users, CheckCircle, ChevronRight } from "lucide-react";

const tiers = [
  { name: "Nano", range: "1K – 10K followers", color: "#64748b", desc: "Perfect for hyper-local, niche campaigns", emoji: "🌱" },
  { name: "Micro", range: "10K – 50K followers", color: "#0EA5E9", desc: "High engagement, trusted recommendations", emoji: "⭐" },
  { name: "Mid-tier", range: "50K – 250K followers", color: "#8B5CF6", desc: "Best balance of reach and authenticity", emoji: "🌟" },
  { name: "Macro", range: "250K – 1M followers", color: "#1DCFB3", desc: "Mass awareness for growing brands", emoji: "💫" },
  { name: "Mega", range: "1M – 5M followers", color: "#F59E0B", desc: "Celebrity-level influence and brand deals", emoji: "🏆" },
  { name: "Elite", range: "5M+ followers", color: "#EF4444", desc: "Top-tier national and regional campaigns", emoji: "👑" },
];

const benefits = [
  { icon: DollarSign, title: "Get Paid Your Rate", desc: "Set your own pricing for posts, stories, reels, and live sessions across all platforms." },
  { icon: Shield, title: "Secure Payments", desc: "Earnings are protected and paid directly to your bank account through our secure system." },
  { icon: TrendingUp, title: "Grow Your Brand", desc: "Partner with leading West African brands and grow your follower base organically." },
  { icon: Zap, title: "Quick Campaign Setup", desc: "Accept or decline campaign invitations in seconds. No complex contracts to sign." },
  { icon: Users, title: "Community of Creators", desc: "Join a community of 10,000+ verified Nigerian and West African content creators." },
  { icon: Star, title: "Earn Gems & Rewards", desc: "Supporters can send you Gems — a virtual token that translates directly to real income." },
];

const steps = [
  { step: "01", title: "Register & Build Profile", desc: "Sign up free, connect your social media accounts, and complete your Trender profile with your content category and pricing." },
  { step: "02", title: "Get Verified", desc: "Our team reviews your profile and follower metrics to assign your Trender tier. Verification usually takes 24-48 hours." },
  { step: "03", title: "Receive Campaign Invitations", desc: "Brands browse and invite you based on your niche, tier, and audience. You'll be notified instantly for each invitation." },
  { step: "04", title: "Create Content & Earn", desc: "Accept campaigns that align with your brand, deliver great content, and receive payment directly to your bank account." },
];

const platforms = [
  { name: "Instagram", color: "#E1306C", emoji: "📸" },
  { name: "TikTok", color: "#000000", emoji: "🎵" },
  { name: "YouTube", color: "#FF0000", emoji: "▶️" },
  { name: "Twitter / X", color: "#1DA1F2", emoji: "🐦" },
  { name: "Facebook", color: "#1877F2", emoji: "👥" },
  { name: "Snapchat", color: "#FFFC00", emoji: "👻" },
];

export default function InfluencersCreatorsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[500px] flex items-center"
        style={{ background: "linear-gradient(145deg, #0d3d35 0%, #0a6b58 40%, #0FA88E 100%)" }}
      >
        <GeomDecor variant="teal" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.25)" }}>
              For Influencers &amp; Content Creators
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
              Turn Your Influence into <span style={{ color: "#7FFFD4" }}>Real Income</span>
            </h1>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Join iGoTrend as a Trender and connect with top West African brands looking for authentic voices like yours. Set your rates, choose your campaigns, and get paid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-block px-7 py-3.5 rounded-xl font-bold text-center transition-all hover:opacity-90 shadow-lg text-gray-900"
                style={{ background: "white" }}
              >
                Join as a Trender — Free
              </Link>
              <Link
                href="/login"
                className="inline-block px-7 py-3.5 rounded-xl font-bold text-center transition-all hover:bg-white/10"
                style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
              >
                Sign In
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/50">
              * Minimum 5,000 followers on at least one platform required.
            </p>
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">Supported Platforms</p>
          <div className="flex flex-wrap justify-center gap-4">
            {platforms.map((p) => (
              <div key={p.name} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-gray-50">
                <span>{p.emoji}</span>
                <span className="text-gray-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Getting Started</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Your Journey as a Trender</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl font-black mb-4" style={{ color: "rgba(29,207,179,0.2)", fontFamily: "monospace" }}>{s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trender Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Creator Levels</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Trender Tiers Explained</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">Every follower count has value. Brands work with creators at all tiers on iGoTrend.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiers.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl border hover:shadow-md transition-shadow"
                style={{ borderColor: `${t.color}30`, background: `${t.color}06` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900">{t.name} Trender</div>
                    <div className="text-xs font-semibold" style={{ color: t.color }}>{t.range}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Creators Love iGoTrend</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(29,207,179,0.1)" }}>
                  <b.icon className="h-5 w-5" style={{ color: "#1DCFB3" }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #0d3d35 0%, #0FA88E 100%)" }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">Start Your Creator Journey Today</h2>
          <p className="text-white/65 mb-8 text-lg">Free to join. No monthly fees. Earn from day one.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-block px-8 py-3.5 rounded-xl font-bold text-gray-900 transition-all hover:opacity-90 shadow-lg bg-white"
            >
              Register as a Trender
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.3)" }}
            >
              Explore the Platform <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
