import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Trash2, Clock, CheckCircle, Mail, Megaphone, DollarSign, PlusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Client {
  id: number; agencyId: number; brandUserId: number; inviteStatus: string;
  invitedAt: string; joinedAt: string | null;
  firstName: string | null; lastName: string | null;
  email: string | null; companyName: string | null; isActive: boolean | null;
  billingMode: string | null; commissionRate: number | null;
  activeCampaigns: number; totalCampaigns: number; totalSpend: number;
}

const PURPLE = "#6B2FCE";

export default function AgencyClientsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ firstName: "", lastName: "", email: "", password: "", companyName: "" });
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/agency/clients"],
    queryFn: () => customFetch("/api/agency/clients"),
  });

  const inviteMutation = useMutation({
    mutationFn: (email: string) => customFetch("/api/agency/clients/invite", { method: "POST", body: JSON.stringify({ email }) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/agency/clients"] });
      toast({ title: "Invite sent" });
      setInviteOpen(false);
      setInviteEmail("");
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { error?: string } })?.data?.error ?? "Failed to invite";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => customFetch(`/api/agency/clients/${id}`, { method: "DELETE" }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["/agency/clients"] }); toast({ title: "Client removed" }); },
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof createForm) =>
      customFetch("/api/agency/clients/create", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/agency/clients"] });
      toast({ title: "Brand sub-account created and added to your agency" });
      setCreateOpen(false);
      setCreateForm({ firstName: "", lastName: "", email: "", password: "", companyName: "" });
    },
    onError: (err: unknown) => {
      const msg = (err as { data?: { error?: string } })?.data?.error ?? "Failed to create sub-account";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const statusStyle = (s: string) =>
    s === "accepted" ? { bg: "rgba(16,185,129,0.12)", color: "#059669" } :
    s === "pending"  ? { bg: "rgba(245,158,11,0.12)", color: "#D97706" } :
                       { bg: "rgba(239,68,68,0.12)",  color: "#DC2626" };

  return (
    <AgencyLayout>
      <div data-testid="page-agency-clients">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Clients</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{clients.length} total · {clients.filter(c => c.inviteStatus === "accepted").length} active</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setCreateOpen(true)} variant="outline" className="rounded-xl h-9 gap-1.5 text-sm font-semibold border" data-testid="button-create-client">
              <PlusCircle className="h-4 w-4" />Create Sub-account
            </Button>
            <Button onClick={() => setInviteOpen(true)} className="rounded-xl h-9 gap-1.5 text-sm font-semibold" style={{ background: PURPLE, border: "none", color: "white" }} data-testid="button-invite-client">
              <UserPlus className="h-4 w-4" />Invite Existing
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !clients.length ? (
          <div className="text-center py-20 rounded-2xl border border-border/60 bg-white">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(107,47,206,0.1)" }}>
              <Users className="h-7 w-7" style={{ color: PURPLE }} />
            </div>
            <p className="text-sm font-semibold mb-1">No clients yet</p>
            <p className="text-xs text-muted-foreground mb-4">Invite brand accounts to join your agency</p>
            <Button onClick={() => setInviteOpen(true)} className="rounded-xl text-sm font-semibold gap-1.5" style={{ background: PURPLE, border: "none", color: "white" }}>
              <UserPlus className="h-4 w-4" />Invite your first client
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm min-w-[750px]">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaigns</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Total Spend</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Billing</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Invited</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {clients.map(c => {
                  const st = statusStyle(c.inviteStatus);
                  const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
                  const name = c.companyName ?? (fullName || "—");
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`client-row-${c.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: PURPLE }}>
                            {(name[0] ?? "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold">{name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />{c.email ?? "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>
                          {c.inviteStatus === "accepted" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {c.inviteStatus}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Megaphone className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{c.activeCampaigns}</span>
                          <span className="text-muted-foreground">active / {c.totalCampaigns} total</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">₦{c.totalSpend.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        {c.billingMode ? (
                          <span className="px-2 py-0.5 rounded-full font-semibold capitalize"
                            style={c.billingMode === "commission"
                              ? { background: "rgba(107,47,206,0.1)", color: PURPLE }
                              : { background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
                            {c.billingMode === "commission" ? `${c.commissionRate ?? 0}% comm.` : "subscription"}
                          </span>
                        ) : <span className="text-muted-foreground/60">—</span>}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.invitedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => removeMutation.mutate(c.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Remove">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Invite an Existing Brand</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Enter the email of an existing iGoTrend brand account to invite them to your agency.</p>
            <div className="space-y-3 mt-2">
              <Input placeholder="brand@company.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} className="h-10 rounded-xl" data-testid="input-invite-email" />
              <Button onClick={() => inviteMutation.mutate(inviteEmail)} disabled={!inviteEmail || inviteMutation.isPending} className="w-full h-10 rounded-xl font-semibold" style={{ background: PURPLE, border: "none", color: "white" }} data-testid="button-send-invite">
                {inviteMutation.isPending ? "Sending…" : "Send Invite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Create Brand Sub-account</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Create a new brand account directly under your agency. The brand will be immediately linked.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="First name" value={createForm.firstName} onChange={e => setCreateForm(f => ({ ...f, firstName: e.target.value }))} className="h-10 rounded-xl" data-testid="input-create-first-name" />
                <Input placeholder="Last name" value={createForm.lastName} onChange={e => setCreateForm(f => ({ ...f, lastName: e.target.value }))} className="h-10 rounded-xl" data-testid="input-create-last-name" />
              </div>
              <Input placeholder="Company / brand name (optional)" value={createForm.companyName} onChange={e => setCreateForm(f => ({ ...f, companyName: e.target.value }))} className="h-10 rounded-xl" data-testid="input-create-company" />
              <Input placeholder="Email address" type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="h-10 rounded-xl" data-testid="input-create-email" />
              <Input placeholder="Temporary password" type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="h-10 rounded-xl" data-testid="input-create-password" />
              <Button
                onClick={() => createMutation.mutate(createForm)}
                disabled={!createForm.firstName || !createForm.lastName || !createForm.email || !createForm.password || createMutation.isPending}
                className="w-full h-10 rounded-xl font-semibold"
                style={{ background: PURPLE, border: "none", color: "white" }}
                data-testid="button-create-submit"
              >
                {createMutation.isPending ? "Creating…" : "Create Sub-account"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AgencyLayout>
  );
}
