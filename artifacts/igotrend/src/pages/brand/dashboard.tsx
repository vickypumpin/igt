import { useGetBrandDashboard, getGetBrandDashboardQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Megaphone, Users, DollarSign, TrendingUp, ArrowRight, Plus, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

interface StatCardProps { label: string; value: string | number; icon: React.ReactNode; gradient: string; trend?: string }
function StatCard({ label, value, icon, gradient, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
            {icon}
          </div>
          {trend && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{trend}</span>}
        </div>
        <div className="text-2xl font-extrabold text-foreground">{value}</div>
        <div className="text-xs font-medium text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function BrandDashboardPage() {
  const { data, isLoading } = useGetBrandDashboard({ query: { queryKey: getGetBrandDashboardQueryKey() } });

  return (
    <BrandLayout>
      <div data-testid="page-brand-dashboard">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Track your campaign performance</p>
          </div>
          <Link href="/campaigns/new">
            <Button size="sm" className="h-9 rounded-xl font-semibold gap-1.5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="button-new-campaign">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </Link>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
          {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />) : (
            <>
              <StatCard label="Active campaigns" value={data?.activeCampaigns ?? 0} icon={<Megaphone className="h-5 w-5" />} gradient="linear-gradient(135deg, #1DCFB3, #0FA88E)" trend="+2" data-testid="stat-active-campaigns" />
              <StatCard label="Pending approval" value={data?.pendingCampaigns ?? 0} icon={<Clock className="h-5 w-5" />} gradient="linear-gradient(135deg, #F59E0B, #D97706)" data-testid="stat-pending-campaigns" />
              <StatCard label="Creators invited" value={data?.totalCreatorsInvited ?? 0} icon={<Users className="h-5 w-5" />} gradient="linear-gradient(135deg, #8B5CF6, #6D28D9)" data-testid="stat-creators-invited" />
              <StatCard label="Total spend" value={`$${(data?.totalSpend ?? 0).toLocaleString()}`} icon={<DollarSign className="h-5 w-5" />} gradient="linear-gradient(135deg, #3B82F6, #2563EB)" data-testid="stat-total-spend" />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent campaigns */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Recent Campaigns</CardTitle>
                  <Link href="/campaigns">
                    <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#1DCFB3" }}>
                      View all <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-2">
                {isLoading ? <div className="px-5 space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> :
                  !data?.recentCampaigns?.length ? (
                    <div className="px-5 py-10 text-center">
                      <Megaphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-30" />
                      <p className="text-sm text-muted-foreground">No campaigns yet.</p>
                      <Link href="/campaigns/new"><span className="text-sm font-semibold hover:underline cursor-pointer" style={{ color: "#1DCFB3" }}>Create your first one →</span></Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {data.recentCampaigns.map(c => (
                        <Link key={c.id} href={`/campaigns/${c.id}`}>
                          <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 cursor-pointer transition-colors" data-testid={`campaign-row-${c.id}`}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                              {c.name?.[0]?.toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold truncate">{c.name}</div>
                              <div className="text-xs text-muted-foreground">{c.sponsor} · {c.invitesCount} creators</div>
                            </div>
                            <StatusBadge status={c.status} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                }
              </CardContent>
            </Card>
          </div>

          {/* Top creators */}
          <div>
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-bold">Top Creators</CardTitle>
                  <Link href="/creators">
                    <span className="text-xs font-semibold flex items-center gap-1 hover:underline" style={{ color: "#1DCFB3" }}>
                      Explore <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="px-0 pb-2">
                {isLoading ? <div className="px-5 space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                  !data?.topCreators?.length ? (
                    <div className="px-5 py-8 text-center text-sm text-muted-foreground">No creators yet</div>
                  ) : (
                    <div className="divide-y divide-border/60">
                      {data.topCreators.map((c, idx) => (
                        <Link key={c.id} href={`/creators/${c.id}`}>
                          <div className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 cursor-pointer transition-colors" data-testid={`creator-item-${c.id}`}>
                            <div className="text-xs font-bold text-muted-foreground w-4 text-center">{idx + 1}</div>
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="text-xs font-bold" style={{ background: idx === 0 ? "linear-gradient(135deg, #1DCFB3, #0FA88E)" : idx === 1 ? "linear-gradient(135deg, #8B5CF6, #6D28D9)" : "linear-gradient(135deg, #F59E0B, #D97706)", color: "white" }}>{c.firstName[0]}{c.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold truncate">@{c.userName}</div>
                              <div className="text-xs text-muted-foreground capitalize">{c.badge ?? "Creator"}</div>
                            </div>
                            <TrendingUp className="h-3.5 w-3.5" style={{ color: "#1DCFB3" }} />
                          </div>
                        </Link>
                      ))}
                    </div>
                  )
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}
