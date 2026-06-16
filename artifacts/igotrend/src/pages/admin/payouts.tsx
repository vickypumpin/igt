import { useAdminListPayouts, useAdminApprovePayout, getAdminListPayoutsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Wallet } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AdminPayoutsPage() {
  const { toast } = useToast();
  const { data = [], isLoading } = useAdminListPayouts({ query: { queryKey: getAdminListPayoutsQueryKey() } });
  const approveMutation = useAdminApprovePayout();

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListPayoutsQueryKey() }); toast({ title: "Payout approved" }); } });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-payouts">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Payout Requests</h1>
          <p className="text-sm text-muted-foreground">{data.filter(p => p.status === "pending").length} pending</p>
        </div>

        {isLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div> :
          !data.length ? (
            <div className="text-center py-12">
              <Wallet className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">No payout requests</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Creator</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Requested</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {data.map(p => (
                    <tr key={p.id} data-testid={`payout-row-${p.id}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6"><AvatarFallback className="text-xs">{p.creator?.firstName?.[0]}{p.creator?.lastName?.[0]}</AvatarFallback></Avatar>
                          <div>
                            <div className="font-medium">{p.creator?.firstName} {p.creator?.lastName}</div>
                            <div className="text-xs text-muted-foreground">@{p.creator?.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">${p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === "approved" ? "bg-green-100 text-green-700" : p.status === "rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{p.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        {p.status === "pending" && (
                          <Button size="sm" className="h-7 text-xs" onClick={() => handleApprove(p.id)} data-testid={`button-approve-${p.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
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
