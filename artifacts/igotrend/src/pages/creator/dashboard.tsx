import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useGetCreatorDashboard, useGetMe, getGetCreatorDashboardQueryKey, customFetch } from "@workspace/api-client-react";
import CreatorLayout from "@/components/layout/creator-layout";
import CreatorOnboardingWizard from "@/components/creator-onboarding-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, Star, Inbox, CheckCircle, XCircle, ChevronRight, Eye, ShieldCheck } from "lucide-react";

type KycRequest = { id: number; status: "pending" | "approved" | "rejected"; createdAt: string };

const PLATFORM_ROWS = [
  { key: "instagram", label: "Instagram", emoji: "📸" },
  { key: "facebook", label: "Facebook", emoji: "👥" },
  { key: "twitter", label: "Twitter / X", emoji: "🐦" },
  { key: "youtube", label: "YouTube", emoji: "▶️" },
  { key: "tiktok", label: "TikTok", emoji: "🎵" },
  { key: "snapchat", label: "Snapchat", emoji: "👻" },
] as const;

interface StatBoxProps { label: string; value: number; sub: string; color: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }> }
function StatBox({ label, value, sub, color, icon: Icon }: StatBoxProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-extrabold mb-1" style={{ color }}>{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706" },
  accepted:  { bg: "rgba(16,185,129,0.12)", text: "#059669" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "#f4f4f5", text: "#71717a" };
  return (
    <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: cfg.bg, color: cfg.text }}>
      {status}
    </span>
  );
}

function ProfileCompletionRing({ pct }: { pct: number }) {
  const size = 72;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? "#1DCFB3" : pct >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke}
            strokeDasharray={circ}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-extrabold" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-0.5">Profile Completion</div>
        <div className="text-sm font-semibold text-foreground">
          {pct >= 80 ? "Looking great!" : pct >= 50 ? "Almost there" : "Keep going!"}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">
          {pct < 100 ? "Complete your profile to get more brand invites" : "Your profile is complete!"}
        </div>
      </div>
    </div>
  );
}

function calcProfileCompletion(user: Record<string, unknown> | null | undefined): number {
  if (!user) return 0;
  // Spec: "social handles filled / total fields"
  // Weight: 4 essential profile fields + 6 social handle fields = 10 total
  const essentialFields = ["firstName", "lastName", "bio", "avatarUrl"];
  const socialHandleFields = [
    "instagramProfile", "tiktokProfile", "youtubeProfile",
    "twitterProfile", "facebookProfile", "snapchatProfile",
  ];
  const allFields = [...essentialFields, ...socialHandleFields];
  const filled = allFields.filter(f => {
    const v = user[f];
    return v !== null && v !== undefined && v !== "";
  });
  return Math.round((filled.length / allFields.length) * 100);
}

export default function CreatorDashboardPage() {
  const { data, isLoading } = useGetCreatorDashboard({ query: { queryKey: getGetCreatorDashboardQueryKey() } });
  const { data: user } = useGetMe();
  const [showEntries, setShowEntries] = useState(10);
  const { data: kycRequest } = useQuery<KycRequest | null>({
    queryKey: ["/api/creator/kyc-request"],
    queryFn: () => customFetch("/api/creator/kyc-request").catch(() => null) as Promise<KycRequest | null>,
    retry: false,
  });
  const [wizardDismissed, setWizardDismissed] = useState(false);

  const userAny = user as unknown as Record<string, unknown> | undefined;
  const onboardingComplete = userAny?.onboardingComplete as boolean | undefined;
  const completionPct = calcProfileCompletion(userAny ?? null);
  const showWizard = !wizardDismissed && user?.role === "creator" && onboardingComplete === false && completionPct < 50;

  const showVerifyBanner = !(user as unknown as { verified?: boolean })?.verified && (!kycRequest || kycRequest.status === "rejected");

  const accepted = (data?.totalInvites ?? 0) - (data?.pendingInvites ?? 0) - (data?.declinedInvites ?? 0) - (data?.completedCampaigns ?? 0);
  const badgeLabel = user?.badge ?? "Micro";

  const platformHandles: Record<string, string | null | undefined> = {
    instagram: user?.instagramProfile,
    facebook: user?.facebookProfile,
    twitter: user?.twitterProfile,
    youtube: user?.youtubeProfile,
    tiktok: user?.tiktokProfile,
    snapchat: user?.snapchatProfile,
  };

  return (
    <CreatorLayout>
      {showWizard && (
        <CreatorOnboardingWizard onClose={() => setWizardDismissed(true)} />
      )}

      <div data-testid="page-creator-dashboard">
        {/* Get Verified banner */}
        {showVerifyBanner && (
          <Link href="/verify">
            <div className="mb-5 flex items-center gap-3 rounded-2xl px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.12), rgba(29,207,179,0.06))", border: "1px solid rgba(29,207,179,0.3)" }} data-testid="banner-get-verified">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,207,179,0.15)" }}>
                <ShieldCheck className="h-5 w-5" style={{ color: "#1DCFB3" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold" style={{ color: "#0FA88E" }}>Get Your Verified Badge</div>
                <div className="text-xs text-muted-foreground">Submit your identity documents to get verified and stand out to brands</div>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0" style={{ color: "#1DCFB3" }} />
            </div>
          </Link>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Influencers &amp; Content Creators</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back, <span className="font-semibold text-foreground">@{user?.userName}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(29,207,179,0.12)", color: "#1DCFB3", border: "1px solid rgba(29,207,179,0.25)" }}>
              <DollarSign className="h-3 w-3 inline mr-1" />
              Earnings: ₦{(data?.totalEarnings ?? 0).toLocaleString()}
            </div>
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706", border: "1px solid rgba(245,158,11,0.25)" }}>
              <Star className="h-3 w-3 inline mr-1" />
              Gems: {data?.gems ?? 0}
            </div>
            <div className="px-3 py-1.5 rounded-xl text-xs font-bold" style={{ background: "rgba(107,47,206,0.12)", color: "#8B5CF6", border: "1px solid rgba(107,47,206,0.25)" }}>
              {badgeLabel} Trender
            </div>
          </div>
        </div>

        {/* Profile completion ring */}
        <div className="mb-5">
          <ProfileCompletionRing pct={completionPct} />
        </div>

        {/* Overview section: 2×2 stats grid + Platform Handles table */}
        <div className="mb-7">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 2×2 stat boxes */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
              ) : (
                <>
                  <StatBox label="Invitations" value={data?.totalInvites ?? 0} sub="Total Campaigns (All time)" color="#8B5CF6" icon={Inbox} />
                  <StatBox label="Completed" value={data?.completedCampaigns ?? 0} sub="Total Campaigns (All time)" color="#1DCFB3" icon={CheckCircle} />
                  <StatBox label="Declined" value={data?.declinedInvites ?? 0} sub="Total Campaigns (All time)" color="#EF4444" icon={XCircle} />
                  <StatBox label="Accepted" value={Math.max(0, accepted)} sub="Total Campaigns (All time)" color="#10B981" icon={CheckCircle} />
                </>
              )}
            </div>

            {/* Platform Handles table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Platform Handles</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-50 bg-gray-50/50">
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Platform</th>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PLATFORM_ROWS.map((row) => {
                      const handle = platformHandles[row.key];
                      return (
                        <tr key={row.key} className="border-b border-gray-50">
                          <td className="px-4 py-2.5 text-xs">
                            <div className="flex items-center gap-1.5">
                              <span>{row.emoji}</span>
                              <span className="text-muted-foreground">{row.label}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5 text-xs font-medium">
                            {handle ? (
                              <span style={{ color: "#1DCFB3" }}>{handle}</span>
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Invitations section — paginated table */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Invitations</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Show</span>
              <select
                value={showEntries}
                onChange={e => setShowEntries(Number(e.target.value))}
                className="text-xs rounded-lg border border-gray-200 px-2 py-1 text-gray-600 bg-white focus:outline-none"
              >
                <option>10</option><option>25</option><option>50</option>
              </select>
              <span className="text-xs text-muted-foreground">entries</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Campaign Name</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Sponsor</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Duration</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">End Date</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td colSpan={6} className="px-5 py-3"><Skeleton className="h-8 rounded-lg" /></td>
                      </tr>
                    ))
                  ) : !data?.recentInvites?.length ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground text-sm">
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
                    data.recentInvites.slice(0, showEntries).map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors" data-testid={`invite-row-${inv.id}`}>
                        <td className="px-5 py-3">
                          <Link href={`/invites/${inv.id}`}>
                            <span className="text-xs font-semibold text-foreground hover:underline cursor-pointer" style={{ color: "#1DCFB3" }}>
                              {inv.campaign?.name ?? "—"}
                            </span>
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{inv.campaign?.sponsor ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground capitalize">{inv.campaign?.campaignDuration ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {inv.campaign?.endDate ? new Date(inv.campaign.endDate).toLocaleDateString("en-GB") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={inv.status} />
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">
                          {inv.estimatedPayout ? `₦${Number(inv.estimatedPayout).toLocaleString()}` : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
