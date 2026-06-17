import { Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { GeomDecor } from "@/components/GeomDecor";
import { CheckCircle, Users, BarChart3, DollarSign, Briefcase, Layers, Settings, ChevronRight, Building2, TrendingUp, Shield } from "lucide-react";

const agencySteps = [
  { step: "1", title: "Register as an Agency", desc: "Create your agency account and set up your profile. You'll get a dedicated agency dashboard from day one." },
  { step: "2", title: "Invite Your Brand Clients", desc: "Add your brand clients to the platform. They each get their own brand account linked to your agency." },
  { step: "3", title: "Run Campaigns at Scale", desc: "Launch and manage campaigns across all your clients from a single dashboard. Full visibility, zero chaos." },
  { step: "4", title: "Track Billing & Commissions", desc: "Choose between subscription billing or commission-based earnings. All billing is handled transparently through the platform." },
];

const features = [
  {
    icon: Layers,
    title: "Multi-Client Dashboard",
    desc: "Manage every brand client from one place. Switch between campaigns, submissions, and payouts across all your accounts without logging in and out.",
  },
  {
    icon: DollarSign,
    title: "Flexible Agency Billing",
    desc: "Choose how you earn: flat subscription billing from your clients, or a commission percentage on every creator payout. Admin-configured and transparent.",
  },
  {
    icon: BarChart3,
    title: "Cross-Client Analytics",
    desc: "See campaign performance, creator activity, spend, and deliverables across all your clients in a single reporting view.",
  },
  {
    icon: Users,
    title: "Creator Network Access",
    desc: "Tap into 10,000+ verified West African creators across every niche and follower tier. Invite the right creators to the right campaigns instantly.",
  },
  {
    icon: Shield,
    title: "Secure Escrow Payments",
    desc: "All creator payouts flow through the platform. Funds are held in escrow until content is approved — protecting your clients and their budgets.",
  },
  {
    icon: Settings,
    title: "Centralized Controls",
    desc: "Set campaign briefs, review creator submissions, approve or reject content, and trigger payouts — all without leaving the iGoTrend platform.",
  },
];

const billingOptions = [
  {
    title: "Subscription Billing",
    color: "#1DCFB3",
    desc: "Charge your clients a flat monthly fee. iGoTrend deducts a fixed subscription amount from their account — simple, predictable, and clean.",
    items: ["Fixed monthly charge per client", "No per-transaction deductions", "Ideal for retainer-based agency models"],
  },
  {
    title: "Commission-Based",
    color: "#6B2FCE",
    desc: "Earn a percentage of every creator payout your client processes. iGoTrend automatically calculates and records your commission on each approved payout.",
    items: ["Configurable commission rate", "Auto-deducted from creator payouts", "Ideal for performance-driven agencies"],
  },
];

const whyAgencies = [
  "One login, full visibility across all brand clients",
  "Dedicated agency role — not a workaround of the brand account",
  "Billing managed by the platform — no manual invoicing",
  "West Africa's largest verified creator network",
  "Real-time campaign performance and spend tracking",
  "Priority support for agency accounts",
];

const mockupRows = [
  { label: "Active Clients", value: "7", color: "#1DCFB3" },
  { label: "Running Campaigns", value: "23", color: "#8B5CF6" },
  { label: "Commission This Month", value: "₦420K", color: "#F59E0B" },
  { label: "Creators Engaged", value: "142", color: "#10B981" },
];

export default function AgenciesPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative overflow-hidden min-h-[520px] flex items-center"
        style={{ background: "linear-gradient(145deg, #0d0826 0%, #1a0a3e 35%, #2a1265 65%, #1a2a5e 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
                <Building2 className="h-3 w-3" />
                For Marketing Agencies
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-5">
                Manage All Your Clients'<br />
                <span style={{ color: "#1DCFB3" }}>Influencer Campaigns</span><br />
                in One Place
              </h1>
              <p className="text-lg text-white/65 mb-8 leading-relaxed max-w-lg">
                iGoTrend is built for agencies running influencer marketing across multiple West African brand clients. One platform, full control, flexible billing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-block px-7 py-3.5 rounded-xl font-bold text-white text-center transition-all hover:opacity-90 shadow-lg"
                  style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
                >
                  Register Your Agency
                </Link>
                <Link
                  href="/services"
                  className="inline-block px-7 py-3.5 rounded-xl font-bold text-center transition-all hover:bg-white/10"
                  style={{ border: "1px solid rgba(255,255,255,0.3)", color: "white" }}
                >
                  View All Services
                </Link>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="hidden lg:block">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10" style={{ background: "#141C35" }}>
                <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  <span className="text-white/30 text-xs ml-2">iGoTrend Agency Dashboard</span>
                </div>
                <div className="p-5 space-y-3">
                  {mockupRows.map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span className="text-white/60 text-xs">{item.label}</span>
                      <span className="font-bold text-sm" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                  <div className="mt-2 pt-3 border-t border-white/10">
                    <div className="text-white/30 text-xs mb-2">Recent Campaign Activity</div>
                    {["Konga × NanoCreator — ✅ Submitted", "GTBank × MicroTrender — ⏳ Pending", "Jumia × MacroInfluencer — 🎯 Active"].map((r) => (
                      <div key={r} className="text-white/50 text-xs py-1.5 border-b border-white/5 last:border-0">{r}</div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 w-56 h-56 rounded-full blur-3xl opacity-15" style={{ background: "#6B2FCE" }} />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>How It Works</p>
            <h2 className="text-3xl font-extrabold text-gray-900">From Sign-Up to Full Campaign Ops in 4 Steps</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">Getting your agency on iGoTrend takes minutes. Running campaigns for all your clients takes even less.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {agencySteps.map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-lg mb-4" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6B2FCE" }}>Platform Features</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Everything Agencies Need to Scale</h2>
            <p className="mt-3 text-gray-500 max-w-lg mx-auto">No workarounds, no spreadsheets — iGoTrend has a real agency tier built into the platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow bg-white">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(29,207,179,0.1)" }}>
                  <f.icon className="h-5 w-5" style={{ color: "#1DCFB3" }} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Billing options */}
      <section className="py-20" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Billing Models</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Earn the Way That Fits Your Agency</h2>
            <p className="mt-3 text-gray-500 max-w-md mx-auto">iGoTrend supports two billing models for agencies — choose what works for your business, or mix both across different clients.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {billingOptions.map((b) => (
              <div key={b.title} className="bg-white rounded-2xl p-8 border-2 hover:shadow-lg transition-shadow" style={{ borderColor: `${b.color}30` }}>
                <div className="w-10 h-10 rounded-xl mb-5 flex items-center justify-center" style={{ background: `${b.color}18` }}>
                  <DollarSign className="h-5 w-5" style={{ color: b.color }} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{b.desc}</p>
                <ul className="space-y-2">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: b.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-6">Billing mode is configured by the iGoTrend admin team. Contact us to discuss your agency's preferred model.</p>
        </div>
      </section>

      {/* Why agencies choose iGoTrend */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#1DCFB3" }}>Why iGoTrend</p>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Built for West African Agencies, Not as an Afterthought</h2>
              <ul className="space-y-4">
                {whyAgencies.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: "#1DCFB3" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Register Your Agency Free <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Comparison visual */}
            <div className="space-y-4">
              <div className="rounded-2xl p-6 border border-gray-100" style={{ background: "#f8faff" }}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Without iGoTrend</div>
                {["Manage clients across WhatsApp, email & spreadsheets", "Chase influencers for content proof manually", "Invoice clients yourself, track commissions in Excel", "No verified creator data — rely on screenshots"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-500 mb-2.5">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✕</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-6 border-2" style={{ background: "rgba(29,207,179,0.04)", borderColor: "rgba(29,207,179,0.3)" }}>
                <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#1DCFB3" }}>With iGoTrend Agency</div>
                {["All clients, campaigns, and creators in one dashboard", "Submissions with content proof tracked automatically", "Platform handles billing — commissions auto-calculated", "10,000+ verified creators with real engagement data"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-700 mb-2.5">
                    <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#1DCFB3" }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
            <Briefcase className="h-3 w-3" />
            Agency Accounts
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Bring Your Clients to iGoTrend?
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Register your agency for free. Our team will configure your billing model and get you set up within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:opacity-90 shadow-lg"
              style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
            >
              Register Your Agency
            </Link>
            <Link
              href="/services"
              className="px-8 py-3.5 rounded-xl font-bold text-white transition-all hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Explore Services
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
