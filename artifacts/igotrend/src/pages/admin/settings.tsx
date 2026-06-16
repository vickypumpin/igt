import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Settings2, CreditCard, MessageSquare, Mail, Globe, DollarSign } from "lucide-react";

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

function Section({ icon: Icon, title, desc, children }: { icon: React.ElementType; title: string; desc?: string; children: React.ReactNode }) {
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

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (settings) reset(settings); }, [settings, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    updateMutation.mutate({ data: values }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }); toast({ title: "Settings saved ✓" }); },
      onError: () => { toast({ title: "Failed to save settings", variant: "destructive" }); },
    });
  };

  if (isLoading) return <AdminLayout><div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl" data-testid="page-admin-settings">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure iGoTrend — changes take effect immediately</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Section icon={Settings2} title="General">
            <Field label="Site name"><Input {...register("siteName")} className="mt-1.5 h-10 rounded-xl" data-testid="input-site-name" /></Field>
            <Field label="Site description"><Input {...register("siteDescription")} className="mt-1.5 h-10 rounded-xl" /></Field>
            <Field label="Contact email"><Input {...register("contactEmail")} type="email" className="mt-1.5 h-10 rounded-xl" data-testid="input-contact-email" /></Field>
          </Section>

          <Section icon={DollarSign} title="Fees & Pricing">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Gem price ($)"><Input {...register("gemPrice", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-gem-price" /></Field>
              <Field label="Gem service fee (%)"><Input {...register("gemServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-gem-fee" /></Field>
              <Field label="Creator fee (%)"><Input {...register("creatorServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-creator-fee" /></Field>
              <Field label="Brand fee (%)"><Input {...register("brandServiceFee", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" data-testid="input-brand-fee" /></Field>
            </div>
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

          <Section icon={MessageSquare} title="Twilio SMS" desc="Optional — for SMS notifications to creators">
            <Field label="Account SID"><MaskedInput name="twilioAccountSid" register={register} placeholder="AC…" /></Field>
            <Field label="Auth token"><MaskedInput name="twilioAuthToken" register={register} placeholder="Auth token" /></Field>
            <Field label="Phone number"><Input {...register("twilioPhoneNumber")} className="mt-1.5 h-10 rounded-xl" placeholder="+1234567890" /></Field>
          </Section>

          <Section icon={Mail} title="Email (SMTP)" desc="Optional — for email notifications">
            <div className="grid grid-cols-2 gap-3">
              <Field label="SMTP host"><Input {...register("smtpHost")} className="mt-1.5 h-10 rounded-xl" placeholder="smtp.mailgun.org" /></Field>
              <Field label="Port"><Input {...register("smtpPort", { valueAsNumber: true })} type="number" className="mt-1.5 h-10 rounded-xl" placeholder="587" /></Field>
            </div>
            <Field label="SMTP username"><Input {...register("smtpUser")} className="mt-1.5 h-10 rounded-xl" /></Field>
            <Field label="SMTP password"><MaskedInput name="smtpPassword" register={register} placeholder="Password" /></Field>
            <Field label="From email"><Input {...register("smtpFromEmail")} type="email" className="mt-1.5 h-10 rounded-xl" placeholder="noreply@igotrend.com" /></Field>
          </Section>

          <Section icon={Globe} title="Social Links">
            <Field label="Facebook URL"><Input {...register("facebookUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://facebook.com/…" /></Field>
            <Field label="Instagram URL"><Input {...register("instagramUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://instagram.com/…" /></Field>
            <Field label="YouTube URL"><Input {...register("youtubeUrl")} className="mt-1.5 h-10 rounded-xl" placeholder="https://youtube.com/…" /></Field>
          </Section>

          <Button type="submit" disabled={updateMutation.isPending}
            className="w-full h-11 rounded-xl font-bold text-base"
            style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
            data-testid="button-save-settings">
            {updateMutation.isPending ? "Saving…" : "Save all settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
