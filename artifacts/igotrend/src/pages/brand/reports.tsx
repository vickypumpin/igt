import { useGetBrandDashboard, getGetBrandDashboardQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Megaphone, Users, DollarSign, TrendingUp, CheckCircle, Clock, XCircle, Download } from "lucide-react";

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

const TEAL = "#1DCFB3";
const PURPLE = "#6B2FCE";
const ORANGE = "#FF8C42";
const RED = "#EF4444";
const BLUE = "#3B82F6";

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
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

export default function BrandReportsPage() {
  const { data: dash, isLoading } = useGetBrandDashboard({
    query: { queryKey: getGetBrandDashboardQueryKey() },
  });

  const d = dash as Record<string, unknown> | undefined;

  const active    = Number(d?.activeCampaigns    ?? 0);
  const pending   = Number(d?.pendingCampaigns   ?? 0);
  const completed = Number(d?.completedCampaigns ?? 0);
  const declined  = Number(d?.declinedCampaigns  ?? 0);
  const total     = active + pending + completed + declined;
  const invited   = Number(d?.totalCreatorsInvited ?? 0);
  const spend     = Number(d?.totalSpend ?? 0);

  const recentCampaigns = (d?.recentCampaigns as Record<string, unknown>[] | undefined) ?? [];

  function handleDownloadSummary() {
    downloadCSV("brand-summary-report.csv", [
      { Metric: "Total Campaigns",      Value: total },
      { Metric: "Active Campaigns",     Value: active },
      { Metric: "Pending Campaigns",    Value: pending },
      { Metric: "Completed Campaigns",  Value: completed },
      { Metric: "Declined Campaigns",   Value: declined },
      { Metric: "Creators Invited",     Value: invited },
      { Metric: "Total Spend (₦)",      Value: spend },
      { Metric: "Completion Rate (%)",  Value: total > 0 ? Math.round((completed / total) * 100) : 0 },
    ]);
  }

  function handleDownloadCampaigns() {
    downloadCSV("brand-campaigns-report.csv", recentCampaigns.map(c => ({
      Campaign: String(c.name ?? ""),
      Sponsor:  String(c.sponsor ?? ""),
      Status:   String(c.status ?? ""),
      Invites:  String(c.invitesCount ?? 0),
      Submissions: String(c.submissionsCount ?? 0),
    })));
  }

  const statusData = [
    { name: "Active",    value: active,    fill: TEAL },
    { name: "Pending",   value: pending,   fill: ORANGE },
    { name: "Completed", value: completed, fill: PURPLE },
    { name: "Declined",  value: declined,  fill: RED },
  ].filter(s => s.value > 0);

  const barData = [
    { name: "Active",    campaigns: active },
    { name: "Pending",   campaigns: pending },
    { name: "Completed", campaigns: completed },
    { name: "Declined",  campaigns: declined },
  ];

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      </BrandLayout>
    );
  }

  return (
    <BrandLayout>
      <div className="mb-6 flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Campaign Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Performance overview for all your campaigns</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownloadSummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ background: TEAL }}
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
        <StatCard label="Total Campaigns"  value={total}   icon={Megaphone}    color={PURPLE}  sub={`${active} active now`} />
        <StatCard label="Creators Invited" value={invited} icon={Users}        color={TEAL}    sub="across all campaigns" />
        <StatCard label="Total Spend"      value={`₦${spend.toLocaleString()}`} icon={DollarSign} color={BLUE} sub="confirmed payments" />
        <StatCard label="Completion Rate"  value={total > 0 ? `${Math.round((completed / total) * 100)}%` : "—"} icon={TrendingUp} color={ORANGE} sub={`${completed} of ${total} completed`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Status breakdown bar */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Campaign Status</h3>
          <p className="text-xs text-muted-foreground mb-5">Distribution of your campaign states</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="campaigns" name="Campaigns" radius={[4, 4, 0, 0]}>
                {barData.map((entry, i) => (
                  <Cell key={i} fill={[TEAL, ORANGE, PURPLE, RED][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-1">Status Share</h3>
          <p className="text-xs text-muted-foreground mb-5">Proportion of campaigns by state</p>
          {statusData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              No campaign data yet
            </div>
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
            { label: "Active",    value: active,    icon: TrendingUp,  color: TEAL },
            { label: "Pending",   value: pending,   icon: Clock,       color: ORANGE },
            { label: "Completed", value: completed, icon: CheckCircle, color: PURPLE },
            { label: "Declined",  value: declined,  icon: XCircle,     color: RED },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <s.icon className="h-4 w-4" style={{ color: s.color }} />
                  <span className="text-sm font-medium text-gray-700">{s.label}</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {s.value} {total > 0 && <span className="text-xs text-gray-400 font-normal">({Math.round((s.value / total) * 100)}%)</span>}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: total > 0 ? `${(s.value / total) * 100}%` : "0%", background: s.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent campaigns table */}
      {recentCampaigns.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-gray-900">Recent Campaigns</h3>
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
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Campaign</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide">Status</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Invites</th>
                  <th className="pb-3 font-semibold text-muted-foreground text-xs uppercase tracking-wide text-right">Submissions</th>
                </tr>
              </thead>
              <tbody>
                {recentCampaigns.map((c, i) => {
                  const statusColors: Record<string, string> = { active: TEAL, pending: ORANGE, completed: PURPLE, declined: RED };
                  const status = String(c.status ?? "pending");
                  return (
                    <tr key={i} className="border-b border-gray-50 last:border-0">
                      <td className="py-3">
                        <p className="font-semibold text-gray-900">{String(c.name ?? "—")}</p>
                        <p className="text-xs text-muted-foreground">{String(c.sponsor ?? "")}</p>
                      </td>
                      <td className="py-3">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                          style={{ background: `${statusColors[status] ?? TEAL}18`, color: statusColors[status] ?? TEAL }}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">{String(c.invitesCount ?? 0)}</td>
                      <td className="py-3 text-right font-medium">{String(c.submissionsCount ?? 0)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </BrandLayout>
  );
}
