import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { IgtLogo } from "@/components/IgtLogo";
import { GeomDecor } from "@/components/GeomDecor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, KeyRound, CheckCircle, AlertCircle } from "lucide-react";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") ?? "";

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: FormData) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      const res = await fetch(`${BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: values.password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccess(true);
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="page-reset-password">
      {/* Left hero panel */}
      <div
        className="hidden lg:flex flex-col flex-1 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #6B2FCE 0%, #4E22A8 45%, #3A1A90 100%)" }}
      >
        <GeomDecor variant="purple" />
        <div className="relative z-10 p-8">
          <IgtLogo size="lg" white />
          <p className="text-white/50 text-xs mt-1 tracking-wide">INFLUENCER MARKETING PLATFORM</p>
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-12">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">Set New Password</h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xs">
            Choose a strong password to protect your iGoTrend account.
          </p>
          <div className="mt-10 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex items-center gap-3">
              <KeyRound className="h-5 w-5 text-[#1DCFB3]" />
              <div>
                <div className="text-white font-semibold text-sm">Secure password tips</div>
                <div className="text-white/55 text-xs mt-0.5">Use 8+ characters with mixed letters and numbers</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <IgtLogo size="lg" />
          </div>

          {/* Back link */}
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>

          {!token ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(239,68,68,0.1)" }}>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                This reset link is invalid or missing. Please request a new password reset.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Request New Reset Link
              </Link>
            </div>
          ) : success ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(29,207,179,0.12)" }}>
                <CheckCircle className="h-8 w-8" style={{ color: "#1DCFB3" }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Your password has been updated successfully. You can now sign in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block w-full text-center py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
              >
                Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-1">Set New Password</h2>
                <p className="text-muted-foreground text-sm">Enter and confirm your new password below</p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl border flex items-start gap-2.5 text-sm" style={{ background: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.25)", color: "#dc2626" }}>
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">New Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Min. 8 characters"
                            className="h-11 rounded-xl border-border/60 focus:border-primary"
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Repeat your new password"
                            className="h-11 rounded-xl border-border/60 focus:border-primary"
                            data-testid="input-confirm-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-bold text-base mt-2"
                    style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
                    disabled={loading}
                    data-testid="button-submit"
                  >
                    {loading ? "Resetting…" : "Reset Password"}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="font-semibold hover:underline" style={{ color: "#1DCFB3" }}>
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
