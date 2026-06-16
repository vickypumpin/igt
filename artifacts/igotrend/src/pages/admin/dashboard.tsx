import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Megaphone, DollarSign, FileCheck, ShieldCheck, Wallet, ArrowRight } from "lucide-react";

function StatCard({ icon: Icon, label, value, href, color }: { icon: React.ElementType; label: string; value: string | number; href?: string; color: string }) {
  return (
    <Card data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${color}`}><Icon className="h-4 w-4" /></div>
          {href && <Link href={href}><span className="text-xs text-primary hover:underline flex items-center gap-0.5">View <ArrowRight className="h-3 w-3" /></span></Link>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard({ query: { queryKey: getGetAdminDashboardQueryKey() } });

  return (
    <AdminLayout>
      <div data-testid="page-admin-dashboard">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">iGoTrend admin dashboard</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={Users} label="Total brands" value={data?.totalBrands ?? 0} href="/admin/users" color="bg-blue-100 text-blue-600" />
            <StatCard icon={Users} label="Total creators" value={data?.totalCreators ?? 0} href="/admin/users" color="bg-purple-100 text-purple-600" />
            <StatCard icon={Megaphone} label="Active campaigns" value={data?.activeCampaigns ?? 0} href="/admin/campaigns" color="bg-green-100 text-green-600" />
            <StatCard icon={Megaphone} label="Completed campaigns" value={data?.completedCampaigns ?? 0} href="/admin/campaigns" color="bg-gray-100 text-gray-600" />
            <StatCard icon={DollarSign} label="Total revenue" value={`$${(data?.totalRevenue ?? 0).toLocaleString()}`} color="bg-emerald-100 text-emerald-600" />
            <StatCard icon={Wallet} label="Pending verifications" value={data?.pendingVerifications ?? 0} href="/admin/verify-requests" color="bg-yellow-100 text-yellow-600" />
            <StatCard icon={FileCheck} label="Pending submissions" value={data?.pendingSubmissions ?? 0} href="/admin/submissions" color="bg-orange-100 text-orange-600" />
            <StatCard icon={Megaphone} label="Pending campaigns" value={data?.pendingCampaigns ?? 0} href="/admin/campaigns" color="bg-red-100 text-red-600" />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
