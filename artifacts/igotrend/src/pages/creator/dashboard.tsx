import { Link } from "wouter";
import { useGetCreatorDashboard, useListMyInvites, getGetCreatorDashboardQueryKey, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import CreatorLayout from "@/components/layout/creator-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Inbox, DollarSign, Eye, ThumbsUp, Gem, ArrowRight, CheckCircle2, Clock } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", completed: "bg-blue-100 text-blue-700", declined: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export default function CreatorDashboardPage() {
  const { data, isLoading } = useGetCreatorDashboard({ query: { queryKey: getGetCreatorDashboardQueryKey() } });
  const { data: invites = [] } = useListMyInvites({ status: "pending" }, { query: { queryKey: getListMyInvitesQueryKey({ status: "pending" }) } });

  return (
    <CreatorLayout>
      <div data-testid="page-creator-dashboard">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your performance at a glance</p>
          </div>
          {invites.length > 0 && (
            <Link href="/invites">
              <Button size="sm" className="gap-1.5"><Inbox className="h-4 w-4" /> {invites.length} Pending Invite{invites.length > 1 ? "s" : ""}</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {isLoading ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20" />) : (
            <>
              <Card><CardContent className="p-3 flex items-center gap-2.5">
                <div className="p-2 bg-purple-100 rounded-lg"><Inbox className="h-4 w-4 text-purple-600" /></div>
                <div><div className="text-xl font-bold" data-testid="stat-invites">{data?.totalInvites ?? 0}</div><div className="text-xs text-muted-foreground">Total invites</div></div>
              </CardContent></Card>
              <Card><CardContent className="p-3 flex items-center gap-2.5">
                <div className="p-2 bg-green-100 rounded-lg"><CheckCircle2 className="h-4 w-4 text-green-600" /></div>
                <div><div className="text-xl font-bold" data-testid="stat-completed">{data?.completedCampaigns ?? 0}</div><div className="text-xs text-muted-foreground">Completed</div></div>
              </CardContent></Card>
              <Card><CardContent className="p-3 flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 rounded-lg"><DollarSign className="h-4 w-4 text-blue-600" /></div>
                <div><div className="text-xl font-bold" data-testid="stat-earnings">${(data?.totalEarnings ?? 0).toLocaleString()}</div><div className="text-xs text-muted-foreground">Earnings</div></div>
              </CardContent></Card>
              <Card><CardContent className="p-3 flex items-center gap-2.5">
                <div className="p-2 bg-yellow-100 rounded-lg"><Gem className="h-4 w-4 text-yellow-600" /></div>
                <div><div className="text-xl font-bold" data-testid="stat-gems">{data?.gems ?? 0}</div><div className="text-xs text-muted-foreground">Gems</div></div>
              </CardContent></Card>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div><div className="text-lg font-bold">{(data?.totalReach ?? 0).toLocaleString()}</div><div className="text-xs text-muted-foreground">Total reach</div></div>
          </CardContent></Card>
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            <div><div className="text-lg font-bold">{(data?.totalEngagement ?? 0).toLocaleString()}</div><div className="text-xs text-muted-foreground">Engagement</div></div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Invitations</CardTitle>
              <Link href="/invites"><span className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></span></Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? <div className="p-4 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div> :
              !data?.recentInvites?.length ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No invitations yet</div>
              ) : (
                <div className="divide-y divide-border">
                  {data.recentInvites.map(inv => (
                    <Link key={inv.id} href={`/invites/${inv.id}`}>
                      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer" data-testid={`invite-row-${inv.id}`}>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{inv.campaign?.name}</div>
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
