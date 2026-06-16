import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, UserPlus, Trash2, Clock, CheckCircle, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Client {
  id: number; agencyId: number; brandUserId: number; inviteStatus: string;
  invitedAt: string; joinedAt: string | null;
  firstName: string | null; lastName: string | null;
  email: string | null; companyName: string | null; isActive: boolean | null;
}

const PURPLE = "#6B2FCE";

export default function AgencyClientsPage() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
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
          <Button onClick={() => setInviteOpen(true)} className="rounded-xl h-9 gap-1.5 text-sm font-semibold" style={{ background: PURPLE, border: "none", color: "white" }} data-testid="button-invite-client">
            <UserPlus className="h-4 w-4" />Invite Client
          </Button>
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
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Invited</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {clients.map(c => {
                  const st = statusStyle(c.inviteStatus);
                  const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim(); const name = c.companyName ?? (fullName || "—");
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-colors" data-testid={`client-row-${c.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: PURPLE }}>
                            {(name[0] ?? "?").toUpperCase()}
                          </div>
                          <div className="font-semibold">{name}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3" />{c.email ?? "—"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>
                          {c.inviteStatus === "accepted" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {c.inviteStatus}
                        </span>
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
              <DialogTitle>Invite a Brand Client</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Enter the email address of an existing iGoTrend brand account to invite them to your agency.</p>
            <div className="space-y-3 mt-2">
              <Input
                placeholder="brand@company.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="h-10 rounded-xl"
                data-testid="input-invite-email"
              />
              <Button
                onClick={() => inviteMutation.mutate(inviteEmail)}
                disabled={!inviteEmail || inviteMutation.isPending}
                className="w-full h-10 rounded-xl font-semibold"
                style={{ background: PURPLE, border: "none", color: "white" }}
                data-testid="button-send-invite"
              >
                {inviteMutation.isPending ? "Sending…" : "Send Invite"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AgencyLayout>
  );
}
