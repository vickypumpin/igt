import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useRegister } from "@workspace/api-client-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { IgtLogo } from "@/components/IgtLogo";
import { GeomDecor } from "@/components/GeomDecor";
import { CheckCircle2, Zap, Users, ArrowRight, ArrowLeft } from "lucide-react";
import type { AuthResponse } from "@workspace/api-client-react";

type Role = "brand" | "creator" | "agency";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  userName: z.string().min(3, "Min 3 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
  phone: z.string().optional(),
  role: z.enum(["brand", "creator", "agency"]),
  gender: z.enum(["male", "female"]),
  countryId: z.number().default(1),
  companyName: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const ROLES: { key: Role; label: string }[] = [
  { key: "brand",   label: "🏢 Brand"   },
  { key: "agency",  label: "🏛️ Agency"  },
  { key: "creator", label: "🎬 Creator" },
];

const PURPLE = "#6B2FCE";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { setAuth } = useAuth();
  const { toast } = useToast();
  const [role, setRole] = useState<Role>("brand");
  const [agencyStep, setAgencyStep] = useState<1 | 2>(1);
  const registerMutation = useRegister();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", userName: "", email: "", password: "", phone: "", role: "brand", gender: "male", countryId: 1, companyName: "" },
  });

  const onSubmit = (values: FormData) => {
    registerMutation.mutate({ data: { ...values, role, phone: values.phone ?? "" } }, {
      onSuccess: (data) => {
        const auth = data as unknown as AuthResponse;
        setAuth(auth.token, auth.user);
        setLocation("/");
      },
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error ?? "Registration failed";
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    });
  };

  const handleRoleChange = (r: Role) => {
    setRole(r);
    form.setValue("role", r);
    setAgencyStep(1);
  };

  // Agency step 1 advance — validate step-1 fields first
  const advanceAgencyStep = async () => {
    const ok = await form.trigger(["firstName", "lastName", "companyName", "userName", "email"]);
    if (ok) setAgencyStep(2);
  };

  return (
    <div className="min-h-screen flex" data-testid="page-register">

      {/* ── Left hero panel ── */}
      <div className="hidden lg:flex flex-col flex-1 relative overflow-hidden" style={{ background: "linear-gradient(145deg, #0DCCB4 0%, #0AA895 45%, #108A7A 100%)" }}>
        <GeomDecor variant="teal" />

        <div className="relative z-10 p-8">
          <IgtLogo size="lg" white />
          <p className="text-white/50 text-xs mt-1 tracking-wide">INFLUENCER MARKETING PLATFORM</p>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center px-10 pb-12">
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">Join iGoTrend</h1>
          <p className="text-white/70 text-base leading-relaxed max-w-xs mb-8">
            West Africa's fastest-growing influencer marketing platform. Free to register.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Registration is free</div>
                <div className="text-white/60 text-xs">No hidden charges, no credit card required</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Zap className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Instant campaign access</div>
                <div className="text-white/60 text-xs">Start creating campaigns in minutes</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">10,000+ verified creators</div>
                <div className="text-white/60 text-xs">Instagram, TikTok, YouTube, Twitter &amp; more</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div className="lg:hidden mb-6 flex justify-center">
            <IgtLogo size="lg" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-1">Create your account</h2>
            <p className="text-muted-foreground text-sm">Join iGoTrend — West Africa's influencer platform</p>
          </div>

          {/* Role selector */}
          <div className="flex gap-1.5 mb-5 p-1 rounded-xl" style={{ background: "#f3f4f8" }}>
            {ROLES.map(r => (
              <button
                key={r.key}
                onClick={() => handleRoleChange(r.key)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-all ${role === r.key ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                data-testid={`button-role-${r.key}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* ── AGENCY: 2-step simplified registration ── */}
          {role === "agency" ? (
            <div data-testid="agency-register-flow">
              {/* Progress indicator */}
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: PURPLE }}>1</div>
                  <span className="text-xs font-semibold" style={{ color: PURPLE }}>Agency details</span>
                </div>
                <div className="flex-1 h-px" style={{ background: agencyStep === 2 ? PURPLE : "#e5e7eb" }} />
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: agencyStep === 2 ? PURPLE : "#e5e7eb", color: agencyStep === 2 ? "white" : "#9ca3af" }}>2</div>
                  <span className="text-xs font-semibold" style={{ color: agencyStep === 2 ? PURPLE : "#9ca3af" }}>Account setup</span>
                </div>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">

                  {/* Step 1: Agency identity */}
                  {agencyStep === 1 && (
                    <>
                      <FormField control={form.control} name="companyName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Agency name</FormLabel>
                          <FormControl><Input {...field} placeholder="e.g. Acme Media Group" className="h-10 rounded-xl" data-testid="input-company-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="firstName" render={({ field }) => (
                          <FormItem><FormLabel className="font-semibold">First name</FormLabel><FormControl><Input {...field} className="h-10 rounded-xl" data-testid="input-first-name" /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="lastName" render={({ field }) => (
                          <FormItem><FormLabel className="font-semibold">Last name</FormLabel><FormControl><Input {...field} className="h-10 rounded-xl" data-testid="input-last-name" /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="userName" render={({ field }) => (
                        <FormItem><FormLabel className="font-semibold">Username</FormLabel><FormControl><Input {...field} placeholder="@agencyhandle" className="h-10 rounded-xl" data-testid="input-username" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem><FormLabel className="font-semibold">Business email</FormLabel><FormControl><Input {...field} type="email" className="h-10 rounded-xl" data-testid="input-email" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <Button
                        type="button"
                        onClick={advanceAgencyStep}
                        className="w-full h-11 rounded-xl font-bold text-base mt-1 gap-2"
                        style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}
                        data-testid="button-agency-next"
                      >
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}

                  {/* Step 2: Credentials + billing discussion */}
                  {agencyStep === 2 && (
                    <>
                      <div className="px-3 py-3 rounded-xl text-xs font-medium" style={{ background: "rgba(107,47,206,0.08)", color: PURPLE, border: `1px solid rgba(107,47,206,0.25)` }}>
                        💳 <span className="font-semibold">Billing arrangement</span><br />
                        <span className="opacity-80">Your billing (commission % or monthly subscription) will be configured by our team after registration. No payment required now.</span>
                      </div>
                      <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem><FormLabel className="font-semibold">Password</FormLabel><FormControl><Input {...field} type="password" className="h-10 rounded-xl" data-testid="input-password" /></FormControl><FormMessage /></FormItem>
                      )} />
                      <div className="grid grid-cols-2 gap-3">
                        <FormField control={form.control} name="gender" render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-semibold">Gender</FormLabel>
                            <FormControl>
                              <select {...field} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm" data-testid="select-gender">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem><FormLabel className="font-semibold">Phone <span className="font-normal text-muted-foreground">(opt.)</span></FormLabel><FormControl><Input {...field} placeholder="+234…" className="h-10 rounded-xl" /></FormControl><FormMessage /></FormItem>
                        )} />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setAgencyStep(1)}
                          className="h-11 rounded-xl px-4"
                          data-testid="button-agency-back"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 h-11 rounded-xl font-bold text-base"
                          style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}
                          disabled={registerMutation.isPending}
                          data-testid="button-register"
                        >
                          {registerMutation.isPending ? "Creating agency…" : "Create agency account"}
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </div>
          ) : (
            /* ── BRAND / CREATOR: standard single-step form ── */
            <>
              {role === "creator" && (
                <div className="mb-4 px-3 py-2.5 rounded-xl text-xs font-medium" style={{ background: "rgba(29,207,179,0.1)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.3)" }}>
                  💡 Creators must have at least 5k followers on Instagram, TikTok, YouTube or Twitter.
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="firstName" render={({ field }) => (
                      <FormItem><FormLabel className="font-semibold">First name</FormLabel><FormControl><Input {...field} className="h-10 rounded-xl" data-testid="input-first-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="lastName" render={({ field }) => (
                      <FormItem><FormLabel className="font-semibold">Last name</FormLabel><FormControl><Input {...field} className="h-10 rounded-xl" data-testid="input-last-name" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  {role === "brand" && (
                    <FormField control={form.control} name="companyName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Company name <span className="font-normal text-muted-foreground">(opt.)</span></FormLabel>
                        <FormControl><Input {...field} className="h-10 rounded-xl" data-testid="input-company-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  <FormField control={form.control} name="userName" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold">Username</FormLabel><FormControl><Input {...field} placeholder="@yourname" className="h-10 rounded-xl" data-testid="input-username" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold">Email</FormLabel><FormControl><Input {...field} type="email" className="h-10 rounded-xl" data-testid="input-email" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem><FormLabel className="font-semibold">Password</FormLabel><FormControl><Input {...field} type="password" className="h-10 rounded-xl" data-testid="input-password" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Gender</FormLabel>
                        <FormControl>
                          <select {...field} className="flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm" data-testid="select-gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem><FormLabel className="font-semibold">Phone <span className="font-normal text-muted-foreground">(opt.)</span></FormLabel><FormControl><Input {...field} placeholder="+234…" className="h-10 rounded-xl" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 rounded-xl font-bold text-base mt-1"
                    style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
                    disabled={registerMutation.isPending}
                    data-testid="button-register"
                  >
                    {registerMutation.isPending ? "Creating account…" : "Create account — it's free"}
                  </Button>
                </form>
              </Form>
            </>
          )}

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
