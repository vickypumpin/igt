import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { IgtLogo } from "@/components/IgtLogo";
import { GeomDecor } from "@/components/GeomDecor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
      await fetch(`${BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email }),
      });
      setSubmitted(true);
    } catch {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="page-forgot-password">
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
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4">Reset Password</h1>
          <p className="text-white/65 text-base leading-relaxed max-w-xs">
            Enter your email and we'll send you a link to reset your iGoTrend account password.
          </p>
          <div className="mt-10 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.12)" }}>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[#1DCFB3]" />
              <div>
                <div className="text-white font-semibold text-sm">Check your inbox</div>
                <div className="text-white/55 text-xs mt-0.5">Reset link expires in 60 minutes</div>
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

          {submitted ? (
            /* Success state */
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: "rgba(29,207,179,0.12)" }}>
                <CheckCircle className="h-8 w-8" style={{ color: "#1DCFB3" }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                We've sent a password reset link to <strong>{form.getValues("email")}</strong>. Please check your inbox and follow the instructions.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Didn't receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSubmitted(false)}
                  className="font-semibold hover:underline"
                  style={{ color: "#1DCFB3" }}
                >
                  try again
                </button>
              </p>
              <Link
                href="/login"
                className="inline-block w-full text-center py-2.5 rounded-xl text-sm font-semibold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-1">Forgot Password?</h2>
                <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-foreground">Email address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="you@example.com"
                            className="h-11 rounded-xl border-border/60 focus:border-primary"
                            data-testid="input-email"
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
                    {loading ? "Sending…" : "Send Reset Link"}
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
