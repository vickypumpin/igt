import { useQuery } from "@tanstack/react-query";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Users, Megaphone, DollarSign, TrendingUp, CheckCircle, Clock, Download } from "lucide-react";

const PURPLE  = "#6B2FCE";
const TEAL    = "#1DCFB3";
const ORANGE  = "#FF8C42";
const RED     = "#EF4444";
const BLUE    = "#3B82F6";

function downloadCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map(r => headers.map(h => escape(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white" style={{ background: color }}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

interface AgencyDashboard {
  clientCount: number;
  pendingInvites: number;
  activeCampaigns: number;
  totalCampaigns: number;
  monthlySpend: number;
  totalCommissionOwed: number;
}

interface Campaign {
  id: number; name: string; sponsor: string; status: string; type: string;
  noOfCreators: number; startDate: string; endDate: string; submissionsCount: number;
  client?: { companyName?: string; firstName?: string; lastName?: string; email?: string } | null;
}

export default function AgencyReportsPage() {
  const { data: dash, isLoading: dashLoading } = useQuery<AgencyDashboard>({
    queryKey: ["agency-dashboard"],
    queryFn: () => fetch("/api/agency/dashboard", { credentials: "include" }).then(r => r.json()),
  });

  const { data: campaigns = [], isLoading: campsLoading } = useQuery<Campaign[]>({
    queryKey: ["agency-campaigns"],
    queryFn: () => fetch("/api/agency/campaigns", { credentials: "include" }).then(r => r.json()),
  });

  const isLoading = dashLoading || campsLoading;

  const clientCount    = Number(dash?.clientCount ?? 0);
  const activeCampaigns = Number(dash?.activeCampaigns ?? 0);
  const totalCampaigns  = Number(dash?.totalCampaigns ?? 0);
  const monthlySpend    = Number(dash?.monthlySpend ?? 0);
  const commission      = Number(dash?.totalCommissionOwed ?? 0);
  const completedCampaigns = campaigns.filter(c => c.status === "completed").length;
  const pendingCampaigns   = campaigns.filter(c => c.status === "pending").length;

  const statusData = [
    { name: "Active",    value: activeCampaigns,   fill: TEAL },
    { name: "Completed", value: completedCampaigns, fill: PURPLE },
    { name: "Pending",   value: pendingCampaigns,   fill: ORANGE },
  ].filter(s => s.value > 0);

  const barData = [
    { name: "Active",    campaigns: activeCampaigns },
    { name: "Completed", campaigns: completedCampaigns },
    { name: "Pending",   campaigns: pendingCampaigns },
  ];

  const clientSpendData = campaigns.reduce((acc: Record<string, { name: string; campaigns: number; submissions: number }>, c) => {
    const rawKey = c.client?.companyName ?? `${c.client?.firstName ?? ""} ${c.client?.lastName ?? ""}`.trim();
    const key = rawKey || "Unknown";
    if (!acc[key]) acc[key] = { name: key, campaigns: 0, submissions: 0 };
    acc[key].campaigns++;
    acc[key].submissions += Number(c.submissionsCount ?? 0);
    return acc;
  }, {} as Record<string, { name: string; campaigns: number; submissions: number }>);
  const clientActivityData = Object.values(clientSpendData).slice(0, 6);

  function handleDownloadCampaigns() {
    downloadCSV("agency-campaign-report.csv", campaigns.map(c => ({
      Campaign: c.name,
      Client: (c.client?.companyName ?? `${c.client?.firstName ?? ""} ${c.client?.lastName ?? ""}`.trim()) || "Unknown",
      Status: c.status,
      Type: c.type,
      Creators: c.noOfCreators,
      Submissions: c.submissionsCount,
      "Start Date": c.startDate ? new Date(c.startDate).toLocaleDateString() : "",
      "End Date": c.endDate ? new Date(c.endDate).toLocaleDateString() : "",
    })));
  }

  function handleDownloadSummary() {
    downloadCSV("agency-summary-report.csv", [
      { Metric: "Total Clients",       Value: clientCount },
      { Metric: "Active Campaigns",    Value: activeCampaigns },
      { Metric: "Total Campaigns",     Value: totalCampaigns },
      { Metric: "Completed Campaigns", Value: completedCampaigns },
      { Metric: "Pending Campaigns",   Value: pendingCampaigns },
      { Metric: "Monthly Client Spend (₦)", Value: monthlySpend },
      { Metric: "Total Commission Owed (₦)", Value: commission },
    ]);
  }

  if (isLoading) {
    return (
      <AgencyLayout>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      </AgencyLayout>
    );
  }

  return (
    <AgencyLayout>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Agency Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Performance overview across all your clients and campaigns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: PURPLE }}
          >
            <Download className="h-4 w-4" /> Summary CSV
          </button>
          <button
            onClick={handleDownloadCampaigns}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors bg-white"
          >
            <Download className="h-4 w-4" /> Campaigns CSV
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Clients"      value={clientCount}     icon={Users}      color={PURPLE} sub={`${dash?.pendingInvites ?? 0} pending invites`} />
        <StatCard label="Total Campaigns"    value={totalCampaigns}  icon={Megaphone}  color={TEAL}   sub={`${activeCampaigns} active`} />
        <StatCard label="Monthly Spend"      value={`₦${monthlySpend.toLocaleString()}`}  icon={DollarSign} color={BLUE}   sub="client activity this month" />
        <StatCard label="Commission Earned"  value={`₦${commission.toLocaleString()}`}    icon={TrendingUp} color={ORANGE} sub="total commission owed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Campaign status bar chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Campaign Status</h3>
          <p className="text-xs text-muted-foreground mb-5">Breakdown of campaign states across all clients</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="campaigns" name="Campaigns" radius={[4, 4, 0, 0]}>
                {barData.map((_, i) => <Cell key={i} fill={[TEAL, PURPLE, ORANGE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status pie */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Status Share</h3>
          <p className="text-xs text-muted-foreground mb-5">Proportion of campaigns by state</p>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No campaign data yet</div>
          ) : (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={200}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {statusData.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: s.fill }} />
                      <span className="text-sm text-gray-600">{s.name}</span>
                    </div>
                    <span className="text-sm font-bold">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress bars */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="font-bold text-gray-900 mb-5">Status Breakdown</h3>
        <div className="space-y-4">
          {[
            { label: "Active",    value: activeCampaigns,   icon: TrendingUp,  color: TEAL },
            { label: "Pending",   value: pendingCampaigns,  icon: Clock,       color: ORANGE },
            { label: "Completed", value: completedCampaigns, icon: CheckCircle, color: PURPLE },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  <span className="text-sm font-medium text-gray-700">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {s.value}
                  {totalCampaigns > 0 && <span className="text-xs text-gray-400 font-normal ml-1">({Math.round((s.value / totalCampaigns) * 100)}%)</span>}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: totalCampaigns > 0 ? `${(s.value / totalCampaigns) * 100}%` : "0%", background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client activity chart */}
      {clientActivityData.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-1">Activity by Client</h3>
          <p className="text-xs text-muted-foreground mb-5">Campaigns and submissions per client</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={clientActivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="campaigns"   name="Campaigns"   fill={PURPLE} radius={[4, 4, 0, 0]} />
              <Bar dataKey="submissions" name="Submissions" fill={TEAL}   radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Campaigns table */}
      {campaigns.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">All Client Campaigns</h3>
            <button
              onClick={handleDownloadCampaigns}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Download CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  {["Campaign", "Client", "Status", "Creators", "Submissions"].map(h => (
                    <th key={h} className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c) => {
                  const statusColors: Record<string, string> = { active: TEAL, pending: ORANGE, completed: PURPLE, declined: RED };
                  const clientName = (c.client?.companyName ?? `${c.client?.firstName ?? ""} ${c.client?.lastName ?? ""}`.trim()) || "—";
                  return (
                    <tr key={c.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3">
                        <p className="font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.sponsor}</p>
                      </td>
                      <td className="py-3 text-gray-700">{clientName}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{ background: `${statusColors[c.status] ?? TEAL}18`, color: statusColors[c.status] ?? TEAL }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 text-center">{c.noOfCreators}</td>
                      <td className="py-3 text-center">{c.submissionsCount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AgencyLayout>
  );
}
