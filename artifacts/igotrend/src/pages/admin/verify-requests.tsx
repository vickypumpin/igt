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
    approveMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListVerifyRequestsQueryKey() }); toast({ title: "Verification approved" }); } });
  };
  const handleReject = (id: number) => {
    rejectMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListVerifyRequestsQueryKey() }); toast({ title: "Verification rejected" }); } });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-verify">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Verification Requests</h1>
          <p className="text-sm text-muted-foreground">{data.filter(r => !r.isApproved).length} pending</p>
        </div>

        {isLoading ? <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div> :
          !data.length ? (
            <div className="text-center py-12">
              <ShieldCheck className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">No verification requests</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">User</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Bank</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Account</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {data.map(r => (
                    <tr key={r.id} data-testid={`verify-row-${r.id}`}>
                      <td className="px-4 py-3 text-muted-foreground">User #{r.userId}</td>
                      <td className="px-4 py-3">{r.bankName ?? `Bank #${r.bankId}`}</td>
                      <td className="px-4 py-3 font-mono text-sm">{r.accountNumber}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.isApproved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{r.isApproved ? "Approved" : "Pending"}</span>
                      </td>
                      <td className="px-4 py-3">
                        {!r.isApproved && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-7 text-xs" onClick={() => handleApprove(r.id)} data-testid={`button-approve-${r.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                            <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => handleReject(r.id)} data-testid={`button-reject-${r.id}`}><XCircle className="h-3 w-3 mr-1" />Reject</Button>
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
