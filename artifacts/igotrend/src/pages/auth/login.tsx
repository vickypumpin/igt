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

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormData) => {
    loginMutation.mutate({ data: values }, {
      onSuccess: (data) => {
        const auth = data as unknown as AuthResponse;
        setAuth(auth.token, auth.user);
        if (auth.user.role === "admin") setLocation("/admin");
        else if (auth.user.role === "creator") setLocation("/");
        else setLocation("/");
      },
      onError: () => {
        toast({ title: "Login failed", description: "Invalid email or password", variant: "destructive" });
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="page-login">
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-12">
        <div className="max-w-md text-primary-foreground">
          <div className="text-3xl font-bold tracking-tight mb-3">iGoTrend</div>
          <p className="text-lg opacity-80 leading-relaxed">The influencer marketing command center for West Africa's top agencies.</p>
          <div className="mt-10 space-y-4 text-sm opacity-70">
            <div className="flex gap-3 items-start"><span className="mt-0.5 text-base">&#9679;</span><span>Discover 10,000+ vetted creators across Instagram, TikTok, YouTube and more</span></div>
            <div className="flex gap-3 items-start"><span className="mt-0.5 text-base">&#9679;</span><span>Run multi-platform campaigns with per-format deliverable tracking</span></div>
            <div className="flex gap-3 items-start"><span className="mt-0.5 text-base">&#9679;</span><span>Pay creators in USD — Gems, airtime, or direct bank transfer</span></div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="text-2xl font-bold text-foreground mb-1">Welcome back</div>
            <p className="text-muted-foreground text-sm">Sign in to your iGoTrend account</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input {...field} type="email" placeholder="you@agency.com" data-testid="input-email" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input {...field} type="password" placeholder="••••••••" data-testid="input-password" /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="button-login">
                {loginMutation.isPending ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary font-medium hover:underline" data-testid="link-register">Create one</Link>
          </p>
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">Demo: admin@igotrend.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
