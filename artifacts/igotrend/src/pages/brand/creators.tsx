import { useState } from "react";
import { Link } from "wouter";
import { useListCreators, getListCreatorsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, BadgeCheck } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX } from "react-icons/si";

const BADGES = ["", "nano", "micro", "mid_tier", "macro", "mega", "elite"];
const BADGE_CFG: Record<string, { bg: string; text: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309" },
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1DCFB3, #0FA88E)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #3B82F6, #2563EB)",
  "linear-gradient(135deg, #F59E0B, #D97706)",
  "linear-gradient(135deg, #EF4444, #DC2626)",
];

export default function CreatorsPage() {
  const [search, setSearch] = useState("");
  const [badge, setBadge] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const params = {
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(badge && { badge: badge as "nano" | "micro" | "mid_tier" | "macro" | "mega" | "elite" }),
    limit: 50,
  };

  const { data, isLoading } = useListCreators(params, { query: { queryKey: getListCreatorsQueryKey(params) } });
  const creators = data?.data ?? [];

  const handleSearch = (val: string) => {
    setSearch(val);
    clearTimeout((window as unknown as Record<string, unknown>).__searchTimer as number);
    (window as unknown as Record<string, unknown>).__searchTimer = setTimeout(() => setDebouncedSearch(val), 350) as unknown as number;
  };

  return (
    <BrandLayout>
      <div data-testid="page-creators">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Creator Discovery</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} verified creators available</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 min-w-52 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-10 rounded-xl" placeholder="Search by username or name…" value={search} onChange={e => handleSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1 flex-wrap">
            {BADGES.map(b => (
              <button key={b} onClick={() => setBadge(b === badge ? "" : b)}
                className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
                style={(badge === b) || (b === "" && badge === "") ? { background: "rgba(29,207,179,0.15)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
                data-testid={`filter-badge-${b || "all"}`}
              >{b || "All"}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}</div>
        ) : !creators.length ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <Users className="h-7 w-7" style={{ color: "#1DCFB3" }} />
            </div>
            <p className="text-sm font-medium">No creators found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((c, idx) => (
              <Link key={c.id} href={`/creators/${c.id}`}>
                <div className="bg-white border border-border/60 rounded-2xl p-4 hover:shadow-md cursor-pointer transition-all hover:border-primary/30 group" data-testid={`creator-card-${c.id}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={c.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-sm font-bold" style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], color: "white" }}>{c.firstName[0]}{c.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div className="font-bold text-sm truncate group-hover:text-primary transition-colors">{c.firstName} {c.lastName}</div>
                        {!!(c as unknown as Record<string, unknown>).verified && <BadgeCheck className="h-3.5 w-3.5 flex-shrink-0" style={{ color: "#1DCFB3" }} />}
                      </div>
                      <div className="text-xs text-muted-foreground">@{c.userName}</div>
                      {c.badge && (
                        <span className="mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: BADGE_CFG[c.badge]?.bg ?? "rgba(29,207,179,0.1)", color: BADGE_CFG[c.badge]?.text ?? "#0FA88E" }}>
                          {c.badge.replace("_", " ")}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {c.instagramProfile && <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: "rgba(225,48,108,0.1)", color: "#E1306C" }}><SiInstagram className="h-3 w-3" /> IG</div>}
                    {c.tiktokProfile && <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: "rgba(0,0,0,0.07)", color: "#333" }}><SiTiktok className="h-3 w-3" /> TikTok</div>}
                    {c.youtubeProfile && <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: "rgba(255,0,0,0.1)", color: "#CC0000" }}><SiYoutube className="h-3 w-3" /> YT</div>}
                    {c.facebookProfile && <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: "rgba(59,89,152,0.1)", color: "#3B5998" }}><SiFacebook className="h-3 w-3" /> FB</div>}
                    {c.twitterProfile && <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-medium" style={{ background: "rgba(29,161,242,0.1)", color: "#1DA1F2" }}><SiX className="h-3 w-3" /> X</div>}
                  </div>
                  {c.contentCategoryNames && <div className="mt-2.5 text-xs text-muted-foreground truncate">{c.contentCategoryNames}</div>}
                  {(() => {
                    const r = c as unknown as Record<string, unknown>;
                    const prices = [
                      r.instagramDayPostPrice, r.instagramWeekPostPrice,
                      r.tiktokDayPostPrice, r.tiktokWeekPostPrice,
                      r.youtubeDayPostPrice, r.youtubeWeekPostPrice,
                    ].filter((v): v is number => typeof v === "number" && v > 0);
                    if (!prices.length) return null;
                    const min = Math.min(...prices);
                    return (
                      <div className="mt-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
                          from ₦{min.toLocaleString()}/post
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </BrandLayout>
  );
}
