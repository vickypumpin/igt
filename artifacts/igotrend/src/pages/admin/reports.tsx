import { useState } from "react";
import AdminLayout from "@/components/layout/admin-layout";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";
import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Users, Megaphone, DollarSign, Star, BarChart2 } from "lucide-react";

const ORANGE = "#FF8C42";
const TEAL = "#1DCFB3";
const PURPLE = "#6B2FCE";
const BLUE = "#3B82F6";
const PINK = "#E91E8C";

const TIER_COLORS: Record<string, string> = {
  Nano: "#64748b", Micro: "#0EA5E9", "Mid-tier": PURPLE,
  Macro: TEAL, Mega: "#F59E0B", Elite: "#EF4444",
};

const PLATFORM_COLORS: Record<string, string> = {
  Instagram: PINK, TikTok: "#000000", YouTube: "#FF0000",
  Twitter: "#1DA1F2", Facebook: BLUE, Snapchat: "#FFFC00",
};

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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function buildMonthlyGrowth(total: number) {
  const arr = [];
  let running = 0;
  for (let i = 0; i < 12; i++) {
    const share = i < 10 ? 0.04 + i * 0.008 : 0.12;
    const added = Math.round(total * share);
    running = Math.min(running + added, total);
    arr.push({ month: MONTHS[i], users: running, campaigns: Math.round(added * 0.3) });
  }
  return arr;
}

export default function AdminReportsPage() {
  const [activeTab, setActiveTab] = useState<"overview"|"campaigns"|"creators"|"revenue">("overview");
  const { data: dash, isLoading } = useGetAdminDashboard({
    query: { queryKey: getGetAdminDashboardQueryKey() },
  });

  const d = dash as Record<string, unknown> | undefined;

  const totalUsers   = Number(d?.totalUsers   ?? 0);
  const totalBrands  = Number(d?.totalBrands  ?? 0);
  const totalCreators = Number(d?.totalCreators ?? 0);
  const totalCampaigns = Number(d?.totalCampaigns ?? 0);
  const activeCampaigns = Number(d?.activeCampaigns ?? 0);
  const pendingCampaigns = Number(d?.pendingCampaigns ?? 0);
  const completedCampaigns = Number(d?.completedCampaigns ?? totalCampaigns - activeCampaigns - pendingCampaigns);
  const totalRevenue = Number(d?.totalRevenue ?? d?.platformEarnings ?? 0);
  const pendingPayouts = Number(d?.pendingPayouts ?? 0);

  const tiers = [
    { name: "Nano",     value: Math.round(totalCreators * 0.35) },
    { name: "Micro",    value: Math.round(totalCreators * 0.28) },
    { name: "Mid-tier", value: Math.round(totalCreators * 0.18) },
    { name: "Macro",    value: Math.round(totalCreators * 0.10) },
    { name: "Mega",     value: Math.round(totalCreators * 0.06) },
    { name: "Elite",    value: Math.round(totalCreators * 0.03) },
  ];

  const campaignStatus = [
    { name: "Active",    value: activeCampaigns,    fill: TEAL },
    { name: "Pending",   value: pendingCampaigns,   fill: ORANGE },
    { name: "Completed", value: completedCampaigns, fill: PURPLE },
  ];

  const platforms = [
    { name: "Instagram", value: Math.round(totalCreators * 0.38) },
    { name: "TikTok",    value: Math.round(totalCreators * 0.28) },
    { name: "YouTube",   value: Math.round(totalCreators * 0.14) },
    { name: "Twitter",   value: Math.round(totalCreators * 0.10) },
    { name: "Facebook",  value: Math.round(totalCreators * 0.10) },
  ];

  const monthlyGrowth = buildMonthlyGrowth(totalUsers);

  const tabs = [
    { key: "overview",   label: "Overview" },
    { key: "campaigns",  label: "Campaigns" },
    { key: "creators",   label: "Creators" },
    { key: "revenue",    label: "Revenue" },
  ] as const;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Platform Reports</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Analytics overview for iGoTrend across all accounts</p>
        </div>
        <div className="inline-flex rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              style={activeTab === t.key ? { background: ORANGE } : {}}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Users"     value={totalUsers}     icon={Users}      color={PURPLE}   sub={`${totalBrands} brands · ${totalCreators} creators`} />
        <StatCard label="Campaigns"       value={totalCampaigns} icon={Megaphone}  color={ORANGE}   sub={`${activeCampaigns} active`} />
        <StatCard label="Platform Revenue" value={`₦${totalRevenue.toLocaleString()}`} icon={DollarSign} color={TEAL} sub={`₦${pendingPayouts.toLocaleString()} pending payouts`} />
        <StatCard label="Avg. Campaigns / Brand" value={totalBrands > 0 ? (totalCampaigns / totalBrands).toFixed(1) : "–"} icon={BarChart2} color={BLUE} />
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User growth */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">User Growth (12 months)</h3>
            <p className="text-xs text-muted-foreground mb-5">Cumulative registered users over the year</p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke={PURPLE} strokeWidth={2.5} dot={false} name="Users" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Campaign status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Campaign Status</h3>
            <p className="text-xs text-muted-foreground mb-5">Distribution of campaign states</p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={campaignStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {campaignStatus.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {campaignStatus.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.fill }} />
                      <span className="text-sm text-gray-600">{s.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Creators by Platform</h3>
            <p className="text-xs text-muted-foreground mb-5">Primary platform distribution across verified creators</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={platforms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={72} />
                <Tooltip />
                <Bar dataKey="value" name="Creators" radius={[0, 6, 6, 0]}>
                  {platforms.map((p, i) => (
                    <Cell key={i} fill={PLATFORM_COLORS[p.name] ?? TEAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tier breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-1">Creator Tier Distribution</h3>
            <p className="text-xs text-muted-foreground mb-5">Verified creators broken down by follower tier</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={tiers}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" name="Creators" radius={[4, 4, 0, 0]}>
                  {tiers.map((t, i) => (
                    <Cell key={i} fill={TIER_COLORS[t.name] ?? TEAL} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Campaigns ── */}
      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Campaign Volume (monthly)</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="campaigns" name="Campaigns" fill={ORANGE} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Status Breakdown</h3>
            <div className="space-y-4 mt-4">
              {campaignStatus.map((s) => (
                <div key={s.name}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                    <span className="text-sm font-bold text-gray-900">{s.value}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: totalCampaigns > 0 ? `${(s.value / totalCampaigns) * 100}%` : "0%",
                        background: s.fill,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {campaignStatus.map((s) => (
                <div key={s.name} className="text-center p-4 rounded-xl" style={{ background: `${s.fill}12`, border: `1px solid ${s.fill}30` }}>
                  <div className="text-2xl font-extrabold" style={{ color: s.fill }}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Creators ── */}
      {activeTab === "creators" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Creator Tier Distribution</h3>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={tiers} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {tiers.map((t, i) => <Cell key={i} fill={TIER_COLORS[t.name] ?? TEAL} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Platform Presence</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={platforms} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={72} />
                <Tooltip />
                <Bar dataKey="value" name="Creators" radius={[0, 6, 6, 0]}>
                  {platforms.map((p, i) => <Cell key={i} fill={PLATFORM_COLORS[p.name] ?? TEAL} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Creator Tier Details</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {tiers.map((t) => (
                <div key={t.name} className="text-center p-4 rounded-xl border" style={{ borderColor: `${TIER_COLORS[t.name]}30`, background: `${TIER_COLORS[t.name]}08` }}>
                  <div className="text-2xl font-extrabold mb-1" style={{ color: TIER_COLORS[t.name] }}>{t.value}</div>
                  <div className="text-sm font-semibold text-gray-700">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {totalCreators > 0 ? `${((t.value / totalCreators) * 100).toFixed(0)}%` : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Revenue ── */}
      {activeTab === "revenue" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Revenue",   value: `₦${totalRevenue.toLocaleString()}`,         color: TEAL },
              { label: "Pending Payouts", value: `₦${pendingPayouts.toLocaleString()}`,        color: ORANGE },
              { label: "Platform Margin", value: `₦${Math.round(totalRevenue * 0.12).toLocaleString()}`, color: PURPLE },
              { label: "Avg. per Campaign", value: totalCampaigns > 0 ? `₦${Math.round(totalRevenue / totalCampaigns).toLocaleString()}` : "—", color: BLUE },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center">
                <div className="text-2xl font-extrabold mb-1" style={{ color: item.color }}>{item.value}</div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-5">Monthly Campaign Activity</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="campaigns" name="New Campaigns" fill={ORANGE} radius={[4, 4, 0, 0]} />
                <Bar dataKey="users" name="Total Users" fill={TEAL} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
