import { useState } from "react";
import { useListRewards, useRequestPayout, useGetMe, getListRewardsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Gem, DollarSign, ArrowDownToLine, TrendingUp } from "lucide-react";

export default function EarningsPage() {
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: rewards = [], isLoading } = useListRewards({ query: { queryKey: getListRewardsQueryKey() } });
  const payoutMutation = useRequestPayout();
  const [amount, setAmount] = useState("");

  const handlePayout = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    payoutMutation.mutate({ data: { amount: parseFloat(amount) } }, {
      onSuccess: () => { toast({ title: "Payout requested! 💰" }); setAmount(""); queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }); },
      onError: () => { toast({ title: "Payout request failed", variant: "destructive" }); },
    });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-earnings">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Earnings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your rewards and payouts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Available balance", value: `$${(Number(me?.balance) ?? 0).toLocaleString()}`, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", Icon: DollarSign, testid: "stat-balance" },
            { label: "Gems earned", value: me?.gems ?? 0, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", Icon: Gem, testid: "stat-gems" },
            { label: "Reward records", value: rewards.length, gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", Icon: TrendingUp, testid: "stat-rewards" },
          ].map(({ label, value, gradient, Icon, testid }) => (
            <Card key={label} className="border-0 shadow-sm" data-testid={testid}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payout request */}
        <Card className="mb-6 border-0 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-sm font-bold">Request Payout</div>
            <div className="text-xs text-muted-foreground mt-0.5">Minimum payout is $10</div>
          </div>
          <CardContent className="p-5">
            <div className="flex gap-3 items-end">
              <div className="flex-1 max-w-xs">
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Amount (USD)</label>
                <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} className="h-10 rounded-xl" data-testid="input-payout-amount" />
              </div>
              <Button
                onClick={handlePayout}
                disabled={payoutMutation.isPending || !amount || parseFloat(amount) < 10}
                className="h-10 px-5 rounded-xl font-semibold gap-2"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                data-testid="button-request-payout"
              >
                <ArrowDownToLine className="h-4 w-4" />
                {payoutMutation.isPending ? "Requesting…" : "Request Payout"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History */}
        <div>
          <div className="text-sm font-bold mb-4">Reward History</div>
          {isLoading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
            !rewards.length ? (
              <div className="text-center py-12 text-muted-foreground text-sm rounded-2xl border border-border/60">
                <Gem className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No rewards yet — complete campaigns to earn!
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">From</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {rewards.map(r => (
                      <tr key={r.id} className="hover:bg-muted/30 transition-colors" data-testid={`reward-row-${r.id}`}>
                        <td className="px-5 py-3.5">
                          <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full" style={{ background: r.type === "gems" ? "rgba(249,115,22,0.12)" : "rgba(16,185,129,0.12)", color: r.type === "gems" ? "#EA580C" : "#059669" }}>{r.type}</span>
                        </td>
                        <td className="px-5 py-3.5 font-bold">{r.type === "gems" ? <span style={{ color: "#EA580C" }}>{r.amount} 💎</span> : <span style={{ color: "#059669" }}>${r.amount}</span>}</td>
                        <td className="px-5 py-3.5 text-muted-foreground text-sm">{r.fromUser ?? "Platform"}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }
        </div>
      </div>
    </CreatorLayout>
  );
}
