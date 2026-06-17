import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Users } from "lucide-react";
import { useSearch } from "wouter";

interface ClientInfo {
  brandUserId: number | null;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface Campaign {
  id: number; name: string; sponsor: string; status: string; type: string;
  noOfCreators: number | null; startDate: string | null; endDate: string | null;
  coverImageUrl: string | null; brandId: number | null; createdAt: string;
  submissionsCount: number;
  client: ClientInfo | null;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)",   color: "#059669" },
  pending:   { bg: "rgba(245,158,11,0.12)",   color: "#D97706" },
  completed: { bg: "rgba(29,207,179,0.12)",   color: "#0FA88E" },
  declined:  { bg: "rgba(239,68,68,0.12)",    color: "#DC2626" },
};

const PURPLE = "#6B2FCE";

export default function AgencyCampaignsPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultClient = params.get("client") ?? "all";

  const [clientFilter, setClientFilter] = useState<string>(defaultClient);

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/agency/campaigns"],
    queryFn: () => customFetch("/api/agency/campaigns"),
  });

  const clients = useMemo(() => {
    const seen = new Map<string, string>();
    campaigns.forEach(c => {
      if (c.client?.brandUserId) {
        const name = c.client.companyName
          || (c.client.firstName ? `${c.client.firstName} ${c.client.lastName ?? ""}`.trim() : null)
          || c.client.email
          || String(c.client.brandUserId);
        seen.set(String(c.client.brandUserId), name);
      }
    });
    return Array.from(seen.entries());
  }, [campaigns]);

  const filtered = useMemo(() =>
    clientFilter === "all" ? campaigns : campaigns.filter(c => String(c.client?.brandUserId) === clientFilter),
    [campaigns, clientFilter]);

  const byCampaignStatus = (s: string) => STATUS_STYLE[s] ?? { bg: "rgba(107,114,128,0.12)", color: "#4B5563" };

  return (
    <AgencyLayout>
      <div data-testid="page-agency-campaigns">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold">Client Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-0.5">All campaigns across your accepted clients — {filtered.length} of {campaigns.length} shown</p>
          </div>
          {clients.length > 0 && (
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/60 px-3 text-sm bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              data-testid="select-client-filter"
            >
              <option value="all">All clients</option>
              {clients.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !campaigns.length ? (
          <div className="text-center py-20 rounded-2xl border border-border/60 bg-white">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(107,47,206,0.1)" }}>
              <Megaphone className="h-7 w-7" style={{ color: PURPLE }} />
            </div>
            <p className="text-sm font-semibold mb-1">No campaigns yet</p>
            <p className="text-xs text-muted-foreground">Campaigns from your accepted clients will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creators</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submissions</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(c => {
                  const st = byCampaignStatus(c.status);
                  const clientName = c.client?.companyName
                    || (c.client?.firstName ? `${c.client.firstName} ${c.client.lastName ?? ""}`.trim() : null)
                    || c.client?.email
                    || "—";
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`campaign-row-${c.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {c.coverImageUrl ? (
                            <img src={c.coverImageUrl} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: PURPLE }}>
                              <Megaphone className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.sponsor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-medium">{clientName}</div>
                        {c.client?.email && c.client.companyName && (
                          <div className="text-xs text-muted-foreground">{c.client.email}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs capitalize text-muted-foreground">{c.type}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {c.noOfCreators ?? 0}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{Number(c.submissionsCount)}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AgencyLayout>
  );
}
