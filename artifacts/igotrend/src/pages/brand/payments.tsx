import { useListPayments, getListPaymentsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, CheckCircle, Clock } from "lucide-react";

export default function PaymentsPage() {
  const { data = [], isLoading } = useListPayments({ query: { queryKey: getListPaymentsQueryKey() } });

  return (
    <BrandLayout>
      <div data-testid="page-payments">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data.length} transactions</p>
        </div>

        {isLoading ? <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div> :
          !data.length ? (
            <div className="text-center py-16">
              <CreditCard className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">No payments yet</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Campaign</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Type</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                </tr></thead>
                <tbody className="divide-y divide-border">
                  {data.map(p => (
                    <tr key={p.id} data-testid={`payment-row-${p.id}`}>
                      <td className="px-4 py-3">
                        <div className="font-medium">{p.campaignName ?? "Campaign payment"}</div>
                        <div className="text-xs text-muted-foreground font-mono">{p.txRef}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">${p.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{p.paymentType}</td>
                      <td className="px-4 py-3">
                        {p.paymentStatus ? (
                          <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="h-3 w-3" /> Paid</span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-600 text-xs"><Clock className="h-3 w-3" /> Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </BrandLayout>
  );
}
