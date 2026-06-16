import { useAuth } from "@/contexts/auth-context";
import BrandLayout from "@/components/layout/brand-layout";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, TrendingUp, BarChart3, Lightbulb, Zap } from "lucide-react";

const FEATURES = [
  { icon: TrendingUp, title: "Trend Forecasting", desc: "AI-powered predictions for trending content in West Africa before they peak.", gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
  { icon: BarChart3, title: "Audience Analytics", desc: "Deep insights into creator audiences — demographics, engagement patterns, and reach.", gradient: "linear-gradient(135deg, #6B2FCE, #5B21B6)" },
  { icon: Lightbulb, title: "Campaign Suggestions", desc: "Smart recommendations for the best creators and content formats for your goals.", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  { icon: Zap, title: "Real-time Monitoring", desc: "Live tracking of campaign performance with AI-generated optimization tips.", gradient: "linear-gradient(135deg, #FF8C42, #E47128)" },
];

export default function TrendAiPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState(user?.email ?? "");
  const [joined, setJoined] = useState(false);
  const Layout = user?.role === "creator" ? CreatorLayout : BrandLayout;

  const handleJoin = () => {
    if (!email) return;
    setJoined(true);
    toast({ title: "You're on the waitlist! 🎉", description: "We'll notify you when Trend AI launches." });
  };

  return (
    <Layout>
      <div data-testid="page-trend-ai" className="max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>
            <Sparkles className="h-3.5 w-3.5" />
            Coming Soon
          </div>
          <h1 className="text-3xl font-extrabold mb-3">Trend AI</h1>
          <p className="text-muted-foreground leading-relaxed">
            Harness the power of artificial intelligence to supercharge your influencer marketing campaigns in West Africa.
            Get real-time trend insights, audience analytics, and campaign intelligence — all powered by AI.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
            <div key={title} className="bg-white rounded-2xl border border-border/60 p-5 shadow-sm">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white mb-3" style={{ background: gradient }}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold mb-1">{title}</div>
              <div className="text-xs text-muted-foreground leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>

        {!joined ? (
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="text-base font-bold mb-1">Join the waitlist</div>
            <p className="text-sm text-muted-foreground mb-4">Be among the first to access Trend AI when it launches.</p>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="h-10 rounded-xl flex-1"
                data-testid="input-waitlist-email"
              />
              <Button
                onClick={handleJoin}
                className="h-10 px-5 rounded-xl font-semibold gap-2"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                data-testid="btn-join-waitlist"
              >
                <Sparkles className="h-4 w-4" />
                Notify me
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm text-center">
            <div className="text-2xl mb-2">🎉</div>
            <div className="text-base font-bold">You're on the list!</div>
            <p className="text-sm text-muted-foreground mt-1">We'll send updates to <span className="font-medium text-foreground">{email}</span> when Trend AI launches.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
