import { useRoute, useLocation } from "wouter";
import { useListMyInvites, useAcceptInvite, useDeclineInvite, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle, Clock, Trophy, XCircle } from "lucide-react";

type StatusFilter = "all" | "pending" | "active" | "completed" | "declined";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; Icon: React.ElementType }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#D97706", label: "Pending",   Icon: Clock },
  active:    { bg: "rgba(16,185,129,0.12)",  color: "#059669", label: "Active",    Icon: CheckCircle },
  completed: { bg: "rgba(107,47,206,0.12)",  color: "#6B2FCE", label: "Completed", Icon: Trophy },
  declined:  { bg: "rgba(239,68,68,0.12)",   color: "#DC2626", label: "Declined",  Icon: XCircle },
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All", pending: "Pending", active: "Accepted", completed: "Completed", declined: "Declined",
};

const FILTER_TO_HREF: Record<StatusFilter, string> = {
  all: "/campaigns", pending: "/campaigns/pending", active: "/campaigns/accepted",
  completed: "/campaigns/completed", declined: "/campaigns/declined",
};

function getFilterFromPath(path: string): StatusFilter {
  if (path.endsWith("/campaigns/accepted") || path.endsWith("/campaigns/active")) return "active";
  if (path.endsWith("/campaigns/pending")) return "pending";
  if (path.endsWith("/campaigns/completed")) return "completed";
  if (path.endsWith("/campaigns/declined")) return "declined";
  return "all";
}

export default function CreatorCampaignsPage() {
  const { toast } = useToast();
  const [location] = useLocation();
  const filter = getFilterFromPath(location);

  const { data: invites = [], isLoading } = useListMyInvites({ query: { queryKey: getListMyInvitesQueryKey() } });
  const acceptMutation = useAcceptInvite();
  const declineMutation = useDeclineInvite();

  const filtered = filter === "all" ? invites : invites.filter(i =>
    filter === "active" ? i.status === "active" : i.status === filter
  );

  const handleAccept = (id: number) => {
    acceptMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invite accepted! 🎉" }); },
      onError: () => toast({ title: "Failed to accept invite", variant: "destructive" }),
    });
  };

  const handleDecline = (id: number) => {
    declineMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invite declined" }); },
    });
  };

  const counts: Record<StatusFilter, number> = {
    all: invites.length,
    pending: invites.filter(i => i.status === "pending").length,
    active: invites.filter(i => i.status === "active").length,
    completed: invites.filter(i => i.status === "completed").length,
    declined: invites.filter(i => i.status === "declined").length,
  };

  return (
    <CreatorLayout>
      <div data-testid="page-creator-campaigns">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">My Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track all your campaign invitations</p>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {(["all", "pending", "active", "completed", "declined"] as StatusFilter[]).map(f => (
            <a
              key={f}
              href={FILTER_TO_HREF[f]}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={filter === f ? { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
              data-testid={`filter-${f}`}
            >
              {FILTER_LABELS[f]} ({counts[f]})
            </a>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
        ) : !filtered.length ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <Briefcase className="h-7 w-7" style={{ color: "#1DCFB3" }} />
            </div>
            <p className="text-sm font-medium">No {filter === "all" ? "" : FILTER_LABELS[filter].toLowerCase()} invitations</p>
            <p className="text-xs text-muted-foreground mt-1">Campaign invitations will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(invite => {
              const statusKey = invite.status === "active" ? "active" : invite.status;
              const s = STATUS_STYLES[statusKey] ?? STATUS_STYLES.pending;
              const { Icon } = s;
              const endDate = invite.campaign?.endDate
                ? new Date(invite.campaign.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                : null;
              return (
                <div key={invite.id} className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex items-center gap-4" data-testid={`invite-row-${invite.id}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{invite.campaign?.name ?? `Campaign #${invite.campaignId}`}</div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                      {invite.campaign?.sponsor && <span>{invite.campaign.sponsor}</span>}
                      {endDate && <span>Ends {endDate}</span>}
                      {invite.campaign?.type && <span className="capitalize">{invite.campaign.type}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                      <Icon className="h-3.5 w-3.5" />{s.label}
                    </span>
                    {invite.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAccept(invite.id)}
                          disabled={acceptMutation.isPending}
                          className="h-8 px-3 rounded-xl text-xs font-semibold"
                          style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                          data-testid={`btn-accept-${invite.id}`}
                        >Accept</Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(invite.id)}
                          disabled={declineMutation.isPending}
                          className="h-8 px-3 rounded-xl text-xs font-semibold text-red-500 border-red-200 hover:bg-red-50"
                          data-testid={`btn-decline-${invite.id}`}
                        >Decline</Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CreatorLayout>
  );
}
