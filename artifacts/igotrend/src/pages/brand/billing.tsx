import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gem, Zap, Star, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GEM_PACKAGES = [
  { id: "starter", gems: 100, price: 10, label: "Starter", icon: Gem, gradient: "linear-gradient(135deg, #6B2FCE, #5B21B6)", popular: false },
  { id: "growth", gems: 500, price: 45, label: "Growth", icon: Star, gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", popular: true },
  { id: "pro", gems: 1200, price: 100, label: "Pro", icon: Zap, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", popular: false },
  { id: "enterprise", gems: 5000, price: 350, label: "Enterprise", icon: Crown, gradient: "linear-gradient(135deg, #FF8C42, #E47128)", popular: false },
];

export default function BrandBillingPage() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { toast } = useToast();

  const handleBuy = (pkg: typeof GEM_PACKAGES[0]) => {
    toast({ title: "Payment gateway coming soon", description: `${pkg.gems} gems for $${pkg.price} — Flutterwave integration in progress.` });
  };

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
              <div className="text-3xl font-extrabold">{me?.gems ?? 0} <span className="text-base text-muted-foreground font-medium">gems</span></div>
              <div className="text-sm text-muted-foreground">Your current gem balance</div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <div className="text-base font-bold mb-1">Buy Gems</div>
          <p className="text-sm text-muted-foreground">Gems are used to reward creators for campaign participation.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {GEM_PACKAGES.map(pkg => {
            const { icon: Icon } = pkg;
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
                  <div className="text-sm text-muted-foreground mb-4">${pkg.price} USD</div>
                  <Button
                    onClick={() => handleBuy(pkg)}
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

        <div className="mt-6 p-4 rounded-2xl border border-border/60 bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            💳 Payments powered by Flutterwave. All transactions are secure and encrypted.
            Gems never expire and can be used across all your campaigns.
          </p>
        </div>
      </div>
    </BrandLayout>
  );
}
