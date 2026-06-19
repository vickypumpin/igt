import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGetBrandDashboard, getGetBrandDashboardQueryKey, customFetch } from "@workspace/api-client-react";
import { useGetMe } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Megaphone, CheckCircle, XCircle, Inbox, DollarSign, Star,
  Eye, BookOpen, Gift, Plus, Building2, Bell, X,
} from "lucide-react";

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #1DCFB3, #0FA88E)",
  "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  "linear-gradient(135deg, #3B82F6, #2563EB)",
  "linear-gradient(135deg, #F59E0B, #D97706)",
  "linear-gradient(135deg, #EF4444, #DC2626)",
];

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "📸", facebook: "👥", twitter: "🐦", youtube: "▶️", tiktok: "🎵", snapchat: "👻",
};

interface OverviewCardProps { label: string; primary: number; primaryLabel: string; secondary: number; secondaryLabel: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }
function OverviewCard({ label, primary, primaryLabel, secondary, secondaryLabel, icon: Icon, color }: OverviewCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: `${color}08` }}>
          <div className="text-2xl font-extrabold" style={{ color }}>{primary}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{primaryLabel}</div>
        </div>
        <div className="rounded-xl p-3 bg-gray-50">
          <div className="text-2xl font-extrabold text-foreground">{secondary}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{secondaryLabel}</div>
        </div>
      </div>
    </div>
  );
}

const CREATE_CARDS = [
  {
    title: "Create Campaign",
    desc: "Set up a new influencer campaign for your brand.",
    href: "/campaigns/new",
    btnLabel: "Get Started",
    btnBg: "linear-gradient(135deg, #1DCFB3, #0FA88E)",
    bg: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)",
    icon: Megaphone,
  },
  {
    title: "Community Guidelines",
    desc: "Understand platform rules and creator expectations.",
    href: "/community-guidelines",
    btnLabel: "Read More",
    btnBg: "rgba(255,255,255,0.15)",
    bg: "linear-gradient(135deg, #0d3d35 0%, #0FA88E 100%)",
    icon: BookOpen,
  },
  {
    title: "Reward Trenders",
    desc: "Show appreciation to your best content creators.",
    href: "/payments",
    btnLabel: "Get Started",
    btnBg: "linear-gradient(135deg, #F59E0B, #D97706)",
    bg: "linear-gradient(135deg, #1a0a3e 0%, #6B2FCE 100%)",
    icon: Gift,
  },
];

interface PendingInvite {
  id: number;
  agencyId: number;
  agencyName: string | null;
  commissionRate: number | null;
  invitedAt: string;
}

export default function BrandDashboardPage() {
  const { data, isLoading } = useGetBrandDashboard({ query: { queryKey: getGetBrandDashboardQueryKey() } });
  const { data: user } = useGetMe();
  const [campaignFilter, setCampaignFilter] = useState("all");
  const [showEntries, setShowEntries] = useState(10);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const { data: pendingInvites = [] } = useQuery<PendingInvite[]>({
    queryKey: ["/agency/invites/pending"],
    queryFn: () => customFetch("/api/agency/invites/pending"),
    enabled: !!(user && (user as unknown as { role?: string }).role === "brand"),
  });

  const totalSpendStr = `₦${(data?.totalSpend ?? 0).toLocaleString()}`;
  const hasPendingInvites = pendingInvites.length > 0 && !bannerDismissed;
  const managedByAgency = (user as unknown as { agencyId?: number | null; agencyName?: string | null })?.agencyId
    ? (user as unknown as { agencyName?: string | null })?.agencyName
    : null;

  return (
    <BrandLayout>
      <div data-testid="page-brand-dashboard">
        {/* Pending Agency Invite Banner */}
        {hasPendingInvites && (
          <div
            className="mb-5 flex items-center gap-3 rounded-2xl px-5 py-3.5"
            style={{ background: "linear-gradient(135deg, rgba(107,47,206,0.1), rgba(107,47,206,0.06))", border: "1px solid rgba(107,47,206,0.25)" }}
            data-testid="agency-invite-banner"
          >
            <Bell className="h-4 w-4 flex-shrink-0" style={{ color: "#6B2FCE" }} />
            <div className="flex-1 text-sm" style={{ color: "#6B2FCE" }}>
              <span className="font-bold">
                {pendingInvites.length === 1
                  ? `${pendingInvites[0].agencyName ?? "An agency"} has invited you to become a managed client.`
                  : `You have ${pendingInvites.length} pending agency invites.`}
              </span>
              {" "}
              <Link href="/settings">
                <span className="underline cursor-pointer font-semibold">Review in Settings →</span>
              </Link>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-purple-100 transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" style={{ color: "#6B2FCE" }} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Brands &amp; Advertisers</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back, <span className="font-semibold text-foreground">{user?.companyName ?? user?.firstName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {managedByAgency && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
                style={{ background: "rgba(107,47,206,0.12)", color: "#6B2FCE", border: "1px solid rgba(107,47,206,0.25)" }}
                data-testid="managed-by-chip"
              >
                <Building2 className="h-3 w-3" />
                Managed by {managedByAgency}
              </div>
            )}
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(29,207,179,0.12)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.25)" }}>
              <DollarSign className="h-3 w-3 inline mr-1" />
              Expenditure: {totalSpendStr}
            </div>
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706", border: "1px solid rgba(245,158,11,0.25)" }}>
              <Star className="h-3 w-3 inline mr-1" />
              Brand
            </div>
            <Link href="/campaigns/new">
              <Button size="sm" className="h-9 rounded-xl font-semibold gap-1.5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="button-new-campaign">
                <Plus className="h-4 w-4" /> New Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Campaign Overview — 3 stat cards */}
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Campaign Overview</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <OverviewCard
                label="Campaigns"
                primary={data?.activeCampaigns ?? 0}
                primaryLabel="Active"
                secondary={data?.completedCampaigns ?? 0}
                secondaryLabel="Completed"
                icon={Megaphone}
                color="#1DCFB3"
              />
              <OverviewCard
                label="Responses"
                primary={data?.totalCreatorsInvited ?? 0}
                primaryLabel="Accepted"
                secondary={data?.declinedCampaigns ?? 0}
                secondaryLabel="Declined"
                icon={CheckCircle}
                color="#8B5CF6"
              />
              <OverviewCard
                label="Invitations"
                primary={data?.totalCreatorsInvited ?? 0}
                primaryLabel="Sent"
                secondary={data?.pendingCampaigns ?? 0}
                secondaryLabel="Pending"
                icon={Inbox}
                color="#F59E0B"
              />
            </div>
          )}
        </div>

        {/* Create Campaigns section */}
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Create Campaigns</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CREATE_CARDS.map((card) => (
              <Link key={card.title} href={card.href}>
                <div
                  className="relative overflow-hidden rounded-2xl p-6 cursor-pointer hover:opacity-95 transition-opacity"
                  style={{ background: card.bg, minHeight: 150 }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <card.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="font-bold text-white text-sm mb-1">{card.title}</div>
                  <div className="text-white/60 text-xs leading-relaxed mb-4">{card.desc}</div>
                  <button
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white"
                    style={{ background: card.btnBg, border: card.btnBg.includes("rgba") ? "1px solid rgba(255,255,255,0.3)" : "none" }}
                  >
                    {card.btnLabel}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trenders (Invites/Request) section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trenders (Invites / Request)</h2>
            <div className="flex items-center gap-3">
              <select
                value={campaignFilter}
                onChange={e => setCampaignFilter(e.target.value)}
                className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#1DCFB3]"
              >
                <option value="all">All Campaigns</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show</span>
                <select value={showEntries} onChange={e => setShowEntries(Number(e.target.value))} className="text-xs rounded-lg border border-gray-200 px-2 py-1 text-gray-600 bg-white focus:outline-none">
                  <option>10</option><option>25</option><option>50</option>
                </select>
                <span className="text-xs text-muted-foreground">entries</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Trenders</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Level</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Badge</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Platform</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Payout</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td colSpan={9} className="px-5 py-3"><Skeleton className="h-8 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : !data?.topCreators?.length ? (
                    <tr>
                      <td colSpan={9} className="px-5 py-12 text-center text-muted-foreground text-sm">
                        <div className="flex flex-col items-center gap-2">
                          <Eye className="h-8 w-8 opacity-20" />
                          <div>No data available in table</div>
                          <div className="flex items-center gap-4 mt-3">
                            <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Previous</button>
                            <button className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">Next</button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.topCreators.slice(0, showEntries).map((creator, idx) => {
                      const platforms = [
                        creator.instagramProfile && "instagram",
                        creator.twitterProfile && "twitter",
                        creator.youtubeProfile && "youtube",
                        creator.tiktokProfile && "tiktok",
                      ].filter(Boolean) as string[];
                      return (
                        <tr key={creator.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors" data-testid={`trender-row-${creator.id}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="text-xs font-bold text-white" style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length] }}>
                                  {creator.firstName[0]}{creator.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="text-xs font-semibold text-foreground">{creator.firstName} {creator.lastName}</div>
                                <div className="text-xs text-muted-foreground">@{creator.userName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{creator.contentCategoryNames ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{creator.creatorCategoryNames ?? "Micro"}</td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
                              {creator.badge ?? "Trender"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {platforms.length ? platforms.map(p => (
                                <span key={p} title={p} className="text-sm">{PLATFORM_ICONS[p]}</span>
                              )) : <span className="text-muted-foreground text-xs">—</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }}>Pending</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.1)", color: "#DC2626" }}>Unpaid</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">—</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <Link href={`/creators/${creator.id}`}>
                                <button className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors" style={{ background: "rgba(29,207,179,0.12)", color: "#1DCFB3" }}>View</button>
                              </Link>
                              <button className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>Accept</button>
                              <button className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors" style={{ background: "rgba(239,68,68,0.1)", color: "#DC2626" }}>Decline</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}
