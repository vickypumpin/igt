import { useGetBrandDashboard, useListCampaigns, getGetBrandDashboardQueryKey, getListCampaignsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Megaphone, Users, DollarSign, TrendingUp, ArrowRight, Plus } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    declined: "bg-red-100 text-red-800",
  };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export default function BrandDashboardPage() {
  const { data, isLoading } = useGetBrandDashboard({ query: { queryKey: getGetBrandDashboardQueryKey() } });

  return (
    <BrandLayout>
      <div data-testid="page-brand-dashboard">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Campaign performance overview</p>
          </div>
          <Link href="/campaigns/new">
            <Button size="sm" data-testid="button-new-campaign"><Plus className="h-4 w-4 mr-1.5" /> New Campaign</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />) : (
            <>
              <Card data-testid="stat-active-campaigns">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg"><Megaphone className="h-4 w-4 text-green-600" /></div>
                    <div>
                      <div className="text-2xl font-bold">{data?.activeCampaigns ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Active campaigns</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-pending-campaigns">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-100 rounded-lg"><Megaphone className="h-4 w-4 text-yellow-600" /></div>
                    <div>
                      <div className="text-2xl font-bold">{data?.pendingCampaigns ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Pending approval</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-creators-invited">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg"><Users className="h-4 w-4 text-purple-600" /></div>
                    <div>
                      <div className="text-2xl font-bold">{data?.totalCreatorsInvited ?? 0}</div>
                      <div className="text-xs text-muted-foreground">Creators invited</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card data-testid="stat-total-spend">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="h-4 w-4 text-blue-600" /></div>
                    <div>
                      <div className="text-2xl font-bold">${(data?.totalSpend ?? 0).toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Total spend</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Recent Campaigns</CardTitle>
                  <Link href="/campaigns"><span className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></span></Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <div className="p-4 space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
                  !data?.recentCampaigns?.length ? (
                    <div className="p-8 text-center text-muted-foreground text-sm">No campaigns yet. <Link href="/campaigns/new"><span className="text-primary cursor-pointer hover:underline">Create your first one.</span></Link></div>
                  ) : (
                    <div className="divide-y divide-border">
                      {data.recentCampaigns.map(c => (
                        <Link key={c.id} href={`/campaigns/${c.id}`}>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`campaign-row-${c.id}`}>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">{c.name}</div>
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

          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold">Top Creators</CardTitle>
                  <Link href="/creators"><span className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">Explore <ArrowRight className="h-3 w-3" /></span></Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? <div className="p-4 space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-8" />)}</div> :
                  !data?.topCreators?.length ? (
                    <div className="p-6 text-center text-muted-foreground text-xs">No creators yet</div>
                  ) : (
                    <div className="divide-y divide-border">
                      {data.topCreators.map(c => (
                        <Link key={c.id} href={`/creators/${c.id}`}>
                          <div className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors" data-testid={`creator-item-${c.id}`}>
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="text-xs">{c.firstName[0]}{c.lastName[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium truncate">@{c.userName}</div>
                              <div className="text-xs text-muted-foreground capitalize">{c.badge ?? "Creator"}</div>
                            </div>
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
