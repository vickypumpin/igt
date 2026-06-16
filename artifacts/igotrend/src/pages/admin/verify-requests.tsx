import { useAdminListVerifyRequests, useAdminApproveVerifyRequest, useAdminRejectVerifyRequest, getAdminListVerifyRequestsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ShieldCheck } from "lucide-react";

export default function VerifyRequestsPage() {
  const { toast } = useToast();
  const { data = [], isLoading } = useAdminListVerifyRequests({ query: { queryKey: getAdminListVerifyRequestsQueryKey() } });
  const approveMutation = useAdminApproveVerifyRequest();
  const rejectMutation = useAdminRejectVerifyRequest();

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListVerifyRequestsQueryKey() }); toast({ title: "Verification approved ✓" }); } });
  };
  const handleReject = (id: number) => {
    rejectMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListVerifyRequestsQueryKey() }); toast({ title: "Verification rejected" }); } });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-verify">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Verification Requests</h1>
          <p className="text-sm text-muted-foreground">{data.filter(r => !r.isApproved).length} pending</p>
        </div>

        {isLoading ? <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div> :
          !data.length ? (
            <div className="text-center py-16 rounded-2xl border border-border/60">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                <ShieldCheck className="h-7 w-7" style={{ color: "#FF8C42" }} />
              </div>
              <p className="text-sm font-medium">No verification requests</p>
              <p className="text-xs text-muted-foreground mt-1">All caught up!</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Bank</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Account number</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map(r => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors" data-testid={`verify-row-${r.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>U</div>
                          <span className="font-semibold text-sm">User #{r.userId}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium">{r.bankName ?? `Bank #${r.bankId}`}</td>
                      <td className="px-5 py-3.5 font-mono text-sm tracking-wider">{r.accountNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={r.isApproved ? { background: "rgba(16,185,129,0.12)", color: "#059669" } : { background: "rgba(245,158,11,0.12)", color: "#D97706" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: r.isApproved ? "#10B981" : "#F59E0B" }} />
                          {r.isApproved ? "Approved" : "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {!r.isApproved && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 text-xs rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} onClick={() => handleApprove(r.id)} data-testid={`button-approve-${r.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl text-destructive font-semibold" onClick={() => handleReject(r.id)} data-testid={`button-reject-${r.id}`}><XCircle className="h-3 w-3 mr-1" />Reject</Button>
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
