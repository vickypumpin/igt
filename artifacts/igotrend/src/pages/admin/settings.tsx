import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

function MaskedInput({ name, register, placeholder }: { name: string; register: ReturnType<typeof useForm>["register"]; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-1">
      <Input {...register(name)} type={show ? "text" : "password"} placeholder={placeholder} className="pr-9" />
      <button type="button" onClick={() => setShow(s => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (settings) reset(settings); }, [settings, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    updateMutation.mutate({ data: values }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }); toast({ title: "Settings saved" }); },
      onError: () => { toast({ title: "Failed to save settings", variant: "destructive" }); },
    });
  };

  if (isLoading) return <AdminLayout><div className="space-y-3">{Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl" data-testid="page-admin-settings">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure iGoTrend — changes take effect immediately</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">General</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Site name</label><Input {...register("siteName")} className="mt-1" data-testid="input-site-name" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Site description</label><Input {...register("siteDescription")} className="mt-1" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Contact email</label><Input {...register("contactEmail")} type="email" className="mt-1" data-testid="input-contact-email" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Fees & Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">Gem price ($)</label><Input {...register("gemPrice", { valueAsNumber: true })} type="number" className="mt-1" data-testid="input-gem-price" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Gem service fee (%)</label><Input {...register("gemServiceFee", { valueAsNumber: true })} type="number" className="mt-1" data-testid="input-gem-fee" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Creator fee (%)</label><Input {...register("creatorServiceFee", { valueAsNumber: true })} type="number" className="mt-1" data-testid="input-creator-fee" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Brand fee (%)</label><Input {...register("brandServiceFee", { valueAsNumber: true })} type="number" className="mt-1" data-testid="input-brand-fee" /></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Flutterwave Payment Gateway</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Get your keys from <a href="https://dashboard.flutterwave.com/dashboard/settings/apis" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">dashboard.flutterwave.com</a></p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Public key</label>
                <MaskedInput name="flutterwavePublicKey" register={register} placeholder="FLWPUBK_TEST-..." />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Secret key</label>
                <MaskedInput name="flutterwaveSecretKey" register={register} placeholder="FLWSECK_TEST-..." />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Encryption key</label>
                <MaskedInput name="flutterwaveEncryptionKey" register={register} placeholder="FLWENCRYPTKEY..." />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input {...register("flutterwaveLive")} type="checkbox" id="fw-live" className="h-4 w-4 rounded border border-input" />
                <label htmlFor="fw-live" className="text-xs text-muted-foreground">Live mode (uncheck for test/sandbox)</label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Twilio SMS</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Optional — for SMS notifications to creators</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Account SID</label><MaskedInput name="twilioAccountSid" register={register} placeholder="AC..." /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Auth token</label><MaskedInput name="twilioAuthToken" register={register} placeholder="Auth token" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Phone number</label><Input {...register("twilioPhoneNumber")} className="mt-1" placeholder="+1234567890" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Email (SMTP)</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Optional — for email notifications</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium text-muted-foreground">SMTP host</label><Input {...register("smtpHost")} className="mt-1" placeholder="smtp.mailgun.org" /></div>
                <div><label className="text-xs font-medium text-muted-foreground">Port</label><Input {...register("smtpPort", { valueAsNumber: true })} type="number" className="mt-1" placeholder="587" /></div>
              </div>
              <div><label className="text-xs font-medium text-muted-foreground">SMTP username</label><Input {...register("smtpUser")} className="mt-1" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">SMTP password</label><MaskedInput name="smtpPassword" register={register} placeholder="Password" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">From email</label><Input {...register("smtpFromEmail")} type="email" className="mt-1" placeholder="noreply@igotrend.com" /></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Facebook URL</label><Input {...register("facebookUrl")} className="mt-1" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Instagram URL</label><Input {...register("instagramUrl")} className="mt-1" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">YouTube URL</label><Input {...register("youtubeUrl")} className="mt-1" /></div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-settings">
            {updateMutation.isPending ? "Saving..." : "Save all settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
