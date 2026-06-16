import { useState } from "react";
import { useAdminListCampaigns, useAdminUpdateCampaignStatus, getAdminListCampaignsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", completed: "bg-blue-100 text-blue-700", declined: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

const STATUS_FILTERS = ["all", "pending", "active", "completed", "declined"];

export default function AdminCampaignsPage() {
  const [filter, setFilter] = useState("pending");
  const { toast } = useToast();
  const updateStatus = useAdminUpdateCampaignStatus();
  const params = filter !== "all" ? { status: filter as "pending" | "active" | "completed" | "declined" } : {};
  const { data = [], isLoading } = useAdminListCampaigns(params, { query: { queryKey: getAdminListCampaignsQueryKey(params) } });

  const handleApprove = (id: number) => {
    updateStatus.mutate({ id, data: { status: "active" } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListCampaignsQueryKey() }); toast({ title: "Campaign approved" }); },
    });
  };
  const handleDecline = (id: number) => {
    updateStatus.mutate({ id, data: { status: "declined" } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListCampaignsQueryKey() }); toast({ title: "Campaign declined" }); },
    });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-campaigns">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Campaigns</h1>
          <p className="text-sm text-muted-foreground">{data.length} campaigns</p>
        </div>
        <div className="flex gap-1 mb-4">
          {STATUS_FILTERS.map(f => <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`} data-testid={`filter-${f}`}>{f}</button>)}
        </div>

        {isLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div> : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Campaign</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Created</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {data.map(c => (
                  <tr key={c.id} data-testid={`campaign-row-${c.id}`}>
                    <td className="px-4 py-3"><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.sponsor}</div></td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{c.type.replace("_", " ")}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {c.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApprove(c.id)} className="h-7 text-xs" data-testid={`button-approve-${c.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                          <Button size="sm" variant="outline" onClick={() => handleDecline(c.id)} className="h-7 text-xs text-destructive" data-testid={`button-decline-${c.id}`}><XCircle className="h-3 w-3 mr-1" />Decline</Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
