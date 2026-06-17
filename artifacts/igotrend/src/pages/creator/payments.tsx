import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getGetMeQueryKey, useGetMe, customFetch } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowDownToLine, CheckCircle, Clock, XCircle, DollarSign } from "lucide-react";

type Payout = { id: number; amount: string; status: string; bankCode: string | null; accountNumber: string | null; createdAt: string };
type EligibleCampaign = { campaignId: number; campaignName: string; sponsor: string | null };

const STATUS_STYLE: Record<string, { bg: string; color: string; Icon: React.ElementType; label: string }> = {
  pending:  { bg: "rgba(245,158,11,0.12)",  color: "#D97706", Icon: Clock,        label: "Pending"  },
  approved: { bg: "rgba(16,185,129,0.12)",  color: "#059669", Icon: CheckCircle,  label: "Approved" },
  rejected: { bg: "rgba(239,68,68,0.12)",   color: "#DC2626", Icon: XCircle,      label: "Rejected" },
};

const PAYOUTS_QUERY_KEY = ["creator-payouts"];

export default function CreatorPaymentsPage() {
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: payouts = [], isLoading } = useQuery<Payout[]>({
    queryKey: PAYOUTS_QUERY_KEY,
    queryFn: () => customFetch<Payout[]>("/api/payouts"),
  });
  const { data: eligibleCampaigns = [] } = useQuery<EligibleCampaign[]>({
    queryKey: ["/creator/eligible-campaigns"],
    queryFn: () => customFetch("/api/creator/eligible-campaigns"),
  });
  const [amount, setAmount] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>("");

  const totalPaid = payouts.filter(p => p.status === "approved").reduce((sum, p) => sum + parseFloat(String(p.amount)), 0);
  const totalPending = payouts.filter(p => p.status === "pending").reduce((sum, p) => sum + parseFloat(String(p.amount)), 0);
  const balance = Number(me?.balance ?? 0);

  const payoutMutation = useMutation({
    mutationFn: (data: { amount: number; campaignId: number }) =>
      customFetch("/api/rewards/payout", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Payout requested! An admin will process it within 1–2 business days." });
      setAmount("");
      setSelectedCampaignId("");
      queryClient.invalidateQueries({ queryKey: PAYOUTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { error?: string } })?.data?.error ?? "Payout request failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const handleRequest = () => {
    const amtNum = parseFloat(amount);
    if (!amtNum || amtNum < 10) { toast({ title: "Minimum payout is $10", variant: "destructive" }); return; }
    if (amtNum > balance) { toast({ title: "Exceeds your balance", variant: "destructive" }); return; }
    if (!selectedCampaignId) { toast({ title: "Please select a campaign for this payout", variant: "destructive" }); return; }
    payoutMutation.mutate({ amount: amtNum, campaignId: Number(selectedCampaignId) });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-creator-payments" className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Request payouts and track your payout history</p>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Available balance", value: `$${balance.toLocaleString("en", { minimumFractionDigits: 2 })}`, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", testid: "stat-balance" },
            { label: "Total approved", value: `$${totalPaid.toLocaleString("en", { minimumFractionDigits: 2 })}`, gradient: "linear-gradient(135deg, #10B981, #059669)", testid: "stat-approved" },
            { label: "Pending payouts", value: `$${totalPending.toLocaleString("en", { minimumFractionDigits: 2 })}`, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", testid: "stat-pending" },
          ].map(({ label, value, gradient, testid }) => (
            <div key={label} className="bg-white rounded-2xl border border-border/60 p-4 flex items-center gap-3 shadow-sm" data-testid={testid}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Request payout */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-sm font-bold">Request Payout</div>
            <div className="text-xs text-muted-foreground mt-0.5">Minimum $10 · Processed within 1–2 business days</div>
          </div>
          <div className="p-5 space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Campaign *</label>
              <select
                value={selectedCampaignId}
                onChange={e => setSelectedCampaignId(e.target.value)}
                className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                data-testid="select-payout-campaign"
              >
                <option value="">Select a campaign with approved submission…</option>
                {eligibleCampaigns.map(c => (
                  <option key={c.campaignId} value={c.campaignId}>
                    {c.campaignName}{c.sponsor ? ` — ${c.sponsor}` : ""}
                  </option>
                ))}
              </select>
              {eligibleCampaigns.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">No campaigns with approved submissions yet.</p>
              )}
            </div>
            <div className="flex gap-3 items-end">
              <div className="flex-1 max-w-xs">
                <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Amount (USD)</label>
                <Input type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)}
                  className="h-10 rounded-xl" data-testid="input-payout-amount" min="10" step="1" />
              </div>
              <Button
                onClick={handleRequest}
                disabled={payoutMutation.isPending || !amount || parseFloat(amount) < 10 || !selectedCampaignId}
                className="h-10 px-5 rounded-xl font-semibold gap-2"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                data-testid="btn-request-payout"
              >
                <ArrowDownToLine className="h-4 w-4" />
                {payoutMutation.isPending ? "Requesting…" : "Request Payout"}
              </Button>
            </div>
          </div>
        </div>

        {/* Payout history */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-sm font-bold">Payout History</div>
          </div>
          {isLoading ? (
            <div className="p-5 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : !payouts.length ? (
            <div className="py-14 text-center">
              <ArrowDownToLine className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No payouts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your payout requests will appear here</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Account</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payouts.map(p => {
                  const s = STATUS_STYLE[p.status] ?? STATUS_STYLE.pending;
                  const { Icon } = s;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors" data-testid={`payout-row-${p.id}`}>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5 font-bold">${parseFloat(String(p.amount)).toLocaleString("en", { minimumFractionDigits: 2 })}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground font-mono">{p.accountNumber ? `****${String(p.accountNumber).slice(-4)}` : "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                          <Icon className="h-3.5 w-3.5" />{s.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
}
