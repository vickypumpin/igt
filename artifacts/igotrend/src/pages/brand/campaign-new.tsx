import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign, getListCampaignsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, "Campaign name is required"),
  sponsor: z.string().min(1, "Sponsor is required"),
  description: z.string().min(1, "Description is required"),
  kpis: z.string().min(1, "KPIs are required"),
  type: z.enum(["influencer", "content_creator"]),
  campaignDuration: z.enum(["day", "weekly"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  noOfCreators: z.number().min(1),
  postCaptionText: z.string().optional(),
  handlesHash: z.string().optional(),
  dos: z.string().optional(),
  donts: z.string().optional(),
  dailyInstagramPost: z.number().default(0),
  dailyInstagramStoryPost: z.number().default(0),
  dailyInstagramReel: z.number().default(0),
  dailyTiktokPost: z.number().default(0),
  dailyYoutubePost: z.number().default(0),
  dailyTwitterPost: z.number().default(0),
  weeklyInstagramPost: z.number().default(0),
  weeklyTiktokPost: z.number().default(0),
  weeklyYoutubePost: z.number().default(0),
  weeklyTwitterPost: z.number().default(0),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Details", "Deliverables", "Brief"];

export default function CampaignNewPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const createMutation = useCreateCampaign();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", sponsor: "", description: "", kpis: "", type: "influencer", campaignDuration: "day",
      startDate: "", endDate: "", noOfCreators: 5, postCaptionText: "", handlesHash: "", dos: "", donts: "",
      dailyInstagramPost: 0, dailyInstagramStoryPost: 0, dailyInstagramReel: 0, dailyTiktokPost: 0,
      dailyYoutubePost: 0, dailyTwitterPost: 0, weeklyInstagramPost: 0, weeklyTiktokPost: 0,
      weeklyYoutubePost: 0, weeklyTwitterPost: 0,
    },
  });

  const onSubmit = (values: FormData) => {
    createMutation.mutate({ data: {
      name: values.name, sponsor: values.sponsor, description: values.description, kpis: values.kpis,
      type: values.type, campaignDuration: values.campaignDuration, startDate: values.startDate,
      endDate: values.endDate, noOfCreators: values.noOfCreators,
      postCaptionText: values.postCaptionText ?? null, handlesHash: values.handlesHash ?? null,
      dos: values.dos ?? null, donts: values.donts ?? null,
      dailyInstagramPost: values.dailyInstagramPost, dailyInstagramStoryPost: values.dailyInstagramStoryPost,
      dailyInstagramReel: values.dailyInstagramReel, dailyInstagramLive: 0,
      dailyFbPost: 0, dailyFbStoryPost: 0, dailyTiktokPost: values.dailyTiktokPost,
      dailyYoutubePost: values.dailyYoutubePost, dailyYoutubeVideo: 0, dailyYoutubeShort: 0,
      dailyTwitterPost: values.dailyTwitterPost, dailySnapchatStory: 0,
      weeklyInstagramPost: values.weeklyInstagramPost, weeklyInstagramStoryPost: 0,
      weeklyInstagramReel: 0, weeklyFbPost: 0, weeklyTiktokPost: values.weeklyTiktokPost,
      weeklyYoutubePost: values.weeklyYoutubePost, weeklyTwitterPost: values.weeklyTwitterPost, weeklySnapchatStory: 0,
    } }, {
      onSuccess: (campaign) => {
        queryClient.invalidateQueries({ queryKey: getListCampaignsQueryKey() });
        toast({ title: "Campaign created!" });
        setLocation(`/campaigns/${campaign.id}`);
      },
      onError: () => { toast({ title: "Failed to create campaign", variant: "destructive" }); },
    });
  };

  return (
    <BrandLayout>
      <div className="max-w-2xl mx-auto" data-testid="page-campaign-new">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">New Campaign</h1>
          <div className="flex items-center gap-2 mt-3">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{i + 1}</div>
                <span className={`text-sm ${i === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < STEPS.length - 1 && <div className="w-8 h-px bg-border mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 0 && (
              <div className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Campaign name</FormLabel><FormControl><Input {...field} placeholder="Q3 Brand Awareness" data-testid="input-campaign-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="sponsor" render={({ field }) => (
                  <FormItem><FormLabel>Sponsor / Brand</FormLabel><FormControl><Input {...field} placeholder="Acme Corp" data-testid="input-sponsor" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>Campaign type</FormLabel>
                      <FormControl>
                        <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-type">
                          <option value="influencer">Influencer</option>
                          <option value="content_creator">Content Creator</option>
                        </select>
                      </FormControl><FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="campaignDuration" render={({ field }) => (
                    <FormItem><FormLabel>Duration type</FormLabel>
                      <FormControl>
                        <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" data-testid="select-duration">
                          <option value="day">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </FormControl><FormMessage />
                    </FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="startDate" render={({ field }) => (
                    <FormItem><FormLabel>Start date</FormLabel><FormControl><Input {...field} type="date" data-testid="input-start-date" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="endDate" render={({ field }) => (
                    <FormItem><FormLabel>End date</FormLabel><FormControl><Input {...field} type="date" data-testid="input-end-date" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="noOfCreators" render={({ field }) => (
                  <FormItem><FormLabel>Number of creators</FormLabel><FormControl><Input {...field} type="number" min={1} onChange={e => field.onChange(parseInt(e.target.value, 10))} data-testid="input-creators-count" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Campaign description</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-description" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="kpis" render={({ field }) => (
                  <FormItem><FormLabel>KPIs / Objectives</FormLabel><FormControl><Textarea {...field} rows={2} placeholder="Brand awareness, 10k impressions..." data-testid="input-kpis" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Set daily deliverable counts per platform. Leave at 0 if not applicable.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "dailyInstagramPost" as const, label: "IG Posts/day" },
                    { name: "dailyInstagramStoryPost" as const, label: "IG Stories/day" },
                    { name: "dailyInstagramReel" as const, label: "IG Reels/day" },
                    { name: "dailyTiktokPost" as const, label: "TikTok Posts/day" },
                    { name: "dailyYoutubePost" as const, label: "YouTube/day" },
                    { name: "dailyTwitterPost" as const, label: "Twitter/day" },
                    { name: "weeklyInstagramPost" as const, label: "IG Posts/week" },
                    { name: "weeklyTiktokPost" as const, label: "TikTok/week" },
                    { name: "weeklyYoutubePost" as const, label: "YouTube/week" },
                    { name: "weeklyTwitterPost" as const, label: "Twitter/week" },
                  ].map(({ name, label }) => (
                    <FormField key={name} control={form.control} name={name} render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">{label}</FormLabel>
                        <FormControl><Input {...field} type="number" min={0} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} className="h-8" data-testid={`input-${name}`} /></FormControl>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <FormField control={form.control} name="postCaptionText" render={({ field }) => (
                  <FormItem><FormLabel>Post caption guide</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="Suggested caption template..." data-testid="input-caption" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="handlesHash" render={({ field }) => (
                  <FormItem><FormLabel>Required handles & hashtags</FormLabel><FormControl><Input {...field} placeholder="@brand #campaign" data-testid="input-handles" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="dos" render={({ field }) => (
                  <FormItem><FormLabel>Do's</FormLabel><FormControl><Textarea {...field} rows={2} data-testid="input-dos" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="donts" render={({ field }) => (
                  <FormItem><FormLabel>Don'ts</FormLabel><FormControl><Textarea {...field} rows={2} data-testid="input-donts" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={() => step > 0 ? setStep(s => s - 1) : undefined} disabled={step === 0} data-testid="button-prev">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={() => setStep(s => s + 1)} data-testid="button-next">
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-campaign">
                  {createMutation.isPending ? "Creating..." : "Create Campaign"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </BrandLayout>
  );
}
