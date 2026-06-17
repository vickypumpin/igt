import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { Search, Instagram, Youtube, Twitter, Facebook, Users, Star } from "lucide-react";
import { SiTiktok, SiSnapchat } from "react-icons/si";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const BADGE_CFG: Record<string, { bg: string; text: string; label: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563",  label: "Nano" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB",  label: "Micro" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669",  label: "Mid-tier" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED",  label: "Macro" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C",  label: "Mega" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309",  label: "Elite" },
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3.5 w-3.5" />,
  tiktok:    <SiTiktok className="h-3 w-3" />,
  youtube:   <Youtube className="h-3.5 w-3.5" />,
  twitter:   <Twitter className="h-3.5 w-3.5" />,
  facebook:  <Facebook className="h-3.5 w-3.5" />,
  snapchat:  <SiSnapchat className="h-3 w-3" />,
};

const CATEGORIES = [
  "Dance","Gaming","Vlogging","Skit Creation","Fitness","Fashion",
  "Beauty","Comedy","Food & Cooking","Travel","Music","Education",
];

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok",    label: "TikTok" },
  { value: "youtube",   label: "YouTube" },
  { value: "twitter",   label: "Twitter / X" },
  { value: "facebook",  label: "Facebook" },
  { value: "snapchat",  label: "Snapchat" },
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1DCFB3,#0FA88E)",
  "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#EF4444,#DC2626)",
  "linear-gradient(135deg,#E91E8C,#C0166E)",
];

type Creator = {
  id: number;
  userName: string;
  firstName: string | null;
  lastName: string | null;
  badge: string | null;
  avatarUrl: string | null;
  bio: string | null;
  contentCategory: string | null;
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
};

function getActivePlatforms(c: Creator): string[] {
  const out: string[] = [];
  if (c.instagramProfile) out.push("instagram");
  if (c.tiktokProfile)    out.push("tiktok");
  if (c.youtubeProfile)   out.push("youtube");
  if (c.twitterProfile)   out.push("twitter");
  if (c.facebookProfile)  out.push("facebook");
  return out;
}

function CreatorCard({ creator, idx }: { creator: Creator; idx: number }) {
  const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
  const badge = creator.badge ? BADGE_CFG[creator.badge] : null;
  const platforms = getActivePlatforms(creator);
  const initials = creator.userName?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="h-16 w-full" style={{ background: "linear-gradient(135deg, #1a0a3e, #3d1a85)" }} />
      <div className="px-5 pb-5 -mt-8">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-black text-lg mb-3 border-2 border-white shadow-sm"
          style={creator.avatarUrl ? {} : { background: grad }}
        >
          {creator.avatarUrl
            ? <img src={creator.avatarUrl} alt={creator.userName} className="w-full h-full object-cover rounded-xl" />
            : initials}
        </div>

        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-bold text-gray-900 leading-tight">
              {creator.firstName && creator.lastName
                ? `${creator.firstName} ${creator.lastName}`
                : creator.userName}
            </p>
            <p className="text-xs text-gray-400">@{creator.userName}</p>
          </div>
          {badge && (
            <span
              className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold capitalize"
              style={{ background: badge.bg, color: badge.text }}
            >
              {badge.label}
            </span>
          )}
        </div>

        {creator.bio && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{creator.bio}</p>
        )}
        {creator.contentCategory && !creator.bio && (
          <p className="text-xs text-gray-400 mb-3">{creator.contentCategory}</p>
        )}

        {platforms.length > 0 && (
          <div className="flex gap-1.5 mb-4">
            {platforms.map((p) => (
              <span key={p} className="w-6 h-6 rounded-md flex items-center justify-center text-gray-500 border border-gray-100 bg-gray-50">
                {PLATFORM_ICONS[p]}
              </span>
            ))}
          </div>
        )}

        <Link
          href="/register"
          className="block w-full text-center py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-16 bg-gray-100" />
      <div className="px-5 pb-5 -mt-8">
        <div className="w-14 h-14 rounded-xl bg-gray-200 mb-3 border-2 border-white" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
        <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
        <div className="h-3 bg-gray-100 rounded w-full mb-1" />
        <div className="h-3 bg-gray-100 rounded w-5/6 mb-4" />
        <div className="h-8 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function parseQuery(search: string) {
  const params = new URLSearchParams(search);
  return {
    platform: params.get("platform") ?? "",
    category: params.get("category") ?? "",
    q: params.get("q") ?? "",
  };
}

export default function PublicSearchPage() {
  const [location, navigate] = useLocation();
  const qs = parseQuery(window.location.search);

  const [platform, setPlatform] = useState(qs.platform);
  const [category, setCategory] = useState(qs.category);
  const [searchText, setSearchText] = useState(qs.q);
  const [debouncedQ, setDebouncedQ] = useState(qs.q);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchText), 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => {
    setPage(1);
  }, [platform, category, debouncedQ]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "24" });
    if (platform) params.set("platform", platform);
    if (category) params.set("category", category);
    if (debouncedQ) params.set("search", debouncedQ);

    fetch(`${API_BASE}/public/creators?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setCreators(d.data ?? []);
        setTotal(d.total ?? 0);
      })
      .catch(() => { setCreators([]); setTotal(0); })
      .finally(() => setIsLoading(false));
  }, [platform, category, debouncedQ, page]);

  const totalPages = Math.ceil(total / 24);

  return (
    <PublicLayout>
      {/* ── Header ── */}
      <section
        className="relative overflow-hidden py-12"
        style={{ background: "linear-gradient(145deg, #1a0a3e 0%, #2d1569 50%, #3d1a85 100%)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(29,207,179,0.18)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.35)" }}>
            <Users className="h-3 w-3" />
            Creator Directory
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            Find the Right <span style={{ color: "#1DCFB3" }}>Trender</span> for Your Campaign
          </h1>
          <p className="text-white/60 text-sm mb-8">Browse verified West African content creators — sign up to unlock full profiles, pricing and invites.</p>

          {/* Search / Filter bar */}
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-2 p-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search creators…"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white/90 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-[#1DCFB3]"
              />
            </div>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white/90 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-[#1DCFB3]"
            >
              <option value="">All Platforms</option>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-xl text-sm bg-white/90 text-gray-800 border-0 focus:outline-none focus:ring-2 focus:ring-[#1DCFB3]"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c.toLowerCase()}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <section className="py-10 min-h-[60vh]" style={{ background: "#f8faff" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Count + CTA */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              {isLoading ? "Searching…" : `${total.toLocaleString()} creator${total !== 1 ? "s" : ""} found`}
            </p>
            <Link
              href="/register"
              className="px-5 py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #6B2FCE, #4E22A8)" }}
            >
              Sign up to invite creators →
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : creators.length === 0
                ? (
                  <div className="col-span-full py-24 text-center">
                    <Star className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-semibold text-gray-500">No creators match those filters yet.</p>
                    <p className="text-sm text-gray-400 mt-1">Try broadening your search or removing a filter.</p>
                  </div>
                )
                : creators.map((c, i) => <CreatorCard key={c.id} creator={c} idx={i} />)
            }
          </div>

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}

          {/* Upsell banner */}
          <div className="mt-14 rounded-2xl p-8 text-center" style={{ background: "linear-gradient(135deg, #1a0a3e, #3d1a85)" }}>
            <h3 className="text-xl font-extrabold text-white mb-2">Want to invite these creators?</h3>
            <p className="text-white/60 text-sm mb-5">Sign up as a brand or agency to unlock full profiles, pricing, and campaign invitations.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:opacity-90 transition" style={{ background: "linear-gradient(135deg,#1DCFB3,#0FA88E)" }}>
                Get Started Free
              </Link>
              <Link href="/login" className="px-6 py-3 rounded-xl font-bold text-white text-sm hover:bg-white/10 transition" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>
                Log In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
