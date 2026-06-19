import { useState } from "react";
import { useAdminListCampaigns, useAdminUpdateCampaignStatus, getAdminListCampaignsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Megaphone } from "lucide-react";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5", dot: "#6366F1" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />{status}</span>;
}

const STATUS_FILTERS = ["all", "pending", "active", "completed", "declined"];

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState("pending");
  const { toast } = useToast();
  const updateStatus = useAdminUpdateCampaignStatus();
  const params = filter !== "all" ? { status: filter as "pending" | "active" | "completed" | "declined" } : {};
  const { data = [], isLoading } = useAdminListCampaigns(params, { query: { queryKey: getAdminListCampaignsQueryKey(params) } });

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id, data: { status: "active" } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListCampaignsQueryKey() }); toast({ title: "Campaign approved ✓" }); } });
  };
  const handleDecline = (id: number) => {
    updateStatus.mutate({ id, data: { status: "declined" } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListCampaignsQueryKey() }); toast({ title: "Campaign declined" }); } });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-campaigns">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">{data.length} campaigns</p>
        </div>

        <div className="flex gap-1 mb-5">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(255,140,66,0.15)", color: "#E47128", border: "1px solid rgba(255,140,66,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
              data-testid={`filter-${f}`}>{f}</button>
          ))}
        </div>

        {isLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
          !data.length ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                <Megaphone className="h-7 w-7" style={{ color: "#FF8C42" }} />
              </div>
              <p className="text-sm font-medium">No campaigns</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Created</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map(c => (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`campaign-row-${c.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>{c.name[0]?.toUpperCase()}</div>
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.sponsor}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground capitalize text-xs font-medium">{c.type?.replace("_", " ") ?? ""}</td>
                      <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        {c.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleApprove(c.id)} className="h-8 text-xs rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid={`button-approve-${c.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                            <Button size="sm" variant="outline" onClick={() => handleDecline(c.id)} className="h-8 text-xs rounded-xl text-destructive font-semibold" data-testid={`button-decline-${c.id}`}><XCircle className="h-3 w-3 mr-1" />Decline</Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </AdminLayout>
  );
}
