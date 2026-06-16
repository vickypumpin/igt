import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateSubmission, useListMyInvites, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";

const schema = z.object({
  campaignId: z.number({ required_error: "Select a campaign" }),
  screenshotUrl: z.string().url("Enter a valid URL"),
  platform: z.string().min(1, "Select platform"),
  views: z.number().optional(),
  likes: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

const PLATFORMS = ["instagram", "tiktok", "youtube", "facebook", "twitter", "snapchat"];

export default function SubmitPage() {
  const { toast } = useToast();
  const { data: invites = [] } = useListMyInvites({ status: "active" }, { query: { queryKey: getListMyInvitesQueryKey({ status: "active" }) } });
  const submitMutation = useCreateSubmission();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { screenshotUrl: "", platform: "", views: undefined, likes: undefined },
  });

  const onSubmit = (values: FormData) => {
    submitMutation.mutate({ data: { campaignId: values.campaignId, screenshotUrl: values.screenshotUrl, platform: values.platform, views: values.views ?? null, likes: values.likes ?? null } }, {
      onSuccess: () => {
        toast({ title: "Submission sent!" });
        form.reset();
      },
      onError: () => { toast({ title: "Submission failed", variant: "destructive" }); },
    });
  };

  return (
    <CreatorLayout>
      <div className="max-w-lg" data-testid="page-submit">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Submit Content</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Submit your proof of content for a campaign</p>
        </div>

        {!invites.length ? (
          <div className="text-center py-12 border border-border rounded-lg">
            <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
            <p className="text-sm text-muted-foreground">You don't have any active campaigns to submit for.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="campaignId" render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign</FormLabel>
                  <FormControl>
                    <select {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-campaign">
                      <option value="">Select campaign</option>
                      {invites.map(inv => <option key={inv.id} value={inv.campaignId}>{inv.campaign?.name} — {inv.campaign?.sponsor}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="platform" render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-platform">
                      <option value="">Select platform</option>
                      {PLATFORMS.map(p => <option key={p} value={p} className="capitalize">{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="screenshotUrl" render={({ field }) => (
                <FormItem><FormLabel>Content URL / Screenshot URL</FormLabel><FormControl><Input {...field} placeholder="https://instagram.com/p/..." data-testid="input-url" /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="views" render={({ field }) => (
                  <FormItem><FormLabel>Views</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-views" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="likes" render={({ field }) => (
                  <FormItem><FormLabel>Likes</FormLabel><FormControl><Input {...field} type="number" onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)} data-testid="input-likes" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <Button type="submit" className="w-full" disabled={submitMutation.isPending} data-testid="button-submit">
                {submitMutation.isPending ? "Submitting..." : "Submit Content"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </CreatorLayout>
  );
}
