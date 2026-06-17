import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AgencyLayout from "@/components/layout/agency-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, TrendingUp, CreditCard, AlertCircle, CheckCircle, Clock } from "lucide-react";

const PURPLE = "#6B2FCE";

interface AgencyData {
  agency: {
    id: number;
    name: string;
    billingMode: string;
    commissionRate: string;
    subscriptionStatus: string;
  };
  monthlySpend: number;
  totalCommissionOwed: number;
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </div>
      </div>
      <div className="text-2xl font-black text-gray-900 mb-0.5">{value}</div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
    </div>
  );
}

export default function AgencyBillingPage() {
  const { data, isLoading, error } = useQuery<AgencyData>({
    queryKey: ["agency-billing"],
    queryFn: () => customFetch("/api/agency/dashboard"),
  });

  const agency = data?.agency;
  const billingMode = agency?.billingMode ?? "retainer";
  const commissionRate = agency?.commissionRate ? `${(parseFloat(agency.commissionRate) * 100).toFixed(0)}%` : "—";
  const monthlySpend = data?.monthlySpend ?? 0;
  const commissionOwed = data?.totalCommissionOwed ?? 0;
  const subscriptionStatus = agency?.subscriptionStatus ?? "inactive";

  const statusMeta: Record<string, { icon: React.ElementType; color: string; label: string }> = {
    active: { icon: CheckCircle, color: "#059669", label: "Active" },
    trialing: { icon: Clock, color: "#D97706", label: "Trialing" },
    inactive: { icon: AlertCircle, color: "#DC2626", label: "Inactive" },
  };
  const sm = statusMeta[subscriptionStatus] ?? statusMeta.inactive;
  const StatusIcon = sm.icon;

  return (
    <AgencyLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Billing</h1>
          <p className="text-sm text-gray-500 mt-0.5">Your agency billing summary and commission overview.</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-5 text-sm text-red-600 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Unable to load billing data. Please try again later.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Billing Mode" value={billingMode === "retainer" ? "Retainer" : "Commission"} icon={CreditCard} color={PURPLE} />
              <StatCard label="Commission Rate" value={commissionRate} sub="Per campaign" icon={TrendingUp} color="#1DCFB3" />
              <StatCard label="Monthly Spend" value={`₦${monthlySpend.toLocaleString()}`} sub="This month" icon={Wallet} color="#F59E0B" />
              <StatCard label="Commission Owed" value={`₦${commissionOwed.toLocaleString()}`} sub="Outstanding" icon={Wallet} color="#FF8C42" />
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-4">Account Status</h2>
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: `${sm.color}10`, border: `1px solid ${sm.color}30` }}>
                <StatusIcon className="h-5 w-5 flex-shrink-0" style={{ color: sm.color }} />
                <div>
                  <div className="text-sm font-bold" style={{ color: sm.color }}>{sm.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {subscriptionStatus === "active"
                      ? "Your agency account is active and in good standing."
                      : subscriptionStatus === "trialing"
                      ? "You are currently in a trial period. Contact admin to activate."
                      : "Your account is inactive. Contact support to resolve."}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-bold text-gray-900 mb-2">Need to update billing details?</h2>
              <p className="text-sm text-gray-500 mb-4">
                Billing configuration for agency accounts is managed by the iGoTrend admin team.
                Contact us to update your billing mode, commission rate, or payment methods.
              </p>
              <a
                href="mailto:billing@igotrend.com"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: PURPLE }}
              >
                <CreditCard className="h-4 w-4" />
                Contact Billing Support
              </a>
            </div>
          </>
        )}
      </div>
    </AgencyLayout>
  );
}
