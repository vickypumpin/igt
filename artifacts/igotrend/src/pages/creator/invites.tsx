import { useState } from "react";
import { Link } from "wouter";
import { useListMyInvites, useAcceptInvite, useDeclineInvite, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, Inbox, Calendar, Users, Megaphone, Clock } from "lucide-react";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5", dot: "#6366F1" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />{status}</span>;
}

const FILTERS = ["all", "pending", "active", "completed", "declined"];

export default function InvitesPage() {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const params = filter !== "all" ? { status: filter as "pending" | "active" | "completed" | "declined" } : {};
  const { data = [], isLoading } = useListMyInvites(params, { query: { queryKey: getListMyInvitesQueryKey(params) } });
  const acceptMutation = useAcceptInvite();
  const declineMutation = useDeclineInvite();

  const handleAccept = (id: number) => {
    acceptMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invitation accepted! 🎉" }); } });
  };
  const handleDecline = (id: number) => {
    declineMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invitation declined" }); } });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-invites">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold">Campaign Invitations</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data.length} invitations</p>
          </div>
        </div>

        <div className="flex gap-1 mb-5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(29,207,179,0.15)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
              data-testid={`filter-${f}`}
            >{f}</button>
          ))}
        </div>

        {isLoading ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div> :
          !data.length ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                <Inbox className="h-7 w-7" style={{ color: "#1DCFB3" }} />
              </div>
              <p className="text-sm font-medium">No invitations yet</p>
              <p className="text-xs text-muted-foreground mt-1">Brands will invite you to campaigns as you build your profile</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map(inv => (
                <div key={inv.id} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm hover:shadow-md transition-shadow" data-testid={`invite-card-${inv.id}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                        {inv.campaign?.name?.[0]?.toUpperCase() ?? "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-base">{inv.campaign?.name}</span>
                          <StatusBadge status={inv.status} />
                        </div>
                        <div className="text-sm text-muted-foreground font-medium mb-2">{inv.campaign?.sponsor}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{inv.campaign?.startDate} — {inv.campaign?.endDate}</span>
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{inv.campaign?.noOfCreators} creators</span>
                          <span className="flex items-center gap-1 capitalize"><Megaphone className="h-3 w-3" />{inv.campaign?.type?.replace("_", " ")}</span>
                        </div>
                      </div>
                    </div>
                    {inv.status === "pending" && (
                      (inv as { source?: string }).source === "creator" ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }} data-testid={`badge-awaiting-${inv.id}`}>
                          <Clock className="h-3.5 w-3.5" /> Awaiting Review
                        </span>
                      ) : (
                        <div className="flex gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => handleDecline(inv.id)} disabled={declineMutation.isPending}
                            className="h-9 px-3 rounded-xl text-xs font-semibold text-destructive border-destructive/30 hover:bg-destructive/10"
                            data-testid={`button-decline-${inv.id}`}>
                            <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                          </Button>
                          <Button size="sm" onClick={() => handleAccept(inv.id)} disabled={acceptMutation.isPending}
                            className="h-9 px-4 rounded-xl text-xs font-semibold"
                            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                            data-testid={`button-accept-${inv.id}`}>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Accept
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </CreatorLayout>
  );
}
