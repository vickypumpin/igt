import { useGetAdminDashboard, getGetAdminDashboardQueryKey } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Megaphone, DollarSign, FileCheck, ShieldCheck, Wallet, ArrowRight } from "lucide-react";

const CARDS = [
  { key: "totalBrands",          label: "Total brands",          href: "/admin/users",         gradient: "linear-gradient(135deg, #3B82F6, #2563EB)", Icon: Users },
  { key: "totalCreators",        label: "Total creators",        href: "/admin/users",         gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", Icon: Users },
  { key: "activeCampaigns",      label: "Active campaigns",      href: "/admin/campaigns",     gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", Icon: Megaphone },
  { key: "completedCampaigns",   label: "Completed campaigns",   href: "/admin/campaigns",     gradient: "linear-gradient(135deg, #10B981, #059669)", Icon: Megaphone },
  { key: "totalRevenue",         label: "Total revenue",         href: undefined,              gradient: "linear-gradient(135deg, #22C55E, #16A34A)", Icon: DollarSign, format: "currency" },
  { key: "pendingVerifications", label: "Pending verifications", href: "/admin/verify-requests", gradient: "linear-gradient(135deg, #F59E0B, #D97706)", Icon: ShieldCheck },
  { key: "pendingSubmissions",   label: "Pending submissions",   href: "/admin/submissions",   gradient: "linear-gradient(135deg, #FF8C42, #E47128)", Icon: FileCheck },
  { key: "pendingCampaigns",     label: "Pending campaigns",     href: "/admin/campaigns",     gradient: "linear-gradient(135deg, #EF4444, #DC2626)", Icon: Megaphone },
] as const;

export default function AdminDashboardPage() {
  const { data, isLoading } = useGetAdminDashboard({ query: { queryKey: getGetAdminDashboardQueryKey() } });

  return (
    <AdminLayout>
      <div data-testid="page-admin-dashboard">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold">Platform Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">iGoTrend admin dashboard</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}</div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CARDS.map(({ key, label, href, gradient, Icon, format }) => {
              const raw = data?.[key as keyof typeof data] ?? 0;
              const value = format === "currency" ? `$${(raw as number).toLocaleString()}` : raw;
              return (
                <Card key={key} className="border-0 shadow-sm hover:shadow-md transition-shadow" data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: gradient }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {href && (
                        <Link href={href}>
                          <span className="text-xs flex items-center gap-0.5 font-semibold hover:underline" style={{ color: "#FF8C42" }}>View <ArrowRight className="h-3 w-3" /></span>
                        </Link>
                      )}
                    </div>
                    <div className="text-2xl font-extrabold">{value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
