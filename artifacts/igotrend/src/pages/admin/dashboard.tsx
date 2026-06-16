import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  DollarSign, TrendingUp, Wallet, Megaphone, Users, Clock,
  CheckCircle, XCircle, Inbox, Eye, ChevronDown,
  ShieldCheck, BookOpen, Gift,
} from "lucide-react";

interface MetricCardProps {
  label: string;
  primary: string | number;
  primaryLabel: string;
  secondary: string | number;
  secondaryLabel: string;
  gradient: string;
  icon: React.ComponentType<{ className?: string }>;
  change?: string;
}

function MetricCard({ label, primary, primaryLabel, secondary, secondaryLabel, gradient, icon: Icon, change }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: gradient }}>
          <Icon className="h-4 w-4" />
        </div>
        {change && <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{change}</span>}
      </div>
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">{label}</div>
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 rounded-xl p-2.5">
          <div className="text-lg font-extrabold text-foreground">{primary}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{primaryLabel}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-2.5">
          <div className="text-lg font-extrabold text-foreground">{secondary}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{secondaryLabel}</div>
        </div>
      </div>
    </div>
  );
}

const CREATE_CARDS = [
  {
    title: "Create Campaign",
    desc: "Launch a new influencer marketing campaign for brands.",
    href: "/admin/campaigns",
    btnLabel: "Get Started",
    btnStyle: { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
    bg: "linear-gradient(135deg, #1a0a3e 0%, #2d1569 100%)",
    icon: Megaphone,
  },
  {
    title: "Community Guidelines",
    desc: "Review and update the platform community guidelines.",
    href: "/admin/legal",
    btnLabel: "Read More",
    btnStyle: { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" },
    bg: "linear-gradient(135deg, #0d3d35 0%, #0FA88E 100%)",
    icon: BookOpen,
  },
  {
    title: "Reward Trenders",
    desc: "Send gem rewards and process creator payouts.",
    href: "/admin/payouts",
    btnLabel: "Get Started",
    btnStyle: { background: "linear-gradient(135deg, #F59E0B, #D97706)" },
    bg: "linear-gradient(135deg, #1a0a3e 0%, #6B2FCE 100%)",
    icon: Gift,
  },
];

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard({ query: { queryKey: getGetAdminDashboardQueryKey() } });

  const metrics: MetricCardProps[] = [
    {
      label: "Revenue",
      primary: `₦${(data?.totalRevenue ?? 0).toLocaleString()}`,
      primaryLabel: "All Time",
      secondary: `₦${(data?.currentMonthRevenue ?? 0).toLocaleString()}`,
      secondaryLabel: "Current Month",
      gradient: "linear-gradient(135deg, #22C55E, #16A34A)",
      icon: DollarSign,
    },
    {
      label: "Accounts",
      primary: data?.totalBrands ?? 0,
      primaryLabel: "Brands",
      secondary: data?.totalCreators ?? 0,
      secondaryLabel: "Creators",
      gradient: "linear-gradient(135deg, #3B82F6, #2563EB)",
      icon: Users,
    },
    {
      label: "Payouts",
      primary: `₦${(data?.totalPayout ?? 0).toLocaleString()}`,
      primaryLabel: "Total Paid",
      secondary: "—",
      secondaryLabel: "Current Month",
      gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
      icon: Wallet,
    },
    {
      label: "Campaigns",
      primary: data?.activeCampaigns ?? 0,
      primaryLabel: "Active",
      secondary: data?.completedCampaigns ?? 0,
      secondaryLabel: "Completed",
      gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)",
      icon: Megaphone,
    },
    {
      label: "Verification",
      primary: data?.pendingVerifications ?? 0,
      primaryLabel: "Pending",
      secondary: data?.pendingSubmissions ?? 0,
      secondaryLabel: "Submissions",
      gradient: "linear-gradient(135deg, #F59E0B, #D97706)",
      icon: ShieldCheck,
    },
    {
      label: "Campaigns Queue",
      primary: data?.pendingCampaigns ?? 0,
      primaryLabel: "Pending",
      secondary: data?.activeCampaigns ?? 0,
      secondaryLabel: "Active",
      gradient: "linear-gradient(135deg, #FF8C42, #E47128)",
      icon: Clock,
    },
  ];

  return (
    <AdminLayout>
      <div data-testid="page-admin-dashboard">
        {/* Page heading */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">iGoTrend platform overview</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/messages">
              <Button size="sm" variant="outline" className="h-9 rounded-xl gap-2 font-semibold">
                <Inbox className="h-4 w-4" /> Messages
              </Button>
            </Link>
          </div>
        </div>

        {/* Campaign Overview — 6 metric cards in 2 rows of 3 */}
        <div className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Campaign Overview</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metrics.map((m) => (
                <MetricCard key={m.label} {...m} />
              ))}
            </div>
          )}
        </div>

        {/* Create Campaigns section — 3 cards */}
        <div className="mb-7">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {CREATE_CARDS.map((card) => (
              <Link key={card.title} href={card.href}>
                <div
                  className="relative overflow-hidden rounded-2xl p-6 cursor-pointer hover:opacity-95 transition-opacity"
                  style={{ background: card.bg, minHeight: 160 }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
                    <card.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-bold text-white text-base mb-1.5">{card.title}</div>
                  <div className="text-white/60 text-xs leading-relaxed mb-4">{card.desc}</div>
                  <button
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                    style={card.btnStyle}
                  >
                    {card.btnLabel}
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Review Request section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Review Requests</h2>
            <div className="flex items-center gap-3">
              <select className="text-xs rounded-xl border border-gray-200 px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#FF8C42]">
                <option>All Campaigns</option>
              </select>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Show</span>
                <select className="text-xs rounded-lg border border-gray-200 px-2 py-1 text-gray-600 bg-white focus:outline-none">
                  <option>10</option>
                  <option>25</option>
                  <option>50</option>
                </select>
                <span className="text-xs text-muted-foreground">entries</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Trenders</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Level</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Platform</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Accept Status</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Payment</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Payout</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground text-sm">
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
