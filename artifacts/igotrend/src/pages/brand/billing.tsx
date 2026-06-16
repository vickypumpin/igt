import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { useBillingBalance, getBillingBalanceQueryKey, usePurchaseGems } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gem, Zap, Star, Crown, ArrowDownCircle, ArrowUpCircle, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GEM_PACKAGES = [
  { id: "starter",    gems: 500,  amountNGN: 5000,  label: "Starter",    icon: Gem,   gradient: "linear-gradient(135deg, #6B2FCE, #5B21B6)", popular: false },
  { id: "growth",     gems: 1100, amountNGN: 10000, label: "Growth",     icon: Star,  gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", popular: true  },
  { id: "pro",        gems: 3000, amountNGN: 25000, label: "Pro",        icon: Zap,   gradient: "linear-gradient(135deg, #F59E0B, #D97706)", popular: false },
  { id: "enterprise", gems: 6500, amountNGN: 50000, label: "Enterprise", icon: Crown, gradient: "linear-gradient(135deg, #FF8C42, #E47128)", popular: false },
];

const TXN_ICONS: Record<string, React.ElementType> = { purchase: ArrowDownCircle, reward: Gift, spend: ArrowUpCircle };
const TXN_COLORS: Record<string, string> = { purchase: "#059669", reward: "#6B2FCE", spend: "#DC2626" };

export default function BrandBillingPage() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: billing, isLoading } = useBillingBalance();
  const purchaseMutation = usePurchaseGems();
  const { toast } = useToast();

  const handleBuy = (pkg: typeof GEM_PACKAGES[0]) => {
    purchaseMutation.mutate(
      { packageId: pkg.id, amount: pkg.amountNGN, gems: pkg.gems, currency: "NGN" },
      {
        onSuccess: (data) => {
          if (data.paymentUrl) {
            window.open(data.paymentUrl, "_blank");
          } else {
            toast({ title: `${pkg.gems.toLocaleString()} gems for ₦${pkg.amountNGN.toLocaleString()}`, description: "Payment gateway not configured yet. Contact support to set up Flutterwave." });
          }
          queryClient.invalidateQueries({ queryKey: getBillingBalanceQueryKey() });
        },
        onError: () => toast({ title: "Purchase failed", description: "Please try again or contact support.", variant: "destructive" }),
      }
    );
  };

  const transactions = billing?.transactions ?? [];

  return (
    <BrandLayout>
      <div data-testid="page-brand-billing">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Billing & Gems</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Purchase gems to reward your campaign creators</p>
        </div>

        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
              <Gem className="h-7 w-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold">{me?.gems ?? billing?.gems ?? 0} <span className="text-base text-muted-foreground font-medium">gems</span></div>
              <div className="text-sm text-muted-foreground">Your current gem balance</div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <div className="text-base font-bold mb-1">Buy Gems</div>
          <p className="text-sm text-muted-foreground">Gems are used to reward creators for campaign participation.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {GEM_PACKAGES.map(pkg => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-2xl border overflow-hidden shadow-sm relative"
                style={{ borderColor: pkg.popular ? "#1DCFB3" : "rgba(0,0,0,0.08)" }}
                data-testid={`gem-package-${pkg.id}`}
              >
                {pkg.popular && (
                  <div className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#1DCFB3" }}>
                    Popular
                  </div>
                )}
                <div className="p-6">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4" style={{ background: pkg.gradient }}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-muted-foreground mb-1">{pkg.label}</div>
                  <div className="text-2xl font-extrabold mb-0.5">{pkg.gems.toLocaleString()} <span className="text-sm font-semibold text-muted-foreground">gems</span></div>
                  <div className="text-sm text-muted-foreground mb-4">₦{pkg.amountNGN.toLocaleString()}</div>
                  <Button
                    onClick={() => handleBuy(pkg)}
                    disabled={purchaseMutation.isPending}
                    className="w-full rounded-xl h-10 font-semibold"
                    style={{ background: pkg.gradient, border: "none" }}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-sm font-bold">Transaction History</div>
          </div>
          {isLoading ? (
            <div className="p-5 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : !transactions.length ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Gem purchases will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {transactions.map(txn => {
                const Icon = TXN_ICONS[txn.type] ?? Gem;
                const color = TXN_COLORS[txn.type] ?? "#6B7280";
                const sign = txn.type === "spend" ? "-" : "+";
                return (
                  <div key={txn.id} className="px-5 py-4 flex items-center gap-4" data-testid={`txn-row-${txn.id}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{txn.description ?? txn.type}</div>
                      <div className="text-xs text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="font-bold text-sm flex-shrink-0" style={{ color }}>
                      {sign}{txn.gemsDelta} <span className="font-normal text-muted-foreground">gems</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 p-4 rounded-2xl border border-border/60 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💳 Payments powered by Flutterwave. All transactions are secure and encrypted.
            Gems never expire and can be used across all your campaigns.
          </p>
        </div>
      </div>
    </BrandLayout>
  );
}
