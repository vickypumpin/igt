import { useState, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatorPickerPanel } from "@/components/creator-picker-panel";
import {
  Megaphone, Users, UserPlus, X, CheckCircle, Clock, XCircle,
  Instagram, Youtube, Twitter, Facebook,
} from "lucide-react";
import { SiTiktok } from "react-icons/si";
import { useSearch } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface ClientInfo {
  brandUserId: number | null;
  companyName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

interface Campaign {
  id: number; name: string; sponsor: string; status: string; type: string;
  noOfCreators: number | null; startDate: string | null; endDate: string | null;
  coverImageUrl: string | null; brandId: number | null; createdAt: string;
  submissionsCount: number;
  client: ClientInfo | null;
}

interface CampaignInvite {
  id: number;
  campaignId: number;
  creatorId: number;
  status: string;
  createdAt: string;
  creator: {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    badge: string | null;
    avatarUrl: string | null;
  };
}

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)",   color: "#059669" },
  pending:   { bg: "rgba(245,158,11,0.12)",   color: "#D97706" },
  completed: { bg: "rgba(29,207,179,0.12)",   color: "#0FA88E" },
  declined:  { bg: "rgba(239,68,68,0.12)",    color: "#DC2626" },
};

const BADGE_CFG: Record<string, { bg: string; text: string; label: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563", label: "Nano" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB", label: "Micro" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669", label: "Mid-tier" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED", label: "Macro" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C", label: "Mega" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309", label: "Elite" },
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#1DCFB3,#0FA88E)",
  "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  "linear-gradient(135deg,#3B82F6,#2563EB)",
  "linear-gradient(135deg,#F59E0B,#D97706)",
];

const PURPLE = "#6B2FCE";

const INVITE_STATUS_CFG: Record<string, { icon: React.ReactNode; bg: string; color: string; label: string }> = {
  pending:   { icon: <Clock className="h-3 w-3" />,       bg: "rgba(245,158,11,0.12)",  color: "#D97706", label: "Pending" },
  active:    { icon: <CheckCircle className="h-3 w-3" />, bg: "rgba(16,185,129,0.12)",  color: "#059669", label: "Accepted" },
  completed: { icon: <CheckCircle className="h-3 w-3" />, bg: "rgba(29,207,179,0.12)",  color: "#0FA88E", label: "Completed" },
  declined:  { icon: <XCircle className="h-3 w-3" />,     bg: "rgba(239,68,68,0.12)",   color: "#DC2626", label: "Declined" },
};

function getCreatorInitials(c: { firstName: string; lastName: string; userName: string }) {
  if (c.firstName && c.lastName) return `${c.firstName[0]}${c.lastName[0]}`.toUpperCase();
  return c.userName?.slice(0, 2).toUpperCase() ?? "??";
}

function getCreatorName(c: { firstName: string; lastName: string; userName: string }) {
  return c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.userName;
}

/* ── Campaign Detail Side-panel (invites list) ─────────────── */
function CampaignDetailPanel({
  campaign,
  onClose,
  onOpenInviteCreators,
}: {
  campaign: Campaign;
  onClose: () => void;
  onOpenInviteCreators: () => void;
}) {
  const { data: invites = [], isLoading } = useQuery<CampaignInvite[]>({
    queryKey: [`/agency/campaigns/${campaign.id}/invites`],
    queryFn: () => customFetch(`/api/agency/campaigns/${campaign.id}/invites`),
  });

  const st = STATUS_STYLE[campaign.status] ?? { bg: "rgba(107,114,128,0.12)", color: "#4B5563" };
  const clientName = campaign.client?.companyName
    || (campaign.client?.firstName ? `${campaign.client.firstName} ${campaign.client.lastName ?? ""}`.trim() : null)
    || campaign.client?.email
    || "—";

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end"
      style={{ background: "rgba(10,6,30,0.45)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border/60" style={{ background: "linear-gradient(135deg, #1a0a3e, #3d1a85)" }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-extrabold text-white truncate">{campaign.name}</h2>
              <p className="text-xs text-white/60 mt-0.5">{campaign.sponsor} · {clientName}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors"
              style={{ background: "rgba(255,255,255,0.12)" }}
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>
              {campaign.status}
            </span>
            <span className="text-xs text-white/50 capitalize">{campaign.type}</span>
            {campaign.noOfCreators && (
              <span className="text-xs text-white/50 flex items-center gap-1">
                <Users className="h-3 w-3" /> {campaign.noOfCreators} creators
              </span>
            )}
          </div>
        </div>

        {/* Invite Creators button */}
        <div className="px-5 py-3 border-b border-border/60 bg-gray-50/80">
          <button
            onClick={onOpenInviteCreators}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${PURPLE}, #4E22A8)` }}
            data-testid={`btn-invite-creators-${campaign.id}`}
          >
            <UserPlus className="h-4 w-4" />
            Invite Creators
          </button>
        </div>

        {/* Invite list */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Invited Creators ({isLoading ? "…" : invites.length})
          </p>
          {isLoading ? (
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
          ) : invites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-9 w-9 text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-500">No creators invited yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Invite Creators" to find and add creators to this campaign.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invites.map((inv, i) => {
                const grad = AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length];
                const badge = inv.creator.badge ? BADGE_CFG[inv.creator.badge] : null;
                const statusCfg = INVITE_STATUS_CFG[inv.status] ?? INVITE_STATUS_CFG.pending;
                return (
                  <div key={inv.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-white">
                    <div
                      className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xs border-2 border-white shadow-sm overflow-hidden"
                      style={inv.creator.avatarUrl ? {} : { background: grad }}
                    >
                      {inv.creator.avatarUrl
                        ? <img src={inv.creator.avatarUrl} alt={inv.creator.userName} className="w-full h-full object-cover" />
                        : getCreatorInitials(inv.creator)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm text-gray-900 truncate">{getCreatorName(inv.creator)}</span>
                        {badge && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold capitalize flex-shrink-0" style={{ background: badge.bg, color: badge.text }}>
                            {badge.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">@{inv.creator.userName}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold" style={{ background: statusCfg.bg, color: statusCfg.color }}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-border/60 bg-gray-50/80">
          <p className="text-xs text-gray-400 text-center">
            Invited {new Date(campaign.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────── */
export default function AgencyCampaignsPage() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultClient = params.get("client") ?? "all";

  const [clientFilter, setClientFilter] = useState<string>(defaultClient);
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);
  const [invitePanelCampaign, setInvitePanelCampaign] = useState<Campaign | null>(null);
  const [localInvitedIds, setLocalInvitedIds] = useState<Map<number, Set<number>>>(new Map());

  const queryClient = useQueryClient();
  const { toast: _toast } = useToast();

  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ["/agency/campaigns"],
    queryFn: () => customFetch("/api/agency/campaigns"),
  });

  const clients = useMemo(() => {
    const seen = new Map<string, string>();
    campaigns.forEach(c => {
      if (c.client?.brandUserId) {
        const name = c.client.companyName
          || (c.client.firstName ? `${c.client.firstName} ${c.client.lastName ?? ""}`.trim() : null)
          || c.client.email
          || String(c.client.brandUserId);
        seen.set(String(c.client.brandUserId), name);
      }
    });
    return Array.from(seen.entries());
  }, [campaigns]);

  const filtered = useMemo(() =>
    clientFilter === "all" ? campaigns : campaigns.filter(c => String(c.client?.brandUserId) === clientFilter),
    [campaigns, clientFilter]);

  const byCampaignStatus = (s: string) => STATUS_STYLE[s] ?? { bg: "rgba(107,114,128,0.12)", color: "#4B5563" };

  const handleOpenInvitePanel = useCallback((campaign: Campaign) => {
    setDetailCampaign(null);
    setInvitePanelCampaign(campaign);
  }, []);

  const handleInviteSuccess = useCallback((campaignId: number, creatorId: number) => {
    setLocalInvitedIds(prev => {
      const next = new Map(prev);
      const existing = next.get(campaignId) ?? new Set<number>();
      next.set(campaignId, new Set(existing).add(creatorId));
      return next;
    });
    queryClient.invalidateQueries({ queryKey: [`/agency/campaigns/${campaignId}/invites`] });
  }, [queryClient]);

  return (
    <AgencyLayout>
      <div data-testid="page-agency-campaigns">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold">Client Campaigns</h1>
            <p className="text-sm text-muted-foreground mt-0.5">All campaigns across your accepted clients — {filtered.length} of {campaigns.length} shown</p>
          </div>
          {clients.length > 0 && (
            <select
              value={clientFilter}
              onChange={e => setClientFilter(e.target.value)}
              className="h-9 rounded-xl border border-border/60 px-3 text-sm bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              data-testid="select-client-filter"
            >
              <option value="all">All clients</option>
              {clients.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !campaigns.length ? (
          <div className="text-center py-20 rounded-2xl border border-border/60 bg-white">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(107,47,206,0.1)" }}>
              <Megaphone className="h-7 w-7" style={{ color: PURPLE }} />
            </div>
            <p className="text-sm font-semibold mb-1">No campaigns yet</p>
            <p className="text-xs text-muted-foreground">Campaigns from your accepted clients will appear here</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creators</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submissions</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Created</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(c => {
                  const st = byCampaignStatus(c.status);
                  const clientName = c.client?.companyName
                    || (c.client?.firstName ? `${c.client.firstName} ${c.client.lastName ?? ""}`.trim() : null)
                    || c.client?.email
                    || "—";
                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-muted/30 transition-colors"
                      data-testid={`campaign-row-${c.id}`}
                    >
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => setDetailCampaign(c)}
                          className="flex items-center gap-3 text-left hover:underline"
                        >
                          {c.coverImageUrl ? (
                            <img src={c.coverImageUrl} alt="" className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: PURPLE }}>
                              <Megaphone className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <div className="font-semibold">{c.name}</div>
                            <div className="text-xs text-muted-foreground">{c.sponsor}</div>
                          </div>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-medium">{clientName}</div>
                        {c.client?.email && c.client.companyName && (
                          <div className="text-xs text-muted-foreground">{c.client.email}</div>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs capitalize text-muted-foreground">{c.type}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {c.noOfCreators ?? 0}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{Number(c.submissionsCount)}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleOpenInvitePanel(c)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                          style={{ background: `linear-gradient(135deg, ${PURPLE}, #4E22A8)` }}
                          data-testid={`btn-invite-creators-row-${c.id}`}
                        >
                          <UserPlus className="h-3 w-3" />
                          Invite Creators
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Campaign detail side-panel */}
      {detailCampaign && (
        <CampaignDetailPanel
          campaign={detailCampaign}
          onClose={() => setDetailCampaign(null)}
          onOpenInviteCreators={() => handleOpenInvitePanel(detailCampaign)}
        />
      )}

      {/* Creator Picker Panel */}
      {invitePanelCampaign && (
        <CreatorPickerPanel
          campaignId={invitePanelCampaign.id}
          campaignName={invitePanelCampaign.name}
          alreadyInvitedIds={localInvitedIds.get(invitePanelCampaign.id)}
          onClose={() => setInvitePanelCampaign(null)}
          onInviteSuccess={(creatorId) => handleInviteSuccess(invitePanelCampaign.id, creatorId)}
        />
      )}
    </AgencyLayout>
  );
}
