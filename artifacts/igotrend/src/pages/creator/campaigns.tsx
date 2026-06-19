import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  useListMyInvites, useAcceptInvite, useDeclineInvite, getListMyInvitesQueryKey,
  customFetch,
} from "@workspace/api-client-react";
import type { Campaign } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, CheckCircle, Clock, Trophy, XCircle, Gem, Compass, Calendar, Users, Tag } from "lucide-react";

type StatusFilter = "all" | "pending" | "active" | "completed" | "declined";
type MainTab = "my-campaigns" | "discover";

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string; Icon: React.ElementType }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#D97706", label: "Pending",   Icon: Clock },
  active:    { bg: "rgba(16,185,129,0.12)",  color: "#059669", label: "Active",    Icon: CheckCircle },
  completed: { bg: "rgba(107,47,206,0.12)",  color: "#6B2FCE", label: "Completed", Icon: Trophy },
  declined:  { bg: "rgba(239,68,68,0.12)",   color: "#DC2626", label: "Declined",  Icon: XCircle },
};

const FILTER_LABELS: Record<StatusFilter, string> = {
  all: "All", pending: "Pending", active: "Accepted", completed: "Completed", declined: "Declined",
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
  const [mainTab, setMainTab] = useState<MainTab>("my-campaigns");
  const [appliedIds, setAppliedIds] = useState<Set<number>>(new Set());

  const { data: invites = [], isLoading: invitesLoading } = useListMyInvites(undefined, { query: { queryKey: getListMyInvitesQueryKey() } });
  const { data: discoverCampaigns = [], isLoading: discoverLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/creator/discover-campaigns"],
    queryFn: () => customFetch("/api/creator/discover-campaigns") as Promise<Campaign[]>,
  });
  const acceptMutation = useAcceptInvite();
  const declineMutation = useDeclineInvite();
  const applyMutation = useMutation({
    mutationFn: ({ campaignId }: { campaignId: number }) =>
      customFetch(`/api/creator/campaigns/${campaignId}/apply`, { method: "POST" }),
  });

  const filtered = filter === "all" ? invites : invites.filter(i =>
    filter === "active" ? i.status === "active" : i.status === filter
  );

  const counts: Record<StatusFilter, number> = {
    all: invites.length,
    pending: invites.filter(i => i.status === "pending").length,
    active: invites.filter(i => i.status === "active").length,
    completed: invites.filter(i => i.status === "completed").length,
    declined: invites.filter(i => i.status === "declined").length,
  };

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

  const handleApply = (campaignId: number) => {
    applyMutation.mutate({ campaignId }, {
      onSuccess: () => {
        setAppliedIds(prev => new Set(prev).add(campaignId));
        queryClient.invalidateQueries({ queryKey: ["/api/creator/discover-campaigns"] });
        queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() });
        toast({ title: "Application submitted! 🎉" });
      },
      onError: (err: unknown) => {
        const msg = (err as { message?: string })?.message ?? "Failed to apply";
        toast({ title: msg, variant: "destructive" });
      },
    });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-creator-campaigns">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your invitations and discover new opportunities</p>
        </div>

        {/* Main tabs */}
        <div className="flex gap-1 mb-5 border-b border-gray-100 pb-0">
          {([
            { key: "my-campaigns", label: "My Campaigns", count: invites.length },
            { key: "discover", label: "Discover", count: discoverCampaigns.length },
          ] as { key: MainTab; label: string; count: number }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setMainTab(tab.key)}
              className="px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all relative"
              style={mainTab === tab.key
                ? { color: "#1DCFB3", background: "rgba(29,207,179,0.08)", borderBottom: "2px solid #1DCFB3" }
                : { color: "#6b7280" }}
              data-testid={`tab-${tab.key}`}
            >
              {tab.label}
              <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold"
                style={mainTab === tab.key
                  ? { background: "rgba(29,207,179,0.15)", color: "#0FA88E" }
                  : { background: "rgba(0,0,0,0.05)", color: "#9ca3af" }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* My Campaigns tab */}
        {mainTab === "my-campaigns" && (
          <>
            <div className="flex gap-2 mb-5 flex-wrap">
              {(["all", "pending", "active", "completed", "declined"] as StatusFilter[]).map(f => (
                <a
                  key={f}
                  href={f === "all" ? "/campaigns" : `/campaigns/${f === "active" ? "accepted" : f}`}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                  style={filter === f
                    ? { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "#fff", border: "none" }
                    : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
                  data-testid={`filter-${f}`}
                >
                  {FILTER_LABELS[f]} ({counts[f]})
                </a>
              ))}
            </div>

            {invitesLoading ? (
              <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
            ) : !filtered.length ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                  <Briefcase className="h-7 w-7" style={{ color: "#1DCFB3" }} />
                </div>
                <p className="text-sm font-medium">No {filter === "all" ? "" : FILTER_LABELS[filter].toLowerCase()} invitations</p>
                <p className="text-xs text-muted-foreground mt-1">Campaign invitations will appear here</p>
                <button onClick={() => setMainTab("discover")} className="mt-3 text-xs px-4 py-2 rounded-xl font-semibold text-white" style={{ background: "linear-gradient(135deg,#1DCFB3,#0FA88E)" }}>
                  Discover Campaigns
                </button>
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
                          {invite.campaign?.sponsor && <span className="font-medium text-foreground/70">{invite.campaign.sponsor}</span>}
                          {invite.campaign?.type && (
                            <span className="px-1.5 py-0.5 rounded-md font-medium capitalize" style={{ background: "rgba(107,47,206,0.08)", color: "#6B2FCE" }}>
                              {invite.campaign.type.replace("_", " ")}
                            </span>
                          )}
                          {invite.campaign?.campaignDuration && <span className="capitalize">{invite.campaign.campaignDuration}</span>}
                          {endDate && <span>Ends {endDate}</span>}
                          {invite.estimatedPayout != null && (
                            <span className="flex items-center gap-0.5 font-semibold" style={{ color: "#F59E0B" }}>
                              <Gem className="h-3 w-3" />{Number(invite.estimatedPayout).toLocaleString()} gems
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {(invite as unknown as { source?: string }).source === "creator" && invite.status === "pending" ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }} data-testid={`badge-awaiting-${invite.id}`}>
                            <Clock className="h-3.5 w-3.5" /> Awaiting Review
                          </span>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: s.bg, color: s.color }}>
                              <Icon className="h-3.5 w-3.5" />{s.label}
                            </span>
                            {invite.status === "pending" && (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleAccept(invite.id)} disabled={acceptMutation.isPending} className="h-8 px-3 rounded-xl text-xs font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid={`btn-accept-${invite.id}`}>Accept</Button>
                                <Button size="sm" variant="outline" onClick={() => handleDecline(invite.id)} disabled={declineMutation.isPending} className="h-8 px-3 rounded-xl text-xs font-semibold text-red-500 border-red-200 hover:bg-red-50" data-testid={`btn-decline-${invite.id}`}>Decline</Button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Discover tab */}
        {mainTab === "discover" && (
          <>
            {discoverLoading ? (
              <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
            ) : !discoverCampaigns.length ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                  <Compass className="h-7 w-7" style={{ color: "#1DCFB3" }} />
                </div>
                <p className="text-sm font-medium">No open campaigns right now</p>
                <p className="text-xs text-muted-foreground mt-1">Check back soon for new opportunities</p>
              </div>
            ) : (
              <div className="space-y-3">
                {discoverCampaigns.map(campaign => {
                  const applied = appliedIds.has(campaign.id);
                  const endDate = campaign.endDate
                    ? new Date(campaign.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                    : null;
                  return (
                    <div key={campaign.id} className="bg-white rounded-2xl border border-border/60 shadow-sm p-5 flex items-center gap-4" data-testid={`discover-campaign-${campaign.id}`}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 font-bold text-sm" style={{ background: "linear-gradient(135deg, #8B5CF6, #6D28D9)" }}>
                        {campaign.name[0]?.toUpperCase() ?? "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm">{campaign.name}</div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                          <span className="font-medium text-foreground/70">{campaign.sponsor}</span>
                          <span className="px-1.5 py-0.5 rounded-md font-medium capitalize" style={{ background: "rgba(107,47,206,0.08)", color: "#6B2FCE" }}>
                            {campaign.type?.replace("_", " ") ?? ""}
                          </span>
                          <span className="capitalize flex items-center gap-0.5">
                            <Calendar className="h-3 w-3" /> {campaign.campaignDuration}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Users className="h-3 w-3" /> {campaign.noOfCreators} creators
                          </span>
                          {endDate && <span>Deadline {endDate}</span>}
                          {(campaign as unknown as Record<string, unknown>).gemsPerCreator != null && Number((campaign as unknown as Record<string, unknown>).gemsPerCreator) > 0 && (
                            <span className="flex items-center gap-0.5 font-semibold" style={{ color: "#F59E0B" }}>
                              <Gem className="h-3 w-3" /> {Number((campaign as unknown as Record<string, unknown>).gemsPerCreator).toLocaleString()} gems
                            </span>
                          )}
                          {(campaign as unknown as Record<string, unknown>).campaignCategoryId != null && (
                            <span className="flex items-center gap-0.5" style={{ color: "#6B2FCE" }}>
                              <Tag className="h-3 w-3" /> Cat. {String((campaign as unknown as Record<string, unknown>).campaignCategoryId)}
                            </span>
                          )}
                        </div>
                        {campaign.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{campaign.description}</p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => handleApply(campaign.id)}
                          disabled={applied || applyMutation.isPending}
                          className="h-8 px-4 rounded-xl text-xs font-semibold"
                          style={applied ? { background: "rgba(29,207,179,0.12)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.25)" } : { background: "linear-gradient(135deg,#1DCFB3,#0FA88E)", border: "none" }}
                          data-testid={`btn-apply-${campaign.id}`}
                        >
                          {applied ? "Applied" : "Apply"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </CreatorLayout>
  );
}
