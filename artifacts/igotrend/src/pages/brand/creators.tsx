import { useState } from "react";
import { Link } from "wouter";
import { useListCreators, getListCreatorsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

const BADGES = ["", "nano", "micro", "mid_tier", "macro", "mega", "elite"];
const BADGE_COLORS: Record<string, string> = {
  nano: "bg-gray-100 text-gray-700", micro: "bg-blue-100 text-blue-700", mid_tier: "bg-green-100 text-green-700",
  macro: "bg-purple-100 text-purple-700", mega: "bg-orange-100 text-orange-700", elite: "bg-yellow-100 text-yellow-700",
};

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
    clearTimeout((window as Record<string, unknown>).__searchTimer as number);
    (window as Record<string, unknown>).__searchTimer = setTimeout(() => setDebouncedSearch(val), 350) as unknown as number;
  };

  return (
    <BrandLayout>
      <div data-testid="page-creators">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Creator Discovery</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data?.total ?? 0} creators available</p>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 h-9" placeholder="Search by username..." value={search} onChange={e => handleSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1">
            {BADGES.map(b => (
              <button key={b} onClick={() => setBadge(b === badge ? "" : b)} className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors capitalize ${badge === b && b !== "" ? "bg-primary text-primary-foreground" : b === "" && badge === "" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`} data-testid={`filter-badge-${b || "all"}`}>{b || "All"}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">{Array(9).fill(0).map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        ) : !creators.length ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No creators found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {creators.map(c => (
              <Link key={c.id} href={`/creators/${c.id}`}>
                <div className="border border-border rounded-lg p-4 hover:bg-muted/30 cursor-pointer transition-colors" data-testid={`creator-card-${c.id}`}>
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={c.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-sm">{c.firstName[0]}{c.lastName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{c.firstName} {c.lastName}</div>
                      <div className="text-xs text-muted-foreground">@{c.userName}</div>
                      {c.badge && <span className={`mt-1 inline-block text-xs px-1.5 py-0.5 rounded-full capitalize ${BADGE_COLORS[c.badge] ?? "bg-muted text-muted-foreground"}`}>{c.badge.replace("_", " ")}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {c.instagramProfile && <div className="flex items-center gap-1"><SiInstagram className="h-3 w-3" />IG</div>}
                    {c.tiktokProfile && <div className="flex items-center gap-1"><SiTiktok className="h-3 w-3" />TikTok</div>}
                    {c.youtubeProfile && <div className="flex items-center gap-1"><SiYoutube className="h-3 w-3" />YT</div>}
                  </div>
                  {c.contentCategoryNames && <div className="mt-2 text-xs text-muted-foreground truncate">{c.contentCategoryNames}</div>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </BrandLayout>
  );
}
