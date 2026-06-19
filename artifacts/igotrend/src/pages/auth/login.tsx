import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useLogin } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { IgtLogo } from "@/components/IgtLogo";
import { GeomDecor } from "@/components/GeomDecor";
import type { AuthResponse } from "@workspace/api-client-react";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();

  const returnTo = new URLSearchParams(window.location.search).get("returnTo") ?? "";

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormData) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        const auth = data as unknown as AuthResponse;
        setAuth(auth.token, auth.user);
        if (returnTo && returnTo.startsWith("/")) {
          setLocation(returnTo);
        } else if ((auth.user.role as string) === "admin") {
          setLocation("/admin");
        } else if (auth.user.role === "agency") {
          setLocation("/agency/dashboard");
        } else if (auth.user.role === "brand") {
          setLocation("/dashboard");
        } else {
          setLocation("/");
        }
      },
      onError: () => {
        toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen flex" data-testid="page-login">

      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #6B2FCE 0%, #4E22A8 45%, #3A1A90 100%)" }}>
        <GeomDecor variant="purple" />

        {/* Logo */}
        <div className="relative z-10 p-8">
          <IgtLogo size="lg" white />
          <p className="text-white/50 text-xs mt-1 tracking-wide">INFLUENCER MARKETING PLATFORM</p>
        </div>

        {/* Headline + stats */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-12">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">Log In</h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xs">
            Access your account and start creating campaigns that trend.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-2xl font-extrabold text-white">10,000+</div>
              <div className="text-white/55 text-xs mt-0.5">Verified creators</div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-2xl font-extrabold text-white">₦18.5M</div>
              <div className="text-white/55 text-xs mt-0.5">Campaign budgets</div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
              <div className="text-2xl font-extrabold text-white">148K</div>
              <div className="text-white/55 text-xs mt-0.5">Collaborations</div>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(29,207,179,0.18)", backdropFilter: "blur(8px)", border: "1px solid rgba(29,207,179,0.35)" }}>
              <div className="text-2xl font-extrabold" style={{ color: "#1DCFB3" }}>18M</div>
              <div className="text-white/55 text-xs mt-0.5">Total reach</div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0" style={{ height: 80, background: "linear-gradient(to top, rgba(58,26,144,0.8), transparent)" }} />
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile-only logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <IgtLogo size="lg" />
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm">Sign in to your iGoTrend account</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="you@agency.com" className="h-11 rounded-xl border-border/60 focus:border-primary" data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold text-foreground">Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" className="h-11 rounded-xl border-border/60 focus:border-primary" data-testid="input-password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-bold text-base mt-2"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </Form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: "#1DCFB3" }} data-testid="link-register">Create one</Link>
          </p>

          <p className="mt-3 text-center text-sm">
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Forgot your password?
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border/60 space-y-3">
            <p className="text-xs text-muted-foreground text-center">Demo: admin@igotrend.com / password</p>
            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
