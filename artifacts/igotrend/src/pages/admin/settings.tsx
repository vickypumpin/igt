import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Settings2, CreditCard, MessageSquare, Mail, Globe, DollarSign, Send } from "lucide-react";
import { getToken } from "@/lib/auth-store";

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function apiPost(path: string, body: unknown) {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw { response: { data } };
  }
  return res.json();
}

function MaskedInput({ name, register, placeholder }: { name: string; register: ReturnType<typeof useForm>["register"]; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1.5">
      <Input {...register(name)} type={show ? "text" : "password"} placeholder={placeholder} className="pr-9 h-10 rounded-xl" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

function Section({ icon: Icon, title, desc, children }: { icon: React.ElementType; title: string; desc?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">{title}</div>
          {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
        </div>
      </div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-semibold text-muted-foreground">{label}</label>{children}</div>;
}

type SettingsTab = "general" | "fees" | "gateway" | "smtp";

const TABS: { id: SettingsTab; label: string; path: string }[] = [
  { id: "general",  label: "General",  path: "/admin/settings/general"  },
  { id: "fees",     label: "Fees",     path: "/admin/settings/fees"     },
  { id: "gateway",  label: "Gateway",  path: "/admin/settings/gateway"  },
  { id: "smtp",     label: "SMTP / SMS", path: "/admin/settings/smtp"  },
];

function getTabFromPath(path: string): SettingsTab {
  if (path.endsWith("/fees")) return "fees";
  if (path.endsWith("/gateway")) return "gateway";
  if (path.endsWith("/smtp")) return "smtp";
  return "general";
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const activeTab = getTabFromPath(location);
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();
  const [testSmsPhone, setTestSmsPhone] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [sendingSms, setSendingSms] = useState(false);

  useEffect(() => { if (settings) reset(settings); }, [settings, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    updateMutation.mutate({ data: values }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }); toast({ title: "Settings saved ✓" }); },
      onError: () => { toast({ title: "Failed to save settings", variant: "destructive" }); },
    });
  };

  const handleTestEmail = async () => {
    setSendingEmail(true);
    try {
      await apiPost("/settings/test-email", {});
      toast({ title: "Test email sent ✓", description: "Check your contact email inbox." });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Failed to send test email";
      toast({ title: "Email test failed", description: msg, variant: "destructive" });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleTestSms = async () => {
    if (!testSmsPhone.trim()) {
      toast({ title: "Enter a phone number first", variant: "destructive" });
      return;
    }
    setSendingSms(true);
    try {
      await apiPost("/settings/test-sms", { phone: testSmsPhone.trim() });
      toast({ title: "Test SMS sent ✓", description: `Sent to ${testSmsPhone}` });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error ?? "Failed to send test SMS";
      toast({ title: "SMS test failed", description: msg, variant: "destructive" });
    } finally {
      setSendingSms(false);
    }
  };

  if (isLoading) return <AdminLayout><div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl" data-testid="page-admin-settings">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure iGoTrend — changes take effect immediately</p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              data-testid={`tab-settings-${tab.id}`}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={activeTab === tab.id
                ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" }
                : { background: "white", borderColor: "rgba(0,0,0,0.12)" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {activeTab === "general" && (
            <>
              <Section icon={Settings2} title="General">
                <Field label="Site name"><Input {...register("siteName")} className="mt-1.5 h-10 rounded-xl" data-testid="input-site-name" /></Field>
                <Field label="Site description"><Input {...register("siteDescription")} className="mt-1.5 h-10 rounded-xl" /></Field>
                <Field label="Contact email"><Input {...register("contactEmail")} type="email" className="mt-1.5 h-10 rounded-xl" data-testid="input-contact-email" /></Field>
              </Section>
              <Section icon={Globe} title="Social Links">
                <Field label="Facebook URL"><Input {...register("facebookUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://facebook.com/…" /></Field>
                <Field label="Instagram URL"><Input {...register("instagramUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://instagram.com/…" /></Field>
                <Field label="YouTube URL"><Input {...register("youtubeUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://youtube.com/…" /></Field>
              </Section>
            </>
          )}

          {activeTab === "fees" && (
            <Section icon={DollarSign} title="Fees & Pricing">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Gem price ($)"><Input {...register("gemPrice", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-gem-price" /></Field>
                <Field label="Gem service fee (%)"><Input {...register("gemServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-gem-fee" /></Field>
                <Field label="Creator fee (%)"><Input {...register("creatorServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-creator-fee" /></Field>
                <Field label="Brand fee (%)"><Input {...register("brandServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-brand-fee" /></Field>
              </div>
            </Section>
          )}
          {activeTab === "fees" && (
            <Section icon={DollarSign} title="Default Billing for New Brands">
              <Field label="Default billing mode">
                <select {...register("defaultBillingMode")} className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm shadow-sm" data-testid="select-default-billing-mode">
                  <option value="commission">Commission</option>
                  <option value="subscription">Subscription</option>
                </select>
              </Field>
              <Field label="Default commission rate (%)">
                <Input {...register("defaultCommissionRate", { valueAsNumber: true })} type="number" step="0.01" min="0" max="100" className="mt-1.5 h-10 rounded-xl" data-testid="input-default-commission-rate" />
              </Field>
            </Section>
          )}

          {activeTab === "gateway" && (
            <>
              <Section icon={CreditCard} title="Preferred Gateway" desc="Choose which payment gateway is used for transactions">
                <Field label="Active gateway">
                  <select {...register("preferredPaymentGateway")} className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm shadow-sm" data-testid="select-preferred-gateway">
                    <option value="flutterwave">Flutterwave</option>
                    <option value="paystack">Paystack</option>
                    <option value="auto">Auto-balance (round-robin)</option>
                  </select>
                </Field>
              </Section>

              <Section icon={CreditCard} title="Flutterwave Payment Gateway" desc={<>Get your keys from <a href="https://dashboard.flutterwave.com/dashboard/settings/apis" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#1DCFB3" }}>dashboard.flutterwave.com</a></>}>
                <Field label="Public key"><MaskedInput name="flutterwavePublicKey" register={register} placeholder="FLWPUBK_TEST-…" /></Field>
                <Field label="Secret key"><MaskedInput name="flutterwaveSecretKey" register={register} placeholder="FLWSECK_TEST-…" /></Field>
                <Field label="Encryption key"><MaskedInput name="flutterwaveEncryptionKey" register={register} placeholder="FLWENCRYPTKEY…" /></Field>
                <div className="flex items-center gap-2.5 pt-1">
                  <input {...register("flutterwaveLive")} type="checkbox" id="fw-live" className="h-4 w-4 rounded border border-input" />
                  <label htmlFor="fw-live" className="text-xs text-muted-foreground font-medium cursor-pointer">Live mode (uncheck for test/sandbox)</label>
                </div>
              </Section>

              <Section icon={CreditCard} title="Paystack Payment Gateway" desc={<>Get your keys from <a href="https://dashboard.paystack.com/#/settings/developers" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "#1DCFB3" }}>dashboard.paystack.com</a></>}>
                <Field label="Public key"><MaskedInput name="paystackPublicKey" register={register} placeholder="pk_test_…" /></Field>
                <Field label="Secret key"><MaskedInput name="paystackSecretKey" register={register} placeholder="sk_test_…" /></Field>
                <div className="flex items-center gap-2.5 pt-1">
                  <input {...register("paystackLive")} type="checkbox" id="ps-live" className="h-4 w-4 rounded border border-input" />
                  <label htmlFor="ps-live" className="text-xs text-muted-foreground font-medium cursor-pointer">Live mode (uncheck for test/sandbox)</label>
                </div>
              </Section>
            </>
          )}

          {activeTab === "smtp" && (
            <>
              <Section icon={MessageSquare} title="SMSLive247" desc="Optional — for SMS notifications to creators and brands">
                <Field label="API key"><MaskedInput name="smsLive247ApiKey" register={register} placeholder="Your SMSLive247 API key" /></Field>
                <Field label="Sender name"><Input {...register("smsLive247SenderName")} className="mt-1.5 h-10 rounded-xl" placeholder="iGoTrend" /></Field>
                <Field label="Account type">
                  <select {...register("smsLive247AccountType")} className="mt-1.5 flex h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm shadow-sm" data-testid="select-sms-account-type">
                    <option value="">Select account type</option>
                    <option value="Classic">Classic</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Premium">Premium</option>
                  </select>
                </Field>
                <div className="flex items-center gap-2.5 pt-1">
                  <input {...register("smsNotify")} type="checkbox" id="sms-notify" className="h-4 w-4 rounded border border-input" />
                  <label htmlFor="sms-notify" className="text-xs text-muted-foreground font-medium cursor-pointer">Enable SMS notifications</label>
                </div>
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs text-muted-foreground mb-2">Send a test SMS to verify your credentials:</p>
                  <div className="flex gap-2">
                    <Input
                      value={testSmsPhone}
                      onChange={e => setTestSmsPhone(e.target.value)}
                      placeholder="+2348012345678"
                      className="h-9 rounded-xl text-sm flex-1"
                      data-testid="input-test-sms-phone"
                    />
                    <Button
                      type="button"
                      onClick={handleTestSms}
                      disabled={sendingSms}
                      size="sm"
                      className="h-9 rounded-xl px-3 gap-1.5 text-xs font-semibold"
                      style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none", color: "#fff" }}
                      data-testid="button-test-sms"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {sendingSms ? "Sending…" : "Send test"}
                    </Button>
                  </div>
                </div>
              </Section>

              <Section icon={Mail} title="Email (SMTP)" desc="Optional — for transactional email notifications">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="SMTP host"><Input {...register("smtpHost")} className="mt-1.5 h-10 rounded-xl" placeholder="smtp.mailgun.org" /></Field>
                  <Field label="Port"><Input {...register("smtpPort", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" placeholder="587" /></Field>
                </div>
                <Field label="SMTP username"><Input {...register("smtpUser")} className="mt-1.5 h-10 rounded-xl" /></Field>
                <Field label="SMTP password"><MaskedInput name="smtpPassword" register={register} placeholder="Password" /></Field>
                <Field label="From email"><Input {...register("smtpFromEmail")} type="email" className="mt-1.5 h-10 rounded-xl" placeholder="noreply@igotrend.com" /></Field>
                <div className="pt-2 border-t border-border/40">
                  <p className="text-xs text-muted-foreground mb-2">Send a test email to the contact email configured in General settings:</p>
                  <Button
                    type="button"
                    onClick={handleTestEmail}
                    disabled={sendingEmail}
                    size="sm"
                    className="h-9 rounded-xl px-4 gap-1.5 text-xs font-semibold"
                    style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none", color: "#fff" }}
                    data-testid="button-test-email"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {sendingEmail ? "Sending…" : "Send test email"}
                  </Button>
                </div>
              </Section>
            </>
          )}

          <Button type="submit" disabled={updateMutation.isPending}
            className="w-full h-11 rounded-xl font-bold text-base"
            style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
            data-testid="button-save-settings">
            {updateMutation.isPending ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
