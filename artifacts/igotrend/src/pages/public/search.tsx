import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { PublicLayout } from "@/components/layout/public-layout";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Instagram, Youtube, Twitter, Facebook, Users, Star, X,
  CheckCircle, Lock, Briefcase, Send, ChevronDown,
} from "lucide-react";
import { SiTiktok, SiSnapchat } from "react-icons/si";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const BADGE_CFG: Record<string, { bg: string; text: string; label: string; grad: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563", label: "Nano",     grad: "linear-gradient(135deg,#6B7280,#374151)" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB", label: "Micro",    grad: "linear-gradient(135deg,#3B82F6,#2563EB)" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669", label: "Mid-tier", grad: "linear-gradient(135deg,#10B981,#059669)" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED", label: "Macro",    grad: "linear-gradient(135deg,#8B5CF6,#6D28D9)" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C", label: "Mega",     grad: "linear-gradient(135deg,#F59E0B,#D97706)" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309", label: "Elite",    grad: "linear-gradient(135deg,#FBBF24,#F59E0B)" },
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3.5 w-3.5" />,
  tiktok:    <SiTiktok className="h-3 w-3" />,
  youtube:   <Youtube className="h-3.5 w-3.5" />,
  twitter:   <Twitter className="h-3.5 w-3.5" />,
  facebook:  <Facebook className="h-3.5 w-3.5" />,
  snapchat:  <SiSnapchat className="h-3 w-3" />,
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube",
  twitter: "Twitter / X", facebook: "Facebook", snapchat: "Snapchat",
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

type Campaign = { id: number; name: string; status: string };

function getActivePlatforms(c: Creator): string[] {
  const out: string[] = [];
  if (c.instagramProfile) out.push("instagram");
  if (c.tiktokProfile)    out.push("tiktok");
  if (c.youtubeProfile)   out.push("youtube");
  if (c.twitterProfile)   out.push("twitter");
  if (c.facebookProfile)  out.push("facebook");
  return out;
}

function getInitials(c: Creator) {
  if (c.firstName && c.lastName) return `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
  return c.userName?.slice(0, 2).toUpperCase() ?? "??";
}

function getDisplayName(c: Creator) {
  return c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.userName;
}

/* ────────────────────────────────────────────────
   Creator Profile Modal
──────────────────────────────────────────────── */
function CreatorModal({
  creator,
  idx,
  user,
  onClose,
}: {
  creator: Creator;
  idx: number;
  user: { role: string } | null;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
  const badge = creator.badge ? BADGE_CFG[creator.badge] : null;
  const platforms = getActivePlatforms(creator);

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campsLoading, setCampsLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<string>("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (user?.role === "brand") {
      setCampsLoading(true);
      fetch(`${API_BASE}/campaigns`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => {
          const arr = Array.isArray(d) ? d : [];
          setCampaigns(arr);
          if (arr.length > 0) setSelectedCampaign(String(arr[0].id));
        })
        .catch(() => setCampaigns([]))
        .finally(() => setCampsLoading(false));
    }
  }, [user?.role]);

  async function handleInvite() {
    if (!selectedCampaign) return;
    setSending(true);
    try {
      const res = await fetch(`${API_BASE}/campaigns/${selectedCampaign}/invites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId: creator.id }),
      });
      if (res.ok) {
        setSent(true);
        toast({ title: "Invite sent!", description: `${getDisplayName(creator)} has been invited to your campaign.` });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Failed to send invite", description: err.error ?? "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(10,6,30,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* ── Banner ── */}
        <div className="h-24 w-full relative" style={{ background: "linear-gradient(135deg, #1a0a3e, #3d1a85)" }}>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-10">
          {/* Avatar + badge */}
          <div className="flex items-end justify-between mb-3">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-black text-2xl border-4 border-white shadow-lg"
              style={creator.avatarUrl ? {} : { background: grad }}
            >
              {creator.avatarUrl
                ? <img src={creator.avatarUrl} alt={creator.userName} className="w-full h-full object-cover rounded-2xl" />
                : getInitials(creator)}
            </div>
            {badge && (
              <span
                className="mb-1 px-3 py-1 rounded-full text-xs font-bold capitalize"
                style={{ background: badge.bg, color: badge.text }}
              >
                {badge.label}
              </span>
            )}
          </div>

          {/* Name & handle */}
          <h2 className="text-xl font-extrabold text-gray-900 leading-tight">{getDisplayName(creator)}</h2>
          <p className="text-sm text-gray-400 mb-3">@{creator.userName}</p>

          {/* Category */}
          {creator.contentCategory && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mb-3"
              style={{ background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
              {creator.contentCategory}
            </span>
          )}

          {/* Bio */}
          {creator.bio && (
            <p className="text-sm text-gray-600 leading-relaxed mb-4 bg-gray-50 rounded-xl p-3">{creator.bio}</p>
          )}

          {/* Platforms */}
          {platforms.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Active Platforms</p>
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <span key={p} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 border border-gray-100 bg-gray-50">
                    {PLATFORM_ICONS[p]}
                    {PLATFORM_LABELS[p]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="rounded-2xl p-4" style={{ background: "rgba(107,47,206,0.06)", border: "1px solid rgba(107,47,206,0.12)" }}>

            {/* Not logged in */}
            {!user && (
              <div className="text-center py-2">
                <Lock className="h-8 w-8 mx-auto mb-2 text-purple-300" />
                <p className="font-bold text-gray-800 mb-1">Sign in to contact this creator</p>
                <p className="text-xs text-gray-500 mb-4">Create a brand or agency account to invite creators to your campaigns.</p>
                <div className="flex gap-3 justify-center">
                  <Link
                    href={`/login?returnTo=${encodeURIComponent(`/search${window.location.search}`)}`}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                    style={{ background: "linear-gradient(135deg,#6B2FCE,#4E22A8)" }}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                    style={{ background: "linear-gradient(135deg,#1DCFB3,#0FA88E)" }}
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            {/* Brand — campaign invite */}
            {user?.role === "brand" && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Add to Campaign</p>
                {campsLoading ? (
                  <div className="h-10 bg-gray-100 rounded-xl animate-pulse mb-3" />
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-3">
                    <p className="text-sm text-gray-500 mb-3">You have no campaigns yet.</p>
                    <Link
                      href="/campaigns/create"
                      className="inline-block px-5 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                      style={{ background: "linear-gradient(135deg,#1DCFB3,#0FA88E)" }}
                    >
                      Create a Campaign
                    </Link>
                  </div>
                ) : sent ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(29,207,179,0.1)" }}>
                    <CheckCircle className="h-5 w-5 text-teal-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-teal-700">Invite Sent!</p>
                      <p className="text-xs text-teal-600">{getDisplayName(creator)} has been invited to your campaign.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-3">
                      <select
                        value={selectedCampaign}
                        onChange={(e) => setSelectedCampaign(e.target.value)}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl text-sm bg-white border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {campaigns.map((c) => (
                          <option key={c.id} value={String(c.id)}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <button
                      onClick={handleInvite}
                      disabled={sending || !selectedCampaign}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg,#1DCFB3,#0FA88E)" }}
                    >
                      <Send className="h-4 w-4" />
                      {sending ? "Sending…" : "Send Campaign Invite"}
                    </button>
                    <div className="mt-2 text-center">
                      <Link
                        href={`/creators/${creator.id}`}
                        className="text-xs text-purple-600 hover:underline font-medium"
                        onClick={onClose}
                      >
                        View full profile →
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Agency */}
            {user?.role === "agency" && (
              <div className="text-center py-2">
                <Briefcase className="h-8 w-8 mx-auto mb-2" style={{ color: "#6B2FCE" }} />
                <p className="font-bold text-gray-800 mb-1">Add to a Client Campaign</p>
                <p className="text-xs text-gray-500 mb-4">Go to your campaigns dashboard to assign this creator to an active client campaign.</p>
                <Link
                  href="/agency/campaigns"
                  className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg,#6B2FCE,#4E22A8)" }}
                  onClick={onClose}
                >
                  Go to Campaigns →
                </Link>
              </div>
            )}

            {/* Creator (shouldn't see this page but just in case) */}
            {user?.role === "creator" && (
              <div className="text-center py-2">
                <p className="text-sm text-gray-500">This creator directory is for brands and agencies.</p>
              </div>
            )}

            {/* Admin */}
            {user?.role === "admin" && (
              <div className="text-center py-2">
                <Link
                  href={`/creators/${creator.id}`}
                  className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition"
                  style={{ background: "linear-gradient(135deg,#FF8C42,#e07030)" }}
                  onClick={onClose}
                >
                  View Full Profile (Admin)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────
   Creator Card (public grid)
──────────────────────────────────────────────── */
function CreatorCard({
  creator,
  idx,
  onViewProfile,
}: {
  creator: Creator;
  idx: number;
  onViewProfile: () => void;
}) {
  const grad = AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length];
  const badge = creator.badge ? BADGE_CFG[creator.badge] : null;
  const platforms = getActivePlatforms(creator);

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
            : getInitials(creator)}
        </div>

        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="font-bold text-gray-900 leading-tight">{getDisplayName(creator)}</p>
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

        <button
          onClick={onViewProfile}
          className="block w-full text-center py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
        >
          View Profile
        </button>
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

/* ────────────────────────────────────────────────
   Page
──────────────────────────────────────────────── */
export default function PublicSearchPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const qs = parseQuery(window.location.search);

  const [platform, setPlatform] = useState(qs.platform);
  const [category, setCategory] = useState(qs.category);
  const [searchText, setSearchText] = useState(qs.q);
  const [debouncedQ, setDebouncedQ] = useState(qs.q);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [modalCreator, setModalCreator] = useState<{ creator: Creator; idx: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchText), 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => { setPage(1); }, [platform, category, debouncedQ]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "24" });
    if (platform) params.set("platform", platform);
    if (category) params.set("category", category);
    if (debouncedQ) params.set("search", debouncedQ);

    fetch(`${API_BASE}/public/creators?${params}`)
      .then((r) => r.json())
      .then((d) => { setCreators(d.data ?? []); setTotal(d.total ?? 0); })
      .catch(() => { setCreators([]); setTotal(0); })
      .finally(() => setIsLoading(false));
  }, [platform, category, debouncedQ, page]);

  const totalPages = Math.ceil(total / 24);

  function openModal(creator: Creator, idx: number) {
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(`/search${window.location.search}`)}`);
      return;
    }
    setModalCreator({ creator, idx });
  }

  return (
    <PublicLayout>

      {/* ── Creator Profile Modal ── */}
      {modalCreator && (
        <CreatorModal
          creator={modalCreator.creator}
          idx={modalCreator.idx}
          user={user}
          onClose={() => setModalCreator(null)}
        />
      )}

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
          <p className="text-white/60 text-sm mb-8">
            {user
              ? "Browse verified West African content creators — click View Profile to invite them to your campaign."
              : "Browse verified West African content creators — sign up to unlock full profiles, pricing and invites."}
          </p>

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
            {!user && (
              <Link
                href="/register"
                className="px-5 py-2 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #6B2FCE, #4E22A8)" }}
              >
                Sign up to invite creators →
              </Link>
            )}
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
                : creators.map((c, i) => (
                  <CreatorCard
                    key={c.id}
                    creator={c}
                    idx={i}
                    onViewProfile={() => openModal(c, i)}
                  />
                ))
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

          {/* Upsell banner — only for unauthenticated */}
          {!user && (
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
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
