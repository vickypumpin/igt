import { useState, useEffect, useCallback } from "react";
import { X, Search, Instagram, Youtube, Twitter, Facebook, CheckCircle, Users } from "lucide-react";
import { SiTiktok, SiSnapchat } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

const BADGE_CFG: Record<string, { bg: string; text: string; label: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563", label: "Nano" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB", label: "Micro" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669", label: "Mid-tier" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED", label: "Macro" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C", label: "Mega" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309", label: "Elite" },
};

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-3 w-3" />,
  tiktok:    <SiTiktok className="h-3 w-3" />,
  youtube:   <Youtube className="h-3 w-3" />,
  twitter:   <Twitter className="h-3 w-3" />,
  facebook:  <Facebook className="h-3 w-3" />,
  snapchat:  <SiSnapchat className="h-3 w-3" />,
};

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok",    label: "TikTok" },
  { value: "youtube",   label: "YouTube" },
  { value: "twitter",   label: "Twitter / X" },
  { value: "facebook",  label: "Facebook" },
  { value: "snapchat",  label: "Snapchat" },
];

const CATEGORIES = [
  "Dance","Gaming","Vlogging","Skit Creation","Fitness","Fashion",
  "Beauty","Comedy","Food & Cooking","Travel","Music","Education",
];

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1DCFB3,#0FA88E)",
  "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
  "linear-gradient(135deg,#EF4444,#DC2626)",
  "linear-gradient(135deg,#E91E8C,#C0166E)",
];

const PURPLE = "#6B2FCE";

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
  snapchatProfile: string | null;
};

function getActivePlatforms(c: Creator): string[] {
  const out: string[] = [];
  if (c.instagramProfile) out.push("instagram");
  if (c.tiktokProfile)    out.push("tiktok");
  if (c.youtubeProfile)   out.push("youtube");
  if (c.twitterProfile)   out.push("twitter");
  if (c.facebookProfile)  out.push("facebook");
  if (c.snapchatProfile)  out.push("snapchat");
  return out;
}

function getInitials(c: Creator) {
  if (c.firstName && c.lastName) return `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
  return c.userName?.slice(0, 2).toUpperCase() ?? "??";
}

function getDisplayName(c: Creator) {
  return c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.userName;
}

interface CreatorPickerPanelProps {
  campaignId: number;
  campaignName: string;
  onClose: () => void;
  alreadyInvitedIds?: Set<number>;
  onInviteSuccess?: (creatorId: number) => void;
}

export function CreatorPickerPanel({
  campaignId,
  campaignName,
  onClose,
  alreadyInvitedIds = new Set(),
  onInviteSuccess,
}: CreatorPickerPanelProps) {
  const { toast } = useToast();

  const [searchText, setSearchText] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [inviting, setInviting] = useState<Set<number>>(new Set());
  const [invited, setInvited] = useState<Set<number>>(new Set(alreadyInvitedIds));

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(searchText); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  useEffect(() => { setPage(1); }, [platform, category]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "12" });
    if (platform) params.set("platform", platform);
    if (category) params.set("category", category);
    if (debouncedQ) params.set("search", debouncedQ);

    fetch(`${API_BASE}/public/creators?${params}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => { setCreators(d.data ?? []); setTotal(d.total ?? 0); })
      .catch(() => { setCreators([]); setTotal(0); })
      .finally(() => setIsLoading(false));
  }, [platform, category, debouncedQ, page]);

  const totalPages = Math.ceil(total / 12);

  const handleInvite = useCallback(async (creatorId: number) => {
    setInviting(prev => new Set(prev).add(creatorId));
    try {
      const res = await fetch(`${API_BASE}/agency/campaigns/${campaignId}/invites`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId }),
      });
      if (res.ok) {
        setInvited(prev => new Set(prev).add(creatorId));
        onInviteSuccess?.(creatorId);
        toast({ title: "Invite sent!", description: "The creator has been invited to the campaign." });
      } else {
        const err = await res.json().catch(() => ({}));
        toast({ title: "Failed to invite", description: err.error ?? "Something went wrong.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Network error", description: "Please try again.", variant: "destructive" });
    } finally {
      setInviting(prev => { const s = new Set(prev); s.delete(creatorId); return s; });
    }
  }, [campaignId, onInviteSuccess, toast]);

  return (
    <div
      className="fixed inset-0 z-[300] flex justify-end"
      style={{ background: "rgba(10,6,30,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/60 flex items-start justify-between gap-3" style={{ background: "linear-gradient(135deg, #1a0a3e, #3d1a85)" }}>
          <div>
            <h2 className="text-base font-extrabold text-white">Invite Creators</h2>
            <p className="text-xs text-white/60 mt-0.5 line-clamp-1">Campaign: {campaignName}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/20"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-4 py-3 border-b border-border/60 space-y-2 bg-gray-50/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or handle…"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={platform}
              onChange={e => setPlatform(e.target.value)}
              className="flex-1 px-2 py-1.5 rounded-xl text-xs bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            >
              <option value="">All Platforms</option>
              {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 px-2 py-1.5 rounded-xl text-xs bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-100 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-7 w-16 bg-gray-200 rounded-lg" />
              </div>
            ))
          ) : creators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-500">No creators found</p>
              <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            creators.map((c, i) => {
              const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
              const badge = c.badge ? BADGE_CFG[c.badge] : null;
              const platforms = getActivePlatforms(c);
              const isInvited = invited.has(c.id);
              const isInviting = inviting.has(c.id);

              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-white hover:bg-gray-50/70 transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-sm overflow-hidden"
                    style={c.avatarUrl ? {} : { background: grad }}
                  >
                    {c.avatarUrl
                      ? <img src={c.avatarUrl} alt={c.userName} className="w-full h-full object-cover" />
                      : getInitials(c)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 truncate">{getDisplayName(c)}</span>
                      {badge && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0" style={{ background: badge.bg, color: badge.text }}>
                          {badge.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">@{c.userName}</p>
                    {platforms.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {platforms.map(p => (
                          <span key={p} className="w-4 h-4 rounded flex items-center justify-center text-gray-400">
                            {PLATFORM_ICONS[p]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => !isInvited && handleInvite(c.id)}
                    disabled={isInvited || isInviting}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:cursor-default"
                    style={
                      isInvited
                        ? { background: "rgba(16,185,129,0.12)", color: "#059669" }
                        : { background: PURPLE, color: "white", opacity: isInviting ? 0.7 : 1 }
                    }
                  >
                    {isInvited ? (
                      <><CheckCircle className="h-3 w-3" /> Invited</>
                    ) : isInviting ? "Sending…" : "Invite"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border/60 flex items-center justify-between bg-gray-50/80">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        )}

        {/* Footer count */}
        <div className="px-5 py-2 border-t border-border/60 bg-gray-50/80">
          <p className="text-xs text-gray-400 text-center">
            {isLoading ? "Searching…" : `${total.toLocaleString()} creator${total !== 1 ? "s" : ""} found`}
          </p>
        </div>
      </div>
    </div>
  );
}
