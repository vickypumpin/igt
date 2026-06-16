import { useListPayments, getListPaymentsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";

export default function PaymentsPage() {
  const { data = [], isLoading } = useListPayments({ query: { queryKey: getListPaymentsQueryKey() } });

  const totalPaid = data.filter(p => p.paymentStatus).reduce((sum, p) => sum + p.amount, 0);
  const totalPending = data.filter(p => !p.paymentStatus).reduce((sum, p) => sum + p.amount, 0);

  return (
    <BrandLayout>
      <div data-testid="page-payments">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data.length} transactions</p>
        </div>

        {!isLoading && data.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Total transactions", value: data.length, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", Icon: TrendingUp },
              { label: "Total paid", value: `$${totalPaid.toLocaleString()}`, gradient: "linear-gradient(135deg, #10B981, #059669)", Icon: CheckCircle },
              { label: "Pending", value: `$${totalPending.toLocaleString()}`, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", Icon: Clock },
            ].map(({ label, value, gradient, Icon }) => (
              <Card key={label} className="border-0 shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {isLoading ? <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
          !data.length ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                <CreditCard className="h-7 w-7" style={{ color: "#1DCFB3" }} />
              </div>
              <p className="text-sm font-medium">No payments yet</p>
              <p className="text-xs text-muted-foreground mt-1">Payments will appear here once campaigns are funded</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {data.map(p => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`payment-row-${p.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                            <DollarSign className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-semibold">{p.campaignName ?? "Campaign payment"}</div>
                            <div className="text-xs text-muted-foreground font-mono">{p.txRef}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-base">${p.amount.toLocaleString()}</td>
                      <td className="px-5 py-3.5 text-xs font-medium capitalize text-muted-foreground">{p.paymentType}</td>
                      <td className="px-5 py-3.5">
                        {p.paymentStatus ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Paid</span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }}><span className="w-1.5 h-1.5 rounded-full bg-amber-400" />Pending</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
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
