import { Link } from "wouter";
import { useGetCreatorDashboard, useListMyInvites, getGetCreatorDashboardQueryKey, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import CreatorLayout from "@/components/layout/creator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Inbox, DollarSign, Eye, ThumbsUp, Gem, ArrowRight, CheckCircle2, Megaphone } from "lucide-react";

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5", dot: "#6366F1" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: cfg.bg, color: cfg.text }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: cfg.dot }} />
      {status}
    </span>
  );
}

interface StatCardProps { label: string; value: string | number; icon: React.ReactNode; gradient: string; testid?: string }
function StatCard({ label, value, icon, gradient, testid }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white mb-3" style={{ background: gradient }}>
          {icon}
        </div>
        <div className="text-2xl font-extrabold text-foreground" data-testid={testid}>{value}</div>
        <div className="text-xs font-medium text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function CreatorDashboardPage() {
  const { data, isLoading } = useGetCreatorDashboard({ query: { queryKey: getGetCreatorDashboardQueryKey() } });
  const { data: invites = [] } = useListMyInvites({ status: "pending" }, { query: { queryKey: getListMyInvitesQueryKey({ status: "pending" }) } });

  return (
    <CreatorLayout>
      <div data-testid="page-creator-dashboard">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your performance at a glance</p>
          </div>
          {invites.length > 0 && (
            <Link href="/invites">
              <Button size="sm" className="h-9 rounded-xl font-semibold gap-1.5 animate-pulse" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}>
                <Inbox className="h-4 w-4" /> {invites.length} new invite{invites.length > 1 ? "s" : ""}
              </Button>
            </Link>
          )}
        </div>

        {/* Pending invites banner */}
        {invites.length > 0 && (
          <Link href="/invites">
            <div className="mb-5 rounded-2xl p-4 cursor-pointer flex items-center gap-4" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.12), rgba(29,207,179,0.06))", border: "1px solid rgba(29,207,179,0.3)" }}>
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                <Inbox className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm" style={{ color: "#0FA88E" }}>You have {invites.length} pending campaign invite{invites.length > 1 ? "s" : ""}!</div>
                <div className="text-xs text-muted-foreground">Review and accept to start earning</div>
              </div>
              <ArrowRight className="h-4 w-4" style={{ color: "#1DCFB3" }} />
            </div>
          </Link>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) : (
            <>
              <StatCard label="Total invites" value={data?.totalInvites ?? 0} icon={<Inbox className="h-4 w-4" />} gradient="linear-gradient(135deg, #8B5CF6, #6D28D9)" testid="stat-invites" />
              <StatCard label="Campaigns done" value={data?.completedCampaigns ?? 0} icon={<CheckCircle2 className="h-4 w-4" />} gradient="linear-gradient(135deg, #1DCFB3, #0FA88E)" testid="stat-completed" />
              <StatCard label="Total earnings" value={`$${(data?.totalEarnings ?? 0).toLocaleString()}`} icon={<DollarSign className="h-4 w-4" />} gradient="linear-gradient(135deg, #3B82F6, #2563EB)" testid="stat-earnings" />
              <StatCard label="Gems balance" value={data?.gems ?? 0} icon={<Gem className="h-4 w-4" />} gradient="linear-gradient(135deg, #F59E0B, #D97706)" testid="stat-gems" />
            </>
          )}
        </div>

        {/* Reach & engagement */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,207,179,0.12)" }}>
                <Eye className="h-4 w-4" style={{ color: "#1DCFB3" }} />
              </div>
              <div>
                <div className="text-xl font-extrabold">{(data?.totalReach ?? 0).toLocaleString()}</div>
                <div className="text-xs font-medium text-muted-foreground">Total reach</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(139,92,246,0.12)" }}>
                <ThumbsUp className="h-4 w-4" style={{ color: "#8B5CF6" }} />
              </div>
              <div>
                <div className="text-xl font-extrabold">{(data?.totalEngagement ?? 0).toLocaleString()}</div>
                <div className="text-xs font-medium text-muted-foreground">Engagement</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent invitations */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2 pt-5 px-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold">Recent Invitations</CardTitle>
              <Link href="/invites">
                <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#1DCFB3" }}>
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-0 pb-2">
            {isLoading ? <div className="px-5 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> :
              !data?.recentInvites?.length ? (
                <div className="px-5 py-10 text-center">
                  <Megaphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No invitations yet — stay active and brands will find you.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/60">
                  {data.recentInvites.map(inv => (
                    <Link key={inv.id} href={`/invites/${inv.id}`}>
                      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors" data-testid={`invite-row-${inv.id}`}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                          {inv.campaign?.name?.[0]?.toUpperCase() ?? "C"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">{inv.campaign?.name}</div>
                          <div className="text-xs text-muted-foreground">{inv.campaign?.sponsor}</div>
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              )
            }
          </CardContent>
        </Card>
      </div>
    </CreatorLayout>
  );
}
