import { useState } from "react";
import { useListCampaigns, useGetCampaignInvites, getListCampaignsQueryKey, getGetCampaignInvitesQueryKey, useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useRewardCreators, getBillingBalanceQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Gem, Send, CheckSquare, Square, AlertCircle } from "lucide-react";

const REWARD_TYPES = [
  { value: "completion", label: "Completion Bonus" },
  { value: "performance", label: "Performance Bonus" },
  { value: "gems", label: "Gem Gift" },
];

export default function BrandRewardsPage() {
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: campaigns = [], isLoading: loadingCampaigns } = useListCampaigns(
    {},
    { query: { queryKey: getListCampaignsQueryKey({}) } }
  );

  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(null);
  const [selectedCreators, setSelectedCreators] = useState<Set<number>>(new Set());
  const [gemsPerCreator, setGemsPerCreator] = useState("100");
  const [rewardType, setRewardType] = useState("completion");

  const { data: invites = [], isLoading: loadingInvites } = useGetCampaignInvites(
    selectedCampaignId ?? 0,
    { query: { enabled: !!selectedCampaignId, queryKey: getGetCampaignInvitesQueryKey(selectedCampaignId ?? 0) } }
  );

  const rewardMutation = useRewardCreators();
  const gems = me?.gems ?? 0;
  const gemsNum = parseInt(gemsPerCreator, 10) || 0;
  const totalCost = gemsNum * selectedCreators.size;
  const canAfford = gems >= totalCost;

  // Only show accepted/active/completed creators
  const eligibleInvites = invites.filter(inv => ["active", "completed", "accepted"].includes(inv.status));

  const toggleCreator = (id: number) => {
    setSelectedCreators(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedCreators.size === eligibleInvites.length) {
      setSelectedCreators(new Set());
    } else {
      setSelectedCreators(new Set(eligibleInvites.map(inv => inv.creatorId)));
    }
  };

  const handleSend = () => {
    if (!selectedCampaignId) { toast({ title: "Select a campaign first", variant: "destructive" }); return; }
    if (!selectedCreators.size) { toast({ title: "Select at least one creator", variant: "destructive" }); return; }
    if (!gemsNum || gemsNum <= 0) { toast({ title: "Enter a valid gem amount", variant: "destructive" }); return; }
    if (!canAfford) { toast({ title: "Insufficient gems", description: "Top up your balance from Billing.", variant: "destructive" }); return; }

    rewardMutation.mutate(
      { creatorIds: Array.from(selectedCreators), amount: gemsNum, rewardType, campaignId: selectedCampaignId },
      {
        onSuccess: (data) => {
          if (data.paymentUrl && data.paymentUrl.startsWith("https://checkout.flutterwave")) {
            window.open(data.paymentUrl, "_blank");
            toast({ title: "Complete payment to confirm gems", description: "A Flutterwave checkout has been opened." });
          } else {
            toast({ title: `✓ ${(gemsNum * selectedCreators.size).toLocaleString()} gems sent to ${selectedCreators.size} creator(s)!` });
          }
          queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
          queryClient.invalidateQueries({ queryKey: getBillingBalanceQueryKey() });
          setSelectedCreators(new Set());
        },
        onError: () => toast({ title: "Failed to send rewards", variant: "destructive" }),
      }
    );
  };

  return (
    <BrandLayout>
      <div data-testid="page-brand-rewards" className="max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Reward Creators</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Send gems to creators who completed your campaigns</p>
          </div>
          {/* Gem balance chip */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
            <Gem className="h-4 w-4" />
            {gems.toLocaleString()} gems
          </div>
        </div>

        <div className="space-y-5">
          {/* Step 1 — pick campaign */}
          <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Step 1 · Select Campaign</div>
            {loadingCampaigns ? (
              <Skeleton className="h-10 rounded-xl" />
            ) : (
              <select
                value={selectedCampaignId ?? ""}
                onChange={e => { setSelectedCampaignId(Number(e.target.value) || null); setSelectedCreators(new Set()); }}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                data-testid="select-campaign"
              >
                <option value="">Choose a campaign…</option>
                {campaigns.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                ))}
              </select>
            )}
          </div>

          {/* Step 2 — pick creators */}
          {selectedCampaignId && (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Step 2 · Select Creators</div>
                {eligibleInvites.length > 0 && (
                  <button onClick={toggleAll} className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#1DCFB3" }}>
                    {selectedCreators.size === eligibleInvites.length ? <CheckSquare className="h-3.5 w-3.5" /> : <Square className="h-3.5 w-3.5" />}
                    {selectedCreators.size === eligibleInvites.length ? "Deselect all" : "Select all"}
                  </button>
                )}
              </div>

              {loadingInvites ? (
                <div className="p-5 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
              ) : !eligibleInvites.length ? (
                <div className="py-12 text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">No active or completed creators in this campaign yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Creators need to accept their invite before you can reward them</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {eligibleInvites.map(inv => {
                    const selected = selectedCreators.has(inv.creatorId);
                    return (
                      <button
                        key={inv.id}
                        onClick={() => toggleCreator(inv.creatorId)}
                        className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-muted/30"
                        style={selected ? { background: "rgba(29,207,179,0.06)" } : {}}
                        data-testid={`creator-row-${inv.creatorId}`}
                      >
                        <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors" style={selected ? { background: "#1DCFB3", borderColor: "#1DCFB3" } : { borderColor: "rgba(0,0,0,0.2)" }}>
                          {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className="text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                            {inv.creator?.firstName?.[0]}{inv.creator?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm">{inv.creator?.firstName} {inv.creator?.lastName}</div>
                          <div className="text-xs text-muted-foreground">@{inv.creator?.userName}</div>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0"
                          style={{ background: "rgba(29,207,179,0.1)", color: "#0FA88E" }}>
                          {inv.status}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3 — configure reward */}
          {selectedCampaignId && eligibleInvites.length > 0 && (
            <div className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Step 3 · Configure Reward</div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Gems per creator</label>
                  <div className="relative">
                    <Gem className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      value={gemsPerCreator}
                      onChange={e => setGemsPerCreator(e.target.value)}
                      className="h-10 rounded-xl pl-8"
                      data-testid="input-gems-amount"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Reward type</label>
                  <select
                    value={rewardType}
                    onChange={e => setRewardType(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    data-testid="select-reward-type"
                  >
                    {REWARD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Cost summary */}
              <div className="rounded-xl p-4 mb-4" style={{ background: canAfford ? "rgba(29,207,179,0.06)" : "rgba(239,68,68,0.06)", border: `1px solid ${canAfford ? "rgba(29,207,179,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Creators selected</span>
                  <span className="font-semibold">{selectedCreators.size}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Gems per creator</span>
                  <span className="font-semibold">{gemsNum.toLocaleString()}</span>
                </div>
                <div className="h-px bg-border/60 my-2" />
                <div className="flex justify-between text-sm font-bold">
                  <span>Total cost</span>
                  <span style={{ color: canAfford ? "#059669" : "#DC2626" }}>{totalCost.toLocaleString()} gems</span>
                </div>
                {!canAfford && totalCost > 0 && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs font-medium" style={{ color: "#DC2626" }}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    You need {(totalCost - gems).toLocaleString()} more gems. <a href="/billing" className="underline font-bold">Top up →</a>
                  </div>
                )}
              </div>

              <Button
                onClick={handleSend}
                disabled={rewardMutation.isPending || !selectedCreators.size || !canAfford || !gemsNum}
                className="w-full h-11 rounded-xl font-bold gap-2"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                data-testid="btn-send-gems"
              >
                <Send className="h-4 w-4" />
                {rewardMutation.isPending ? "Sending…" : `Send ${totalCost.toLocaleString()} Gems to ${selectedCreators.size} Creator${selectedCreators.size !== 1 ? "s" : ""}`}
              </Button>
            </div>
          )}
        </div>
      </div>
    </BrandLayout>
  );
}
