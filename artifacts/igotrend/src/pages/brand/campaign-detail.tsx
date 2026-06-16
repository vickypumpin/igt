import { useParams } from "wouter";
import { useGetCampaign, useGetCampaignSubmissions, useGetCampaignInvites, getGetCampaignQueryKey, getGetCampaignInvitesQueryKey, getGetCampaignSubmissionsQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, FileCheck, Calendar, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:   { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  completed: { bg: "rgba(99,102,241,0.12)", text: "#4F46E5", dot: "#6366F1" },
  declined:  { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />{status}</span>;
}

export default function CampaignDetailPage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const { data: campaign, isLoading } = useGetCampaign(id, { query: { enabled: !!id, queryKey: getGetCampaignQueryKey(id) } });
  const { data: invites = [] } = useGetCampaignInvites(id, { query: { enabled: !!id, queryKey: getGetCampaignInvitesQueryKey(id) } });
  const { data: submissions = [] } = useGetCampaignSubmissions(id, { query: { enabled: !!id, queryKey: getGetCampaignSubmissionsQueryKey(id) } });

  if (isLoading) return <BrandLayout><div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}</div></BrandLayout>;
  if (!campaign) return <BrandLayout><div className="text-muted-foreground py-12 text-center">Campaign not found</div></BrandLayout>;

  const c = campaign as typeof campaign & { kpis?: string; dos?: string; donts?: string; postCaptionText?: string; handlesHash?: string };

  return (
    <BrandLayout>
      <div data-testid="page-campaign-detail">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-extrabold">{campaign.name}</h1>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="text-sm text-muted-foreground">Sponsored by <span className="font-semibold text-foreground">{campaign.sponsor}</span></p>
          </div>
          <Link href="/campaigns/new">
            <Button variant="outline" size="sm" className="rounded-xl">Duplicate</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Start date", value: campaign.startDate, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", Icon: Calendar },
            { label: "End date", value: campaign.endDate, gradient: "linear-gradient(135deg, #3B82F6, #2563EB)", Icon: Calendar },
            { label: "Creators", value: `${invites.length} / ${campaign.noOfCreators}`, gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", Icon: Users },
            { label: "Submissions", value: submissions.length, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", Icon: FileCheck },
          ].map(({ label, value, gradient, Icon }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="text-sm font-bold">{value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="invites">
          <TabsList className="mb-5 h-10 rounded-xl p-1">
            <TabsTrigger value="invites" className="rounded-lg text-sm" data-testid="tab-invites">Creators ({invites.length})</TabsTrigger>
            <TabsTrigger value="submissions" className="rounded-lg text-sm" data-testid="tab-submissions">Submissions ({submissions.length})</TabsTrigger>
            <TabsTrigger value="brief" className="rounded-lg text-sm" data-testid="tab-brief">Brief</TabsTrigger>
          </TabsList>

          <TabsContent value="invites">
            {!invites.length ? (
              <div className="text-center py-14 text-muted-foreground text-sm rounded-2xl border border-border/60">
                No creators invited yet. <Link href="/creators"><span className="font-semibold hover:underline cursor-pointer" style={{ color: "#1DCFB3" }}>Browse creators →</span></Link>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                    <tr>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creator</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Badge</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Invited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {invites.map(inv => (
                      <tr key={inv.id} className="hover:bg-muted/30" data-testid={`invite-row-${inv.id}`}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <Avatar className="h-8 w-8"><AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{inv.creator?.firstName?.[0]}{inv.creator?.lastName?.[0]}</AvatarFallback></Avatar>
                            <div>
                              <div className="font-semibold text-sm">{inv.creator?.firstName} {inv.creator?.lastName}</div>
                              <div className="text-xs text-muted-foreground">@{inv.creator?.userName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: "rgba(139,92,246,0.12)", color: "#7C3AED" }}>{inv.creator?.badge ?? "—"}</span></td>
                        <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(inv.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="submissions">
            {!submissions.length ? (
              <div className="text-center py-14 text-muted-foreground text-sm rounded-2xl border border-border/60">No submissions yet</div>
            ) : (
              <div className="space-y-3">
                {submissions.map(s => (
                  <div key={s.id} className="bg-white rounded-2xl border border-border/60 p-4 flex items-start gap-3 shadow-sm" data-testid={`submission-${s.id}`}>
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{s.creator?.firstName?.[0]}{s.creator?.lastName?.[0]}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-sm">{s.creator?.firstName} {s.creator?.lastName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: "rgba(29,207,179,0.1)", color: "#0FA88E" }}>{s.platform}</span>
                        <StatusBadge status={s.status} />
                      </div>
                      <a href={s.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:underline" style={{ color: "#1DCFB3" }}><ExternalLink className="h-3 w-3" />{s.screenshotUrl}</a>
                      {(s.views || s.likes) && <div className="text-xs text-muted-foreground mt-1">{s.views?.toLocaleString()} views · {s.likes?.toLocaleString()} likes</div>}
                    </div>
                    <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="brief">
            <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm space-y-5">
              {campaign.description && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Description</div><p className="text-sm leading-relaxed">{campaign.description}</p></div>}
              {c.kpis && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">KPIs</div><p className="text-sm leading-relaxed">{c.kpis}</p></div>}
              {c.postCaptionText && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Caption Guide</div><p className="text-sm leading-relaxed">{c.postCaptionText}</p></div>}
              {c.handlesHash && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest">Handles & Hashtags</div><p className="text-sm leading-relaxed">{c.handlesHash}</p></div>}
              {c.dos && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest" style={{ color: "#059669" }}>Do's ✓</div><p className="text-sm leading-relaxed">{c.dos}</p></div>}
              {c.donts && <div><div className="text-xs font-bold text-muted-foreground mb-2 uppercase tracking-widest" style={{ color: "#DC2626" }}>Don'ts ✗</div><p className="text-sm leading-relaxed">{c.donts}</p></div>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BrandLayout>
  );
}
