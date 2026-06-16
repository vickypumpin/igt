import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Megaphone, Clock, TrendingUp } from "lucide-react";

interface DashboardData {
  agency: {
    id: number; name: string; billingMode: string;
    commissionRate: string; subscriptionStatus: string;
  };
  clientCount: number;
  pendingInvites: number;
}

const PURPLE = "#6B2FCE";

export default function AgencyDashboardPage() {
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/agency/dashboard"],
    queryFn: () => customFetch("/api/agency/dashboard"),
  });

  const stats = data ? [
    { label: "Active Clients", value: data.clientCount, icon: Users, gradient: "linear-gradient(135deg, #6B2FCE, #8B5CF6)" },
    { label: "Pending Invites", value: data.pendingInvites, icon: Clock, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
    { label: "Billing Mode", value: data.agency.billingMode === "commission" ? "Commission" : "Subscription", icon: TrendingUp, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
    { label: "Commission Rate", value: data.agency.billingMode === "commission" ? `${data.agency.commissionRate}%` : "—", icon: Megaphone, gradient: "linear-gradient(135deg, #EF4444, #DC2626)" },
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
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
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
