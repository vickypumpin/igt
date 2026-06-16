import { useParams } from "wouter";
import { useGetCampaign, useGetCampaignSubmissions, useGetCampaignInvites, getGetCampaignQueryKey, getGetCampaignInvitesQueryKey, getGetCampaignSubmissionsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileCheck, Calendar, Target } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", completed: "bg-blue-100 text-blue-700", declined: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);

  const { data: campaign, isLoading } = useGetCampaign(id, { query: { enabled: !!id, queryKey: getGetCampaignQueryKey(id) } });
  const { data: invites = [] } = useGetCampaignInvites(id, { query: { enabled: !!id, queryKey: getGetCampaignInvitesQueryKey(id) } });
  const { data: submissions = [] } = useGetCampaignSubmissions(id, { query: { enabled: !!id, queryKey: getGetCampaignSubmissionsQueryKey(id) } });

  if (isLoading) return <BrandLayout><div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16" />)}</div></BrandLayout>;
  if (!campaign) return <BrandLayout><div className="text-muted-foreground">Campaign not found</div></BrandLayout>;

  const c = campaign as typeof campaign & { kpis?: string; dos?: string; donts?: string; postCaptionText?: string; handlesHash?: string };

  return (
    <BrandLayout>
      <div data-testid="page-campaign-detail">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold">{campaign.name}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-sm text-muted-foreground">Sponsored by {campaign.sponsor}</p>
          </div>
          <Link href="/campaigns/new">
            <Button variant="outline" size="sm">Duplicate</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/10 rounded"><Calendar className="h-4 w-4 text-primary" /></div>
            <div><div className="text-xs text-muted-foreground">Start</div><div className="text-sm font-medium">{campaign.startDate}</div></div>
          </CardContent></Card>
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <div className="p-1.5 bg-primary/10 rounded"><Calendar className="h-4 w-4 text-primary" /></div>
            <div><div className="text-xs text-muted-foreground">End</div><div className="text-sm font-medium">{campaign.endDate}</div></div>
          </CardContent></Card>
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <div className="p-1.5 bg-purple-100 rounded"><Users className="h-4 w-4 text-purple-600" /></div>
            <div><div className="text-xs text-muted-foreground">Creators</div><div className="text-sm font-medium">{invites.length}/{campaign.noOfCreators}</div></div>
          </CardContent></Card>
          <Card><CardContent className="p-3 flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-100 rounded"><FileCheck className="h-4 w-4 text-blue-600" /></div>
            <div><div className="text-xs text-muted-foreground">Submissions</div><div className="text-sm font-medium">{submissions.length}</div></div>
          </CardContent></Card>
        </div>

        <Tabs defaultValue="invites">
          <TabsList className="mb-4">
            <TabsTrigger value="invites" data-testid="tab-invites">Creators ({invites.length})</TabsTrigger>
            <TabsTrigger value="submissions" data-testid="tab-submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="brief" data-testid="tab-brief">Campaign Brief</TabsTrigger>
          </TabsList>

          <TabsContent value="invites">
            {!invites.length ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No creators invited yet. <Link href="/creators"><span className="text-primary cursor-pointer hover:underline">Browse creators</span></Link>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50"><tr>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Creator</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Badge</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Invited</th>
                  </tr></thead>
                  <tbody className="divide-y divide-border">
                    {invites.map(inv => (
                      <tr key={inv.id} data-testid={`invite-row-${inv.id}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{inv.creator?.firstName?.[0]}{inv.creator?.lastName?.[0]}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-medium">{inv.creator?.firstName} {inv.creator?.lastName}</div>
                              <div className="text-xs text-muted-foreground">@{inv.creator?.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 capitalize text-muted-foreground text-xs">{inv.creator?.badge ?? "—"}</td>
                        <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions">
            {!submissions.length ? (
              <div className="text-center py-12 text-muted-foreground text-sm">No submissions yet</div>
            ) : (
              <div className="space-y-2">
                {submissions.map(s => (
                  <div key={s.id} className="border border-border rounded-lg p-4 flex items-start gap-3" data-testid={`submission-${s.id}`}>
                    <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{s.creator?.firstName?.[0]}{s.creator?.lastName?.[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{s.creator?.firstName} {s.creator?.lastName}</span>
                        <span className="text-xs text-muted-foreground capitalize">{s.platform}</span>
                        <StatusBadge status={s.status} />
                      </div>
                      <a href={s.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline truncate block">{s.screenshotUrl}</a>
                      {(s.views || s.likes) && <div className="text-xs text-muted-foreground mt-1">{s.views?.toLocaleString()} views · {s.likes?.toLocaleString()} likes</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="brief">
            <Card>
              <CardContent className="p-5 space-y-4">
                {campaign.description && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Description</div><p className="text-sm">{campaign.description}</p></div>}
                {c.kpis && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">KPIs</div><p className="text-sm">{c.kpis}</p></div>}
                {c.postCaptionText && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Caption Guide</div><p className="text-sm">{c.postCaptionText}</p></div>}
                {c.handlesHash && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Handles & Hashtags</div><p className="text-sm">{c.handlesHash}</p></div>}
                {c.dos && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Do's</div><p className="text-sm">{c.dos}</p></div>}
                {c.donts && <div><div className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Don'ts</div><p className="text-sm">{c.donts}</p></div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
}
