import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Megaphone, Clock, TrendingUp, DollarSign, Activity } from "lucide-react";

interface DashboardData {
  agency: {
    id: number; name: string; billingMode: string;
    commissionRate: string; subscriptionStatus: string;
  };
  clientCount: number;
  pendingInvites: number;
  activeCampaigns: number;
  totalCampaigns: number;
  monthlySpend: number;
  totalCommissionOwed: number;
}

interface CampaignRow {
  id: number; name: string; sponsor: string | null; status: string | null;
  type: string | null; noOfCreators: number | null; startDate: string | null;
  submissionsCount: number; brandId: number | null; createdAt: string;
  client: { companyName: string | null; firstName: string | null; lastName: string | null } | null;
}

const PURPLE = "#6B2FCE";

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  active:    { bg: "rgba(16,185,129,0.12)", color: "#059669" },
  draft:     { bg: "rgba(107,47,206,0.1)",  color: "#6B2FCE" },
  completed: { bg: "rgba(100,116,139,0.12)", color: "#475569" },
  paused:    { bg: "rgba(245,158,11,0.12)", color: "#D97706" },
};

export default function AgencyDashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/agency/dashboard"],
    queryFn: () => customFetch("/api/agency/dashboard"),
  });

  const { data: recentCampaigns = [], isLoading: campaignsLoading } = useQuery<CampaignRow[]>({
    queryKey: ["/agency/campaigns"],
    queryFn: () => customFetch("/api/agency/campaigns"),
  });

  const fmt = (n: number) => n >= 1000 ? `₦${(n/1000).toFixed(1)}k` : `₦${n.toLocaleString()}`;
  const stats = data ? [
    { label: "Active Clients", value: data.clientCount, icon: Users, gradient: "linear-gradient(135deg, #6B2FCE, #8B5CF6)" },
    { label: "Pending Invites", value: data.pendingInvites, icon: Clock, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
    { label: "Active Campaigns", value: data.activeCampaigns, icon: Megaphone, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
    { label: "Monthly Spend", value: fmt(data.monthlySpend), icon: TrendingUp, gradient: "linear-gradient(135deg, #EF4444, #DC2626)" },
    { label: "Commission Owed", value: fmt(data.totalCommissionOwed), icon: DollarSign, gradient: "linear-gradient(135deg, #FF8C42, #E56B1F)" },
  ] : [];

  return (
    <AgencyLayout>
      <div data-testid="page-agency-dashboard">
        <div className="mb-6">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48 mb-1" />
              <Skeleton className="h-4 w-64" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold">{data?.agency.name ?? "Agency Dashboard"}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your clients and campaigns from one place</p>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
            {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
            {stats.map(({ label, value, icon: Icon, gradient }) => (
              <div key={label} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: gradient }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-extrabold">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Campaign Activity */}
        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden mb-5" data-testid="recent-campaign-activity">
          <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #6B2FCE, #8B5CF6)" }}>
              <Activity className="h-4 w-4" />
            </div>
            <div className="font-bold text-sm">Recent Campaign Activity</div>
          </div>
          {campaignsLoading ? (
            <div className="p-4 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : !recentCampaigns.length ? (
            <div className="py-10 text-center">
              <Megaphone className="h-7 w-7 mx-auto mb-2 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No campaigns yet — invite clients to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Campaign</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submissions</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {recentCampaigns.slice(0, 8).map(c => {
                    const st = STATUS_COLORS[c.status ?? ""] ?? { bg: "rgba(100,116,139,0.1)", color: "#64748B" };
                    const clientName = (c.client?.companyName ?? `${c.client?.firstName ?? ""} ${c.client?.lastName ?? ""}`.trim()) || "—";
                    return (
                      <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-semibold">{c.name}</div>
                          {c.sponsor && <div className="text-xs text-muted-foreground">{c.sponsor}</div>}
                        </td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{clientName}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize" style={{ background: st.bg, color: st.color }}>{c.status ?? "—"}</span>
                        </td>
                        <td className="px-5 py-3.5 text-xs font-medium">{c.submissionsCount}</td>
                        <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center" style={{ background: PURPLE }}>
                <Users className="h-4 w-4" />
              </div>
              <div className="font-bold text-sm">Getting Started</div>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white mt-0.5 flex-shrink-0" style={{ background: PURPLE }}>1</span>
                <span>Go to <strong className="text-foreground">Clients</strong> and invite brand accounts to your agency</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white mt-0.5 flex-shrink-0" style={{ background: PURPLE }}>2</span>
                <span>Once a client accepts, their campaigns appear in your <strong className="text-foreground">Campaigns</strong> view</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white mt-0.5 flex-shrink-0" style={{ background: PURPLE }}>3</span>
                <span>Revenue is earned via commission on payout approvals or a monthly subscription fee</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl text-white flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="font-bold text-sm">Billing Summary</div>
            </div>
            {isLoading ? <Skeleton className="h-24" /> : data && (
              <div className="space-y-2.5">
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-xs text-muted-foreground">Model</span>
                  <span className="text-xs font-semibold capitalize">{data.agency.billingMode}</span>
                </div>
                {data.agency.billingMode === "commission" && (
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-xs text-muted-foreground">Commission Rate</span>
                    <span className="text-xs font-semibold">{data.agency.commissionRate}%</span>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {data.agency.subscriptionStatus ?? "Active"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AgencyLayout>
  );
}
