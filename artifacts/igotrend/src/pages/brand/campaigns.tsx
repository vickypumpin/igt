import { useState } from "react";
import { Link } from "wouter";
import { useListCampaigns, getListCampaignsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Calendar, Users, Megaphone, Gem } from "lucide-react";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5", dot: "#6366F1" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />{status}</span>;
}

const STATUS_FILTERS = ["all", "active", "pending", "completed", "declined"];

function FilterPill({ label, active, onClick, testid }: { label: string; active: boolean; onClick: () => void; testid?: string }) {
  return (
    <button onClick={onClick} data-testid={testid}
      className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
      style={active ? { background: "rgba(29,207,179,0.15)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
    >{label}</button>
  );
}

export default function CampaignsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const { data = [], isLoading } = useListCampaigns(
    filter !== "all" ? { status: filter as "active" | "pending" | "completed" | "declined" } : {},
    { query: { queryKey: getListCampaignsQueryKey(filter !== "all" ? { status: filter as "active" | "pending" | "completed" | "declined" } : {}) } }
  );
  const filtered = data.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.sponsor.toLowerCase().includes(search.toLowerCase()));

  return (
    <BrandLayout>
      <div data-testid="page-campaigns">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data.length} total campaigns</p>
          </div>
          <Link href="/campaigns/new">
            <Button className="h-9 rounded-xl font-semibold gap-1.5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="button-new-campaign">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-10 rounded-xl" placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map(s => <FilterPill key={s} label={s} active={filter === s} onClick={() => setFilter(s)} testid={`filter-${s}`} />)}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <Megaphone className="h-7 w-7" style={{ color: "#1DCFB3" }} />
            </div>
            <p className="text-sm font-medium text-foreground">{search ? "No campaigns match your search" : "No campaigns yet"}</p>
            <p className="text-xs text-muted-foreground mt-1">Campaigns you create will appear here</p>
            {!search && <Link href="/campaigns/new"><Button size="sm" className="mt-4 rounded-xl" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}>Create your first campaign</Button></Link>}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Duration</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creators</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`campaign-row-${c.id}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>{c.name[0]?.toUpperCase()}</div>
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.sponsor}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground capitalize text-xs">{c.type?.replace("_", " ") ?? ""}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs"><Calendar className="h-3 w-3" />{c.startDate} — {c.endDate}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-medium"><span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">{c.invitesCount}</span><span className="text-muted-foreground">/ {c.noOfCreators}</span></div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <StatusBadge status={c.status} />
                        {(c as typeof c & { isFunded?: boolean }).isFunded && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }} data-testid={`badge-funded-${c.id}`}>
                            <Gem className="h-2.5 w-2.5" /> Funded ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/campaigns/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-3 text-xs rounded-lg font-semibold" style={{ color: "#1DCFB3" }} data-testid={`button-view-campaign-${c.id}`}>View →</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </BrandLayout>
  );
}
