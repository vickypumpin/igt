import { useState } from "react";
import { useListRewards, useRequestPayout, useGetMe, getListRewardsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Gem, DollarSign, ArrowDownToLine } from "lucide-react";

export default function EarningsPage() {
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: rewards = [], isLoading } = useListRewards({ query: { queryKey: getListRewardsQueryKey() } });
  const payoutMutation = useRequestPayout();
  const [amount, setAmount] = useState("");

  const handlePayout = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    payoutMutation.mutate({ data: { amount: parseFloat(amount) } }, {
      onSuccess: () => { toast({ title: "Payout requested!" }); setAmount(""); queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }); },
      onError: () => { toast({ title: "Payout request failed", variant: "destructive" }); },
    });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-earnings">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Earnings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Your rewards and payouts</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card data-testid="stat-balance">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div>
              <div>
                <div className="text-2xl font-bold">${(Number(me?.balance) ?? 0).toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Available balance</div>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-gems">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg"><Gem className="h-5 w-5 text-yellow-600" /></div>
              <div>
                <div className="text-2xl font-bold">{me?.gems ?? 0}</div>
                <div className="text-xs text-muted-foreground">Gems earned</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">Request Payout</div>
            <div className="flex gap-2">
              <Input type="number" placeholder="Amount in USD" value={amount} onChange={e => setAmount(e.target.value)} className="max-w-xs" data-testid="input-payout-amount" />
              <Button onClick={handlePayout} disabled={payoutMutation.isPending || !amount} data-testid="button-request-payout">
                <ArrowDownToLine className="h-4 w-4 mr-1.5" />
                {payoutMutation.isPending ? "Requesting..." : "Request Payout"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div>
          <div className="text-sm font-medium mb-3">Reward History</div>
          {isLoading ? <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> :
            !rewards.length ? <div className="text-center py-10 text-muted-foreground text-sm">No rewards yet</div> : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Type</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Amount</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">From</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Date</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {rewards.map(r => (
                      <tr key={r.id} data-testid={`reward-row-${r.id}`}>
                        <td className="px-4 py-3 capitalize">{r.type}</td>
                        <td className="px-4 py-3 font-medium">{r.type === "gems" ? `${r.amount} gems` : `$${r.amount}`}</td>
                        <td className="px-4 py-3 text-muted-foreground">{r.fromUser ?? "Platform"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleDateString()}</td>
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
