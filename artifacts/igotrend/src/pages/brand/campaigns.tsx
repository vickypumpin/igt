import { useState } from "react";
import { Link } from "wouter";
import { useListCampaigns, getListCampaignsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search, Calendar, Users } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    completed: "bg-blue-100 text-blue-700",
    declined: "bg-red-100 text-red-700",
  };
  return <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

const STATUS_FILTERS = ["all", "active", "pending", "completed", "declined"];

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
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold">Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data.length} total campaigns</p>
          </div>
          <Link href="/campaigns/new">
            <Button size="sm" data-testid="button-new-campaign"><Plus className="h-4 w-4 mr-1.5" /> New Campaign</Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 h-9" placeholder="Search campaigns..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors capitalize ${filter === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`} data-testid={`filter-${s}`}>{s}</button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : !filtered.length ? (
          <div className="text-center py-16 text-muted-foreground">
            <Megaphone className="h-8 w-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">{search ? "No campaigns match your search" : "No campaigns yet"}</p>
            {!search && <Link href="/campaigns/new"><Button size="sm" className="mt-3">Create your first campaign</Button></Link>}
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Duration</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Creators</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`campaign-row-${c.id}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.sponsor}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{c.type.replace("_", " ")}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Calendar className="h-3 w-3" />
                        {c.startDate} — {c.endDate}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Users className="h-3 w-3" />
                        {c.invitesCount}/{c.noOfCreators}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <Link href={`/campaigns/${c.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" data-testid={`button-view-campaign-${c.id}`}>View</Button>
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

function Megaphone({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>;
}
