import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useGetSettings, useUpdateSettings, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const updateMutation = useUpdateSettings();
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => { if (settings) reset(settings); }, [settings, reset]);

  const onSubmit = (values: Record<string, unknown>) => {
    updateMutation.mutate({ data: values }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() }); toast({ title: "Settings saved" }); },
    });
  };

  if (isLoading) return <AdminLayout><div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="max-w-2xl" data-testid="page-admin-settings">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Platform Settings</h1>
          <p className="text-sm text-muted-foreground">Configure the iGoTrend platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">General</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Site name</label><Input {...register("siteName")} className="mt-1" data-testid="input-site-name" /></div>
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
            <CardHeader className="pb-3"><CardTitle className="text-sm">Social Links</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><label className="text-xs font-medium text-muted-foreground">Facebook URL</label><Input {...register("facebookUrl")} className="mt-1" data-testid="input-facebook-url" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">Instagram URL</label><Input {...register("instagramUrl")} className="mt-1" data-testid="input-instagram-url" /></div>
              <div><label className="text-xs font-medium text-muted-foreground">YouTube URL</label><Input {...register("youtubeUrl")} className="mt-1" data-testid="input-youtube-url" /></div>
            </CardContent>
          </Card>

          <Button type="submit" disabled={updateMutation.isPending} data-testid="button-save-settings">
            {updateMutation.isPending ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
}
