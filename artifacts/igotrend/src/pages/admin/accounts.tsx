import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, ShieldBan, ShieldCheck, Trash2, Pencil, Gem, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface User {
  id: number; firstName: string; lastName: string; userName: string; email: string;
  phone: string | null; role: "brand" | "creator" | "admin" | "agency"; badge: string | null;
  isActive: boolean; isLocked: boolean; gems: number; reservedBalance: number; avatarUrl: string | null;
  companyName: string | null; createdAt: string;
  agencyId: number | null;
  billingMode: string | null;
  commissionRate: number | null;
  billingAmount: number | null;
  subscriptionStatus: string | null;
}

interface BillingInfo {
  id: number; billingMode: string | null; billingAmount: number | null;
  commissionRate: number | null; subscriptionStatus: string | null;
  billingNotes: string | null;
}

interface AccountsResponse { data: User[]; total: number; page: number; limit: number; }

const ROLE_BADGE = {
  brand:   { bg: "rgba(29,207,179,0.12)",   color: "#0FA88E" },
  creator: { bg: "rgba(107,47,206,0.12)",   color: "#6B2FCE" },
  admin:   { bg: "rgba(255,140,66,0.12)",   color: "#FF8C42" },
  agency:  { bg: "rgba(59,130,246,0.12)",   color: "#2563EB" },
};

type Tab = "all" | "brands" | "creators" | "agencies" | "pending";

const TAB_ROLE: Record<Tab, string | undefined> = { all: undefined, brands: "brand", creators: "creator", agencies: "agency", pending: undefined };
const TAB_STATUS: Record<Tab, string | undefined> = { all: undefined, brands: undefined, creators: undefined, agencies: undefined, pending: "pending" };

export default function AdminAccountsPage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [billingUser, setBillingUser] = useState<User | null>(null);
  const [billingForm, setBillingForm] = useState({ billingMode: "commission", commissionRate: "5.00", billingAmount: "0", subscriptionStatus: "active", billingNotes: "" });
  const [emailUser, setEmailUser] = useState<User | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const qc = useQueryClient();

  const activeTab: Tab = location.endsWith("/brands") ? "brands"
    : location.endsWith("/creators") ? "creators"
    : location.endsWith("/agencies") ? "agencies"
    : location.endsWith("/pending") ? "pending"
    : "all";

  const role = TAB_ROLE[activeTab];
  const status = TAB_STATUS[activeTab];

  const queryKey = ["/admin/accounts", role, status, search, page];
  const { data, isLoading, refetch } = useQuery<AccountsResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      return customFetch<AccountsResponse>(`/api/admin/accounts?${params}`);
    },
  });

  const billingMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: typeof billingForm }) =>
      customFetch(`/api/admin/accounts/${id}/billing`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => { toast({ title: "Billing updated" }); setBillingUser(null); refetch(); },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const emailMutation = useMutation({
    mutationFn: ({ id, email }: { id: number; email: string }) =>
      customFetch(`/api/admin/accounts/${id}/email`, { method: "PATCH", body: JSON.stringify({ email }) }),
    onSuccess: () => { toast({ title: "Email updated" }); setEmailUser(null); refetch(); },
    onError: (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Update failed";
      toast({ title: msg.includes("409") || msg.toLowerCase().includes("use") ? "Email already in use" : "Update failed", variant: "destructive" });
    },
  });

  const handleAction = async (id: number, action: string) => {
    await customFetch(`/api/admin/accounts/${id}/status`, { method: "PATCH", body: JSON.stringify({ action }) });
    toast({ title: `User ${action}d` });
    refetch();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user ${name}? This cannot be undone.`)) return;
    await customFetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
    toast({ title: "User deleted" });
    refetch();
  };

  const openBilling = async (u: User) => {
    setBillingUser(u);
    try {
      const info = await customFetch<BillingInfo>(`/api/admin/accounts/${u.id}/billing`);
      setBillingForm({
        billingMode: info.billingMode ?? "commission",
        commissionRate: String(info.commissionRate ?? "5.00"),
        billingAmount: String(info.billingAmount ?? "0"),
        subscriptionStatus: info.subscriptionStatus ?? "active",
        billingNotes: info.billingNotes ?? "",
      });
    } catch {
      setBillingForm({ billingMode: "commission", commissionRate: "5.00", billingAmount: "0", subscriptionStatus: "active", billingNotes: "" });
    }
  };

  const TABS: { key: Tab; label: string; href: string }[] = [
    { key: "all",      label: "All Accounts",  href: "/admin/accounts" },
    { key: "brands",   label: "Brands",         href: "/admin/accounts/brands" },
    { key: "creators", label: "Creators",        href: "/admin/accounts/creators" },
    { key: "agencies", label: "Agencies",        href: "/admin/accounts/agencies" },
    { key: "pending",  label: "Pending",         href: "/admin/accounts/pending" },
  ];

  const users = data?.data ?? [];

  return (
    <AdminLayout>
      <div data-testid="page-admin-accounts">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Account Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View, manage and moderate all user accounts</p>
        </div>

        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <a key={t.key} href={t.href}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={activeTab === t.key ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
                data-testid={`tab-${t.key}`}
              >{t.label}</a>
            ))}
          </div>
          <div className="ml-auto relative w-56">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email…" className="pl-8 h-9 rounded-xl text-xs" />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-sm font-bold">Accounts</div>
            {data && <span className="ml-auto text-xs text-muted-foreground">{data.total} total</span>}
          </div>

          {isLoading ? (
            <div className="p-5 space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : !users.length ? (
            <div className="text-center py-16">
              <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No accounts found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Gems / Reserved</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Billing Mode</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map(u => {
                    const roleStyle = ROLE_BADGE[u.role] ?? ROLE_BADGE.brand;
                    const displayName = (u.role === "brand" || u.role === "agency") && u.companyName ? u.companyName : `${u.firstName} ${u.lastName}`;
                    return (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors" data-testid={`account-row-${u.id}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 text-sm font-bold"
                              style={{ background: "linear-gradient(135deg, #141C35, #2D3A6E)" }}>
                              {(u.firstName[0] ?? "?").toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{displayName}</div>
                              <div className="text-xs text-muted-foreground">{u.email} · Joined {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: roleStyle.bg, color: roleStyle.color }}>{u.role}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          {u.role === "brand" ? (
                            <div className="space-y-0.5" data-testid={`gems-balance-${u.id}`}>
                              <div className="flex items-center gap-1 text-xs">
                                <Gem className="h-3 w-3 text-amber-500" />
                                <span className="font-semibold">{(u.gems ?? 0).toLocaleString()}</span>
                                <span className="text-muted-foreground">available</span>
                              </div>
                              {(u.reservedBalance ?? 0) > 0 && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <span className="w-3 h-3" />
                                  <span className="font-medium" style={{ color: "#6B2FCE" }}>{(u.reservedBalance ?? 0).toLocaleString()}</span>
                                  <span>reserved</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <button onClick={() => openBilling(u)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group" title="Edit billing">
                            {u.billingMode ? (
                              <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full"
                                style={u.billingMode === "commission"
                                  ? { background: "rgba(107,47,206,0.1)", color: "#6B2FCE" }
                                  : { background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
                                {u.billingMode === "commission" ? `${u.commissionRate ?? 0}% comm.` : "subscription"}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground/60">—</span>
                            )}
                            <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {u.isLocked && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#DC2626" }}>Locked</span>}
                            {!u.isActive && !u.isLocked && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }}>Inactive</span>}
                            {u.isActive && !u.isLocked && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>Active</span>}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {u.isActive && !u.isLocked ? (
                              <Button size="sm" variant="outline" onClick={() => handleAction(u.id, "suspend")} className="h-7 px-2 rounded-lg text-xs gap-1 text-amber-600 border-amber-200 hover:bg-amber-50">
                                <ShieldBan className="h-3 w-3" />Suspend
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleAction(u.id, "activate")} className="h-7 px-2 rounded-lg text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50">
                                <ShieldCheck className="h-3 w-3" />Activate
                              </Button>
                            )}
                            <button onClick={() => { setEmailUser(u); setEmailInput(u.email); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-500 hover:bg-blue-50 transition-colors" title="Edit email">
                              <Mail className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(u.id, displayName)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {data && data.total > 20 && (
            <div className="px-5 py-4 border-t border-border/60 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl h-8 text-xs">Previous</Button>
              <span className="text-xs text-muted-foreground">Page {page} of {Math.ceil(data.total / 20)}</span>
              <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 20)} className="rounded-xl h-8 text-xs">Next</Button>
            </div>
          )}
        </div>

        {/* ── Billing Edit Modal ── */}
        <Dialog open={!!billingUser} onOpenChange={open => { if (!open) setBillingUser(null); }}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Edit Billing — {billingUser?.firstName} {billingUser?.lastName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold block mb-1.5">Billing Mode</label>
                <div className="flex gap-2">
                  {["commission", "subscription"].map(m => (
                    <button key={m} onClick={() => setBillingForm(f => ({ ...f, billingMode: m }))}
                      className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize"
                      style={billingForm.billingMode === m ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "white", border: "none" } : { borderColor: "rgba(0,0,0,0.12)" }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {billingForm.billingMode === "commission" && (
                <div>
                  <label className="text-xs font-semibold block mb-1.5">Commission Rate (%)</label>
                  <Input type="number" step="0.01" min="0" max="100"
                    value={billingForm.commissionRate}
                    onChange={e => setBillingForm(f => ({ ...f, commissionRate: e.target.value }))}
                    className="h-10 rounded-xl" data-testid="input-commission-rate" />
                </div>
              )}
              {billingForm.billingMode === "subscription" && (
                <>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5">Monthly Amount (NGN)</label>
                    <Input type="number" step="1" min="0"
                      value={billingForm.billingAmount}
                      onChange={e => setBillingForm(f => ({ ...f, billingAmount: e.target.value }))}
                      className="h-10 rounded-xl" data-testid="input-billing-amount" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1.5">Subscription Status</label>
                    <select value={billingForm.subscriptionStatus}
                      onChange={e => setBillingForm(f => ({ ...f, subscriptionStatus: e.target.value }))}
                      className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm shadow-sm">
                      <option value="active">Active</option>
                      <option value="past_due">Past Due</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="text-xs font-semibold block mb-1.5">Internal Notes</label>
                <textarea
                  rows={3}
                  value={billingForm.billingNotes}
                  onChange={e => setBillingForm(f => ({ ...f, billingNotes: e.target.value }))}
                  placeholder="Optional notes visible only to admins…"
                  className="flex w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm resize-none"
                  data-testid="input-billing-notes"
                />
              </div>
              <Button
                className="w-full h-10 rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none", color: "white" }}
                onClick={() => billingUser && billingMutation.mutate({ id: billingUser.id, data: billingForm })}
                disabled={billingMutation.isPending}
                data-testid="button-save-billing"
              >
                {billingMutation.isPending ? "Saving…" : "Save Billing Settings"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ── Email Edit Modal ── */}
        <Dialog open={!!emailUser} onOpenChange={open => { if (!open) setEmailUser(null); }}>
          <DialogContent className="max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Change Email — {emailUser?.firstName} {emailUser?.lastName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold block mb-1.5">New email address</label>
                <Input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="user@example.com"
                  className="h-10 rounded-xl"
                  data-testid="input-edit-email"
                />
              </div>
              <Button
                className="w-full h-10 rounded-xl font-semibold"
                style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none", color: "white" }}
                onClick={() => emailUser && emailMutation.mutate({ id: emailUser.id, email: emailInput })}
                disabled={emailMutation.isPending || !emailInput.includes("@")}
                data-testid="button-save-email"
              >
                {emailMutation.isPending ? "Saving…" : "Update Email"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
