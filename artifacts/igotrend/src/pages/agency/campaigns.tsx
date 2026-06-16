import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Megaphone, Users } from "lucide-react";

interface Campaign {
  id: number; name: string; sponsor: string; status: string; type: string;
  noOfCreators: number | null; startDate: string | null; endDate: string | null;
  coverImageUrl: string | null; userId: number; createdAt: string;
  submissionsCount: number;
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)",   color: "#059669" },
  pending:   { bg: "rgba(245,158,11,0.12)",   color: "#D97706" },
  completed: { bg: "rgba(29,207,179,0.12)",   color: "#0FA88E" },
  declined:  { bg: "rgba(239,68,68,0.12)",    color: "#DC2626" },
};

const PURPLE = "#6B2FCE";

export default function AgencyCampaignsPage() {
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/agency/campaigns"],
    queryFn: () => customFetch("/api/agency/campaigns"),
  });

  const byCampaignStatus = (s: string) => STATUS_STYLE[s] ?? { bg: "rgba(107,114,128,0.12)", color: "#4B5563" };

  return (
    <AgencyLayout>
      <div data-testid="page-agency-campaigns">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Client Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">All campaigns across your accepted clients — {campaigns.length} total</p>
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
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creators</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submissions</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {campaigns.map(c => {
                  const st = byCampaignStatus(c.status);
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
