import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateCampaign, useGetMe, getListCampaignsQueryKey, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, CheckCircle2, Gem, AlertTriangle, ExternalLink } from "lucide-react";
import { Link } from "wouter";

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
  gemsPerCreator: z.number().min(0).default(0),
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

const STEPS = [
  { label: "Campaign Details", desc: "Name, type, dates" },
  { label: "Deliverables", desc: "Platform post counts" },
  { label: "Brief", desc: "Caption guide, do's & don'ts" },
];

export default function CampaignNewPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const createMutation = useCreateCampaign();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "", sponsor: "", description: "", kpis: "", type: "influencer", campaignDuration: "day",
      startDate: "", endDate: "", noOfCreators: 5, gemsPerCreator: 0,
      postCaptionText: "", handlesHash: "", dos: "", donts: "",
      dailyInstagramPost: 0, dailyInstagramStoryPost: 0, dailyInstagramReel: 0, dailyTiktokPost: 0,
      dailyYoutubePost: 0, dailyTwitterPost: 0, weeklyInstagramPost: 0, weeklyTiktokPost: 0,
      weeklyYoutubePost: 0, weeklyTwitterPost: 0,
    },
  });

  const noOfCreators = form.watch("noOfCreators") ?? 0;
  const gemsPerCreator = form.watch("gemsPerCreator") ?? 0;
  const totalBudget = noOfCreators * gemsPerCreator;
  const availableGems = me?.gems ?? 0;
  const hasEnoughGems = totalBudget === 0 || availableGems >= totalBudget;
  const shortfall = hasEnoughGems ? 0 : totalBudget - availableGems;

  const onSubmit = (values: FormData) => {
    createMutation.mutate({ data: {
      name: values.name, sponsor: values.sponsor, description: values.description, kpis: values.kpis,
      type: values.type, campaignDuration: values.campaignDuration, startDate: values.startDate,
      endDate: values.endDate, noOfCreators: values.noOfCreators, gemsPerCreator: values.gemsPerCreator,
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
        toast({ title: "Campaign created! 🎉", description: totalBudget > 0 ? `${totalBudget.toLocaleString()} gems will be reserved when the campaign is approved.` : undefined });
        setLocation(`/campaigns/${campaign.id}`);
      },
      onError: () => { toast({ title: "Failed to create campaign", variant: "destructive" }); },
    });
  };

  const inputCls = "h-10 rounded-xl border-border/60 focus:border-primary";
  const selectCls = "flex h-10 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring";
  const labelCls = "text-sm font-semibold";

  return (
    <BrandLayout>
      <div className="max-w-2xl mx-auto" data-testid="page-campaign-new">
        <div className="mb-7">
          <h1 className="text-2xl font-extrabold">New Campaign</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Fill in the details to launch your campaign</p>

          {/* Step indicators */}
          <div className="flex items-center mt-5 gap-0">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                    style={i < step ? { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" } : i === step ? { background: "linear-gradient(135deg, #6B2FCE, #4E22A8)", color: "white" } : { background: "#f3f4f6", color: "#9ca3af" }}>
                    {i < step ? <CheckCircle2 className="h-4 w-4 text-white" /> : i + 1}
                  </div>
                  <div className="hidden sm:block">
                    <div className={`text-xs font-semibold ${i === step ? "text-foreground" : i < step ? "text-muted-foreground" : "text-muted-foreground"}`}>{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="w-8 sm:w-12 h-px mx-2" style={{ background: i < step ? "#1DCFB3" : "#e5e7eb" }} />}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {step === 0 && (
                <div className="space-y-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>Campaign name</FormLabel><FormControl><Input {...field} className={inputCls} placeholder="Q3 Brand Awareness" data-testid="input-campaign-name" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="sponsor" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>Sponsor / Brand</FormLabel><FormControl><Input {...field} className={inputCls} placeholder="Acme Corp" data-testid="input-sponsor" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem><FormLabel className={labelCls}>Campaign type</FormLabel><FormControl><select {...field} className={selectCls} data-testid="select-type"><option value="influencer">Influencer</option><option value="content_creator">Content Creator</option></select></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="campaignDuration" render={({ field }) => (
                      <FormItem><FormLabel className={labelCls}>Duration type</FormLabel><FormControl><select {...field} className={selectCls} data-testid="select-duration"><option value="day">Daily</option><option value="weekly">Weekly</option></select></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="startDate" render={({ field }) => (
                      <FormItem><FormLabel className={labelCls}>Start date</FormLabel><FormControl><Input {...field} type="date" className={inputCls} data-testid="input-start-date" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="endDate" render={({ field }) => (
                      <FormItem><FormLabel className={labelCls}>End date</FormLabel><FormControl><Input {...field} type="date" className={inputCls} data-testid="input-end-date" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="noOfCreators" render={({ field }) => (
                      <FormItem><FormLabel className={labelCls}>Number of creators</FormLabel><FormControl><Input {...field} type="number" min={1} className={inputCls} onChange={e => field.onChange(parseInt(e.target.value, 10))} data-testid="input-creators-count" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="gemsPerCreator" render={({ field }) => (
                      <FormItem>
                        <FormLabel className={labelCls}>Gems per creator</FormLabel>
                        <FormControl><Input {...field} type="number" min={0} className={inputCls} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} data-testid="input-gems-per-creator" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  {/* Budget summary & balance warning */}
                  {totalBudget > 0 && (
                    <div className={`rounded-xl p-4 border ${hasEnoughGems ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`} data-testid="budget-summary">
                      <div className="flex items-center gap-2 mb-2">
                        {hasEnoughGems
                          ? <Gem className="h-4 w-4 text-emerald-600" />
                          : <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span className={`text-sm font-semibold ${hasEnoughGems ? "text-emerald-700" : "text-red-600"}`}>
                          {hasEnoughGems ? "Budget will be reserved on approval" : "Insufficient gems — top up before admin approval"}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total budget ({noOfCreators} creators × {gemsPerCreator} gems)</span>
                          <span className="font-bold">{totalBudget.toLocaleString()} gems</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Your available gems</span>
                          <span className={`font-bold ${hasEnoughGems ? "text-emerald-600" : "text-red-600"}`}>{availableGems.toLocaleString()} gems</span>
                        </div>
                        {!hasEnoughGems && (
                          <div className="flex justify-between mt-1 pt-1 border-t border-red-200">
                            <span className="text-red-600 font-semibold">Shortfall</span>
                            <span className="text-red-600 font-bold">{shortfall.toLocaleString()} gems needed</span>
                          </div>
                        )}
                      </div>
                      {!hasEnoughGems && (
                        <Link href={`/billing?shortfall=${shortfall}`}>
                          <button type="button" className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 underline underline-offset-2" data-testid="link-top-up">
                            <ExternalLink className="h-3 w-3" /> Top up gems now
                          </button>
                        </Link>
                      )}
                    </div>
                  )}

                  <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>Campaign description</FormLabel><FormControl><Textarea {...field} rows={3} className="rounded-xl" data-testid="input-description" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="kpis" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>KPIs / Objectives</FormLabel><FormControl><Textarea {...field} rows={2} placeholder="Brand awareness, 10k impressions…" className="rounded-xl" data-testid="input-kpis" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">Set post counts per platform. Leave at 0 if not applicable.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { name: "dailyInstagramPost" as const, label: "IG Posts / day", color: "#E1306C" },
                      { name: "dailyInstagramStoryPost" as const, label: "IG Stories / day", color: "#E1306C" },
                      { name: "dailyInstagramReel" as const, label: "IG Reels / day", color: "#E1306C" },
                      { name: "dailyTiktokPost" as const, label: "TikTok Posts / day", color: "#000000" },
                      { name: "dailyYoutubePost" as const, label: "YouTube / day", color: "#FF0000" },
                      { name: "dailyTwitterPost" as const, label: "Twitter / day", color: "#1DA1F2" },
                      { name: "weeklyInstagramPost" as const, label: "IG Posts / week", color: "#E1306C" },
                      { name: "weeklyTiktokPost" as const, label: "TikTok / week", color: "#000000" },
                      { name: "weeklyYoutubePost" as const, label: "YouTube / week", color: "#FF0000" },
                      { name: "weeklyTwitterPost" as const, label: "Twitter / week", color: "#1DA1F2" },
                    ].map(({ name, label, color }) => (
                      <FormField key={name} control={form.control} name={name} render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold" style={{ color }}>{label}</FormLabel>
                          <FormControl><Input {...field} type="number" min={0} className="h-9 rounded-xl" onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} data-testid={`input-${name}`} /></FormControl>
                        </FormItem>
                      )} />
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <FormField control={form.control} name="postCaptionText" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>Post caption guide</FormLabel><FormControl><Textarea {...field} rows={3} placeholder="Suggested caption template…" className="rounded-xl" data-testid="input-caption" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="handlesHash" render={({ field }) => (
                    <FormItem><FormLabel className={labelCls}>Required handles & hashtags</FormLabel><FormControl><Input {...field} className={inputCls} placeholder="@brand #campaign" data-testid="input-handles" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField control={form.control} name="dos" render={({ field }) => (
                      <FormItem><FormLabel className={`${labelCls} text-emerald-600`}>Do's ✓</FormLabel><FormControl><Textarea {...field} rows={4} className="rounded-xl border-emerald-200" data-testid="input-dos" /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={form.control} name="donts" render={({ field }) => (
                      <FormItem><FormLabel className={`${labelCls} text-red-500`}>Don'ts ✗</FormLabel><FormControl><Textarea {...field} rows={4} className="rounded-xl border-red-200" data-testid="input-donts" /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>

                  {/* Final budget reminder */}
                  {totalBudget > 0 && (
                    <div className={`rounded-xl p-4 border ${hasEnoughGems ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Gem className={`h-4 w-4 ${hasEnoughGems ? "text-emerald-600" : "text-amber-600"}`} />
                        <span className={`text-xs font-semibold ${hasEnoughGems ? "text-emerald-700" : "text-amber-700"}`}>
                          {hasEnoughGems
                            ? `${totalBudget.toLocaleString()} gems will be reserved when admin approves`
                            : `Top up ${shortfall.toLocaleString()} more gems before admin approval`}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        You have {availableGems.toLocaleString()} gems available.
                      </p>
                      {!hasEnoughGems && (
                        <Link href={`/billing?shortfall=${shortfall}`}>
                          <button type="button" className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-2" data-testid="link-top-up-final">
                            <ExternalLink className="h-3 w-3" /> Top up gems
                          </button>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-7 pt-5 border-t border-border/60">
                <Button type="button" variant="outline" className="rounded-xl" onClick={() => step > 0 ? setStep(s => s - 1) : undefined} disabled={step === 0} data-testid="button-prev">
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                {step < STEPS.length - 1 ? (
                  <Button type="button" className="rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} onClick={() => setStep(s => s + 1)} data-testid="button-next">
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button type="submit" className="rounded-xl font-semibold px-6" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} disabled={createMutation.isPending} data-testid="button-submit-campaign">
                    {createMutation.isPending ? "Creating…" : "🚀 Submit for Review"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </div>
    </BrandLayout>
  );
}
