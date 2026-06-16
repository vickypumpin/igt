import { useAdminListPayouts, useAdminApprovePayout, getAdminListPayoutsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const AVATAR_GRADIENTS = ["linear-gradient(135deg, #1DCFB3, #0FA88E)", "linear-gradient(135deg, #8B5CF6, #6D28D9)", "linear-gradient(135deg, #3B82F6, #2563EB)", "linear-gradient(135deg, #F59E0B, #D97706)", "linear-gradient(135deg, #EF4444, #DC2626)"];

export default function AdminPayoutsPage() {
  const { toast } = useToast();
  const { data = [], isLoading } = useAdminListPayouts({ query: { queryKey: getAdminListPayoutsQueryKey() } });
  const approveMutation = useAdminApprovePayout();

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListPayoutsQueryKey() }); toast({ title: "Payout approved ✓" }); } });
  };

  const pending = data.filter(p => p.status === "pending");
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  return (
    <AdminLayout>
      <div data-testid="page-admin-payouts">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Payout Requests</h1>
          <p className="text-sm text-muted-foreground">{pending.length} pending</p>
        </div>

        {!isLoading && data.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total requests", value: data.length, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
              { label: "Pending amount", value: `$${totalPending.toLocaleString()}`, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
              { label: "Approved", value: data.filter(p => p.status === "approved").length, gradient: "linear-gradient(135deg, #10B981, #059669)" },
            ].map(({ label, value, gradient }) => (
              <Card key={label} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="text-2xl font-extrabold">{value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                  <div className="h-1 rounded-full mt-2 w-full opacity-30" style={{ background: gradient }} />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
          !data.length ? (
            <div className="text-center py-16 rounded-2xl border border-border/60">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                <Wallet className="h-7 w-7" style={{ color: "#FF8C42" }} />
              </div>
              <p className="text-sm font-medium">No payout requests</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creator</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Requested</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`payout-row-${p.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-bold" style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], color: "white" }}>{p.creator?.firstName?.[0]}{p.creator?.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{p.creator?.firstName} {p.creator?.lastName}</div>
                            <div className="text-xs text-muted-foreground">@{p.creator?.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-lg font-extrabold">${p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={p.status === "approved" ? { background: "rgba(16,185,129,0.12)", color: "#059669" } : p.status === "rejected" ? { background: "rgba(239,68,68,0.12)", color: "#DC2626" } : { background: "rgba(245,158,11,0.12)", color: "#D97706" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.status === "approved" ? "#10B981" : p.status === "rejected" ? "#EF4444" : "#F59E0B" }} />
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        {p.status === "pending" && (
                          <Button size="sm" className="h-8 text-xs rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} onClick={() => handleApprove(p.id)} data-testid={`button-approve-${p.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
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
