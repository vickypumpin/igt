import { useState, useEffect } from "react";
import { useAccountProfile, useUpdateAccountProfile, getAccountProfileQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, Instagram, Camera, MapPin, DollarSign } from "lucide-react";
import { AvatarUpload } from "@/components/AvatarUpload";
import { CountrySelect } from "@/components/CountrySelect";
import { StateSelect } from "@/components/StateSelect";
import { TagMultiSelect } from "@/components/TagMultiSelect";

const CONTENT_CATEGORIES = [
  "Lifestyle", "Fashion", "Tech", "Beauty", "Food", "Travel", "Comedy",
  "Music", "Sports", "Gaming", "Education", "Business", "Health",
  "Parenting", "Finance", "Entertainment", "News", "Politics", "Others",
];

const CREATOR_CATEGORIES = [
  "Nano", "Micro", "Mid-tier", "Macro", "Mega",
];

type FormState = {
  firstName: string; lastName: string; email: string; userName: string; phone: string;
  bio: string; dob: string; avatarUrl: string;
  creatorCategory: string; contentCategory: string;
  countryId: string; stateId: string;
  instagramProfile: string; instagramFollowers: string;
  facebookProfile: string; facebookFollowers: string;
  twitterProfile: string; twitterFollowers: string;
  youtubeProfile: string; youtubeFollowers: string;
  tiktokProfile: string; tiktokFollowers: string;
  snapchatProfile: string; snapchatFollowers: string;
  instagramDayPostPrice: string; instagramWeekPostPrice: string;
  instagramDayStoryPrice: string; instagramWeekStoryPrice: string;
  instagramDayReelPrice: string; instagramWeekReelPrice: string;
  instagramDayLivePrice: string; instagramWeekLivePrice: string;
  tiktokDayPostPrice: string; tiktokWeekPostPrice: string;
  youtubeDayPostPrice: string; youtubeWeekPostPrice: string;
  twitterDayPostPrice: string; twitterWeekPostPrice: string;
  snapchatDayStoryPrice: string; snapchatWeekStoryPrice: string;
};

const EMPTY: FormState = {
  firstName: "", lastName: "", email: "", userName: "", phone: "", bio: "", dob: "", avatarUrl: "",
  creatorCategory: "", contentCategory: "", countryId: "", stateId: "",
  instagramProfile: "", instagramFollowers: "",
  facebookProfile: "", facebookFollowers: "",
  twitterProfile: "", twitterFollowers: "",
  youtubeProfile: "", youtubeFollowers: "",
  tiktokProfile: "", tiktokFollowers: "",
  snapchatProfile: "", snapchatFollowers: "",
  instagramDayPostPrice: "", instagramWeekPostPrice: "",
  instagramDayStoryPrice: "", instagramWeekStoryPrice: "",
  instagramDayReelPrice: "", instagramWeekReelPrice: "",
  instagramDayLivePrice: "", instagramWeekLivePrice: "",
  tiktokDayPostPrice: "", tiktokWeekPostPrice: "",
  youtubeDayPostPrice: "", youtubeWeekPostPrice: "",
  twitterDayPostPrice: "", twitterWeekPostPrice: "",
  snapchatDayStoryPrice: "", snapchatWeekStoryPrice: "",
};

const PRICE_KEYS: (keyof FormState)[] = [
  "instagramDayPostPrice", "instagramWeekPostPrice", "instagramDayStoryPrice", "instagramWeekStoryPrice",
  "instagramDayReelPrice", "instagramWeekReelPrice", "instagramDayLivePrice", "instagramWeekLivePrice",
  "tiktokDayPostPrice", "tiktokWeekPostPrice",
  "youtubeDayPostPrice", "youtubeWeekPostPrice",
  "twitterDayPostPrice", "twitterWeekPostPrice",
  "snapchatDayStoryPrice", "snapchatWeekStoryPrice",
];

const FOLLOWER_KEYS: (keyof FormState)[] = [
  "instagramFollowers", "facebookFollowers", "twitterFollowers",
  "youtubeFollowers", "tiktokFollowers", "snapchatFollowers",
];

type AnyProfile = Record<string, unknown>;

export default function CreatorAccountEditPage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useAccountProfile();
  const updateMutation = useUpdateAccountProfile();
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (profile) {
      const p = profile as unknown as AnyProfile;
      setForm({
        firstName: profile.firstName ?? "", lastName: profile.lastName ?? "",
        email: profile.email ?? "",
        userName: profile.userName ?? "", phone: profile.phone ?? "", bio: profile.bio ?? "",
        dob: profile.dob ?? "", avatarUrl: profile.avatarUrl ?? "",
        creatorCategory: profile.creatorCategory ?? "", contentCategory: profile.contentCategory ?? "",
        countryId: profile.countryId ? String(profile.countryId) : "",
        stateId: profile.stateId ? String(profile.stateId) : "",
        instagramProfile: profile.instagramProfile ?? "", instagramFollowers: String(p["instagramFollowers"] ?? ""),
        facebookProfile: profile.facebookProfile ?? "", facebookFollowers: String(p["facebookFollowers"] ?? ""),
        twitterProfile: profile.twitterProfile ?? "", twitterFollowers: String(p["twitterFollowers"] ?? ""),
        youtubeProfile: profile.youtubeProfile ?? "", youtubeFollowers: String(p["youtubeFollowers"] ?? ""),
        tiktokProfile: profile.tiktokProfile ?? "", tiktokFollowers: String(p["tiktokFollowers"] ?? ""),
        snapchatProfile: profile.snapchatProfile ?? "", snapchatFollowers: String(p["snapchatFollowers"] ?? ""),
        instagramDayPostPrice: String(profile.instagramDayPostPrice ?? ""),
        instagramWeekPostPrice: String(profile.instagramWeekPostPrice ?? ""),
        instagramDayStoryPrice: String(profile.instagramDayStoryPrice ?? ""),
        instagramWeekStoryPrice: String(profile.instagramWeekStoryPrice ?? ""),
        instagramDayReelPrice: String(profile.instagramDayReelPrice ?? ""),
        instagramWeekReelPrice: String(profile.instagramWeekReelPrice ?? ""),
        instagramDayLivePrice: String(profile.instagramDayLivePrice ?? ""),
        instagramWeekLivePrice: String(profile.instagramWeekLivePrice ?? ""),
        tiktokDayPostPrice: String(profile.tiktokDayPostPrice ?? ""),
        tiktokWeekPostPrice: String(profile.tiktokWeekPostPrice ?? ""),
        youtubeDayPostPrice: String(profile.youtubeDayPostPrice ?? ""),
        youtubeWeekPostPrice: String(profile.youtubeWeekPostPrice ?? ""),
        twitterDayPostPrice: String(profile.twitterDayPostPrice ?? ""),
        twitterWeekPostPrice: String(profile.twitterWeekPostPrice ?? ""),
        snapchatDayStoryPrice: String(profile.snapchatDayStoryPrice ?? ""),
        snapchatWeekStoryPrice: String(profile.snapchatWeekStoryPrice ?? ""),
      });
    }
  }, [profile]);

  const field = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleCountryChange = (countryId: string) => {
    setForm(f => ({ ...f, countryId, stateId: "" }));
  };

  const handleSave = () => {
    const payload: Record<string, unknown> = {
      firstName: form.firstName, lastName: form.lastName,
      email: form.email || undefined,
      userName: form.userName,
      phone: form.phone || null, bio: form.bio || null, dob: form.dob || null,
      avatarUrl: form.avatarUrl || null,
      creatorCategory: form.creatorCategory || null, contentCategory: form.contentCategory || null,
      countryId: form.countryId ? parseInt(form.countryId, 10) : null,
      stateId: form.stateId ? parseInt(form.stateId, 10) : null,
      instagramProfile: form.instagramProfile || null, facebookProfile: form.facebookProfile || null,
      twitterProfile: form.twitterProfile || null, youtubeProfile: form.youtubeProfile || null,
      tiktokProfile: form.tiktokProfile || null, snapchatProfile: form.snapchatProfile || null,
    };
    for (const k of PRICE_KEYS) {
      payload[k] = form[k] ? parseInt(String(form[k]), 10) : null;
    }
    for (const k of FOLLOWER_KEYS) {
      payload[k] = form[k] ? parseInt(String(form[k]), 10) : null;
    }

    updateMutation.mutate(payload as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAccountProfileQueryKey() });
        toast({ title: "Profile saved ✓" });
      },
      onError: () => toast({ title: "Failed to save profile", variant: "destructive" }),
    });
  };

  if (isLoading) return (
    <CreatorLayout>
      <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
    </CreatorLayout>
  );

  return (
    <CreatorLayout>
      <div data-testid="page-creator-account-edit" className="max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Account</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update your creator profile and platform rates</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}
            className="rounded-xl font-semibold px-6"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
            data-testid="btn-save-profile">
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-5">
          {/* Profile photo */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><Camera className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Profile Photo</div>
            </div>
            <div className="flex items-center gap-5">
              <AvatarUpload
                currentUrl={form.avatarUrl}
                initials={form.firstName[0] ?? "?"}
                onUpload={(url) => {
                  setForm(f => ({ ...f, avatarUrl: url }));
                  updateMutation.mutate({ avatarUrl: url } as Parameters<typeof updateMutation.mutate>[0], {
                    onSuccess: () => {
                      queryClient.invalidateQueries({ queryKey: getAccountProfileQueryKey() });
                      toast({ title: "Profile photo saved ✓" });
                    },
                    onError: () => toast({ title: "Failed to save photo", variant: "destructive" }),
                  });
                }}
                size={80}
              />
              <div>
                <p className="text-sm font-semibold">Profile Photo</p>
                <p className="text-xs text-muted-foreground mt-0.5">Click the circle to upload a photo (JPEG, PNG, or WEBP · max 5 MB). Saves instantly on upload.</p>
              </div>
            </div>
          </div>

          {/* Basic info */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><User className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Basic Information</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email address</label>
                <div className="relative">
                  <Input value={form.email} readOnly disabled type="email" className="h-10 rounded-xl pr-9 bg-muted/40 cursor-not-allowed text-muted-foreground" data-testid="input-email" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed. Contact support if needed.</p>
              </div>
              {([["First name", "firstName"], ["Last name", "lastName"], ["Username", "userName"], ["Phone", "phone"], ["Date of birth", "dob"]] as [string, keyof FormState][]).map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Creator category</label>
                <TagMultiSelect
                  options={CREATOR_CATEGORIES}
                  value={form.creatorCategory}
                  onChange={(v) => setForm(f => ({ ...f, creatorCategory: v }))}
                  placeholder="Select creator type…"
                  data-testid="input-creatorCategory"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Content category</label>
                <TagMultiSelect
                  options={CONTENT_CATEGORIES}
                  value={form.contentCategory}
                  onChange={(v) => setForm(f => ({ ...f, contentCategory: v }))}
                  placeholder="Select content categories…"
                  data-testid="input-contentCategory"
                />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={field("bio")} rows={3} className="w-full rounded-xl border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-bio" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}><MapPin className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Location</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Country</label>
                <CountrySelect
                  value={form.countryId}
                  onChange={handleCountryChange}
                  data-testid="input-countryId"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">State / Region</label>
                <StateSelect
                  value={form.stateId}
                  onChange={(v) => setForm(f => ({ ...f, stateId: v }))}
                  countryId={form.countryId}
                  data-testid="input-stateId"
                />
              </div>
            </div>
          </div>

          {/* Social profiles + followers */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}><Instagram className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Social Profiles</div>
            </div>
            <div className="space-y-4">
              {([
                ["Instagram", "instagramProfile", "instagramFollowers", "@handle"],
                ["TikTok", "tiktokProfile", "tiktokFollowers", "@handle"],
                ["YouTube", "youtubeProfile", "youtubeFollowers", "Channel URL"],
                ["Twitter / X", "twitterProfile", "twitterFollowers", "@handle"],
                ["Facebook", "facebookProfile", "facebookFollowers", "Profile URL"],
                ["Snapchat", "snapchatProfile", "snapchatFollowers", "@handle"],
              ] as [string, keyof FormState, keyof FormState, string][]).map(([platform, handleKey, followerKey, placeholder]) => (
                <div key={platform} className="grid grid-cols-3 gap-3 items-end">
                  <div className="col-span-2">
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{platform} handle</label>
                    <Input value={form[handleKey]} onChange={field(handleKey)} placeholder={placeholder} className="h-10 rounded-xl" data-testid={`input-${handleKey}`} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Followers</label>
                    <Input type="number" value={form[followerKey]} onChange={field(followerKey)} placeholder="0" className="h-10 rounded-xl" data-testid={`input-${followerKey}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform rates */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}><DollarSign className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Platform Rates (₦)</div>
              <p className="text-xs text-muted-foreground ml-auto">Your per-post fee</p>
            </div>
            <div className="space-y-5">
              {[
                { platform: "Instagram", fields: [["Post/day", "instagramDayPostPrice"], ["Post/week", "instagramWeekPostPrice"], ["Story/day", "instagramDayStoryPrice"], ["Story/week", "instagramWeekStoryPrice"], ["Reel/day", "instagramDayReelPrice"], ["Reel/week", "instagramWeekReelPrice"], ["Live/day", "instagramDayLivePrice"], ["Live/week", "instagramWeekLivePrice"]] as const },
                { platform: "TikTok", fields: [["Post/day", "tiktokDayPostPrice"], ["Post/week", "tiktokWeekPostPrice"]] as const },
                { platform: "YouTube", fields: [["Video/day", "youtubeDayPostPrice"], ["Video/week", "youtubeWeekPostPrice"]] as const },
                { platform: "Twitter/X", fields: [["Post/day", "twitterDayPostPrice"], ["Post/week", "twitterWeekPostPrice"]] as const },
                { platform: "Snapchat", fields: [["Story/day", "snapchatDayStoryPrice"], ["Story/week", "snapchatWeekStoryPrice"]] as const },
              ].map(({ platform, fields }) => (
                <div key={platform}>
                  <div className="text-xs font-bold text-muted-foreground mb-2">{platform}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(fields as readonly (readonly [string, keyof FormState])[]).map(([label, key]) => (
                      <div key={key}>
                        <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                        <Input type="number" value={form[key]} onChange={field(key)} placeholder="0" className="h-10 rounded-xl" data-testid={`input-${key}`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CreatorLayout>
  );
}
