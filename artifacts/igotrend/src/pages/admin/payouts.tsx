import { useState } from "react";
import { useAdminListPayouts, useAdminApprovePayout, getAdminListPayoutsQueryKey } from "@workspace/api-client-react";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Wallet, CreditCard, Percent } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const AVATAR_GRADIENTS = ["linear-gradient(135deg, #1DCFB3, #0FA88E)", "linear-gradient(135deg, #8B5CF6, #6D28D9)", "linear-gradient(135deg, #3B82F6, #2563EB)", "linear-gradient(135deg, #F59E0B, #D97706)", "linear-gradient(135deg, #EF4444, #DC2626)"];

type Tab = "payouts" | "subscriptions" | "commissions";

interface SubUser {
  id: number; firstName: string; lastName: string; email: string;
  role: string; companyName: string | null; billingMode: string | null;
  billingAmount: number; subscriptionStatus: string | null; createdAt: string;
  lastPaymentDate: string | null;
}

interface CommissionRow {
  id: number; campaignId: number | null; userId: number; agencyId: number | null;
  deductionPercent: number; deductionAmount: number; createdAt: string;
  firstName: string | null; lastName: string | null; email: string | null;
}

export default function AdminPayoutsPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("payouts");
  const { data = [], isLoading } = useAdminListPayouts({ query: { queryKey: getAdminListPayoutsQueryKey() } });
  const approveMutation = useAdminApprovePayout();

  const { data: subscriptions = [], isLoading: subsLoading } = useQuery<SubUser[]>({
    queryKey: ["/admin/payments/subscriptions"],
    queryFn: () => customFetch("/api/admin/payments/subscriptions"),
    enabled: tab === "subscriptions",
  });

  const { data: commissions = [], isLoading: commsLoading } = useQuery<CommissionRow[]>({
    queryKey: ["/admin/payments/commissions"],
    queryFn: () => customFetch("/api/admin/payments/commissions"),
    enabled: tab === "commissions",
  });

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListPayoutsQueryKey() }); toast({ title: "Payout approved ✓" }); } });
  };

  const pending = data.filter(p => p.status === "pending");
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "payouts",       label: "Payout Requests",  icon: <Wallet className="h-3.5 w-3.5" /> },
    { key: "subscriptions", label: "Subscriptions",    icon: <CreditCard className="h-3.5 w-3.5" /> },
    { key: "commissions",   label: "Commissions",      icon: <Percent className="h-3.5 w-3.5" /> },
  ];

  const statusStyle = (s: string | null) =>
    s === "active"    ? { bg: "rgba(16,185,129,0.12)", color: "#059669" }  :
    s === "past_due"  ? { bg: "rgba(245,158,11,0.12)", color: "#D97706" }  :
    s === "cancelled" ? { bg: "rgba(239,68,68,0.12)",  color: "#DC2626" }  :
                        { bg: "rgba(107,114,128,0.12)", color: "#4B5563" };

  return (
    <AdminLayout>
      <div data-testid="page-admin-payouts">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Payments</h1>
          <p className="text-sm text-muted-foreground">Payout requests, subscriptions and commission deductions</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-5 p-1 rounded-xl w-fit" style={{ background: "#f3f4f8" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all"
              style={tab === t.key ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "white" } : { color: "#6b7280" }}
              data-testid={`tab-${t.key}`}
            >
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── Payout Requests ── */}
        {tab === "payouts" && (
          <>
            {!isLoading && data.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total requests", value: data.length, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
                  { label: "Pending amount", value: `₦${totalPending.toLocaleString()}`, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
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
                <div className="text-center py-16 rounded-2xl border border-border/60 bg-white">
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
                          <td className="px-5 py-3.5 text-lg font-extrabold">₦{p.amount.toLocaleString()}</td>
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
          </>
        )}

        {/* ── Subscriptions ── */}
        {tab === "subscriptions" && (
          <>
            {subsLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
              !subscriptions.length ? (
                <div className="text-center py-16 rounded-2xl border border-border/60 bg-white">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                    <CreditCard className="h-7 w-7" style={{ color: "#FF8C42" }} />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No subscription accounts</p>
                  <p className="text-xs text-muted-foreground mt-1">Set billing mode to "subscription" on an account to see it here</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Account</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Monthly Fee</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Sub Status</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Last Payment</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Since</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {subscriptions.map(s => {
                        const st = statusStyle(s.subscriptionStatus);
                        const name = s.companyName ?? `${s.firstName} ${s.lastName}`;
                        return (
                          <tr key={s.id} className="hover:bg-muted/30" data-testid={`sub-row-${s.id}`}>
                            <td className="px-5 py-3.5">
                              <div className="font-semibold text-sm">{name}</div>
                              <div className="text-xs text-muted-foreground">{s.email}</div>
                            </td>
                            <td className="px-5 py-3.5 text-xs capitalize text-muted-foreground">{s.role}</td>
                            <td className="px-5 py-3.5 font-bold">₦{s.billingAmount.toLocaleString()}</td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>{s.subscriptionStatus ?? "active"}</span>
                            </td>
                            <td className="px-5 py-3.5 text-xs text-muted-foreground">
                              {s.lastPaymentDate ? new Date(s.lastPaymentDate).toLocaleDateString() : <span className="text-muted-foreground/50">—</span>}
                            </td>
                            <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )
            }
          </>
        )}

        {/* ── Commissions ── */}
        {tab === "commissions" && (
          <>
            {commsLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
              !commissions.length ? (
                <div className="text-center py-16 rounded-2xl border border-border/60 bg-white">
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                    <Percent className="h-7 w-7" style={{ color: "#FF8C42" }} />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">No commission deductions yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Commission is recorded when a payout is approved for a commission-billed account</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                      <tr>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Rate</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Deducted</th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {commissions.map(c => (
                        <tr key={c.id} className="hover:bg-muted/30" data-testid={`commission-row-${c.id}`}>
                          <td className="px-5 py-3.5">
                            <div className="font-semibold text-sm">{c.firstName} {c.lastName}</div>
                            <div className="text-xs text-muted-foreground">{c.email}</div>
                          </td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">#{c.campaignId ?? "—"}</td>
                          <td className="px-5 py-3.5 text-xs font-semibold">{c.deductionPercent}%</td>
                          <td className="px-5 py-3.5 font-bold text-sm">₦{c.deductionAmount.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            }
          </>
        )}
      </div>
    </AdminLayout>
  );
}
