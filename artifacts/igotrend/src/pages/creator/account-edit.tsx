import { useState, useEffect } from "react";
import { useGetMe, useUpdateProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User, Instagram, Twitter, Youtube, Globe, Camera } from "lucide-react";

export default function CreatorAccountEditPage() {
  const { toast } = useToast();
  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateMutation = useUpdateProfile();

  const [form, setForm] = useState({
    firstName: "", lastName: "", userName: "", phone: "", bio: "", dob: "",
    instagramProfile: "", facebookProfile: "", twitterProfile: "",
    youtubeProfile: "", tiktokProfile: "", snapchatProfile: "",
    creatorCategory: "", contentCategory: "",
    instagramDayPostPrice: "", instagramWeekPostPrice: "",
    instagramDayStoryPrice: "", instagramWeekStoryPrice: "",
    tiktokDayPostPrice: "", tiktokWeekPostPrice: "",
    youtubeDayPostPrice: "", youtubeWeekPostPrice: "",
    twitterDayPostPrice: "", twitterWeekPostPrice: "",
  });

  useEffect(() => {
    if (me) {
      setForm({
        firstName: me.firstName ?? "", lastName: me.lastName ?? "",
        userName: me.userName ?? "", phone: me.phone ?? "", bio: me.bio ?? "", dob: (me as Record<string, string>).dob ?? "",
        instagramProfile: me.instagramProfile ?? "", facebookProfile: me.facebookProfile ?? "",
        twitterProfile: me.twitterProfile ?? "", youtubeProfile: me.youtubeProfile ?? "",
        tiktokProfile: me.tiktokProfile ?? "", snapchatProfile: me.snapchatProfile ?? "",
        creatorCategory: me.creatorCategory ?? "", contentCategory: me.contentCategory ?? "",
        instagramDayPostPrice: String(me.instagramDayPostPrice ?? ""),
        instagramWeekPostPrice: String(me.instagramWeekPostPrice ?? ""),
        instagramDayStoryPrice: String(me.instagramDayStoryPrice ?? ""),
        instagramWeekStoryPrice: String(me.instagramWeekStoryPrice ?? ""),
        tiktokDayPostPrice: String(me.tiktokDayPostPrice ?? ""),
        tiktokWeekPostPrice: String(me.tiktokWeekPostPrice ?? ""),
        youtubeDayPostPrice: String(me.youtubeDayPostPrice ?? ""),
        youtubeWeekPostPrice: String(me.youtubeWeekPostPrice ?? ""),
        twitterDayPostPrice: String(me.twitterDayPostPrice ?? ""),
        twitterWeekPostPrice: String(me.twitterWeekPostPrice ?? ""),
      });
    }
  }, [me]);

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    const payload: Record<string, unknown> = { ...form };
    const priceKeys = ["instagramDayPostPrice", "instagramWeekPostPrice", "instagramDayStoryPrice", "instagramWeekStoryPrice", "tiktokDayPostPrice", "tiktokWeekPostPrice", "youtubeDayPostPrice", "youtubeWeekPostPrice", "twitterDayPostPrice", "twitterWeekPostPrice"];
    for (const k of priceKeys) {
      payload[k] = form[k as keyof typeof form] ? parseInt(form[k as keyof typeof form], 10) : null;
    }
    updateMutation.mutate({ data: payload } as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Profile saved ✓" });
      },
      onError: () => toast({ title: "Failed to save profile", variant: "destructive" }),
    });
  };

  if (isLoading) return <CreatorLayout><div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div></CreatorLayout>;

  return (
    <CreatorLayout>
      <div data-testid="page-creator-account-edit" className="max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Account</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update your creator profile and platform rates</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl font-semibold px-6" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="btn-save-profile">
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><User className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Basic Information</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First name", key: "firstName" as const },
                { label: "Last name", key: "lastName" as const },
                { label: "Username", key: "userName" as const },
                { label: "Phone", key: "phone" as const },
                { label: "Date of birth", key: "dob" as const },
                { label: "Creator category", key: "creatorCategory" as const },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
              <div className="col-span-2">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bio</label>
                <textarea value={form.bio} onChange={field("bio")} rows={3} className="w-full rounded-xl border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-bio" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}><Instagram className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Social Profiles</div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Instagram handle", key: "instagramProfile" as const, placeholder: "@handle" },
                { label: "TikTok handle", key: "tiktokProfile" as const, placeholder: "@handle" },
                { label: "YouTube channel", key: "youtubeProfile" as const, placeholder: "Channel URL or handle" },
                { label: "Twitter/X handle", key: "twitterProfile" as const, placeholder: "@handle" },
                { label: "Facebook profile", key: "facebookProfile" as const, placeholder: "Profile URL" },
                { label: "Snapchat handle", key: "snapchatProfile" as const, placeholder: "@handle" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} placeholder={placeholder} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}><Camera className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Platform Rates (₦)</div>
              <p className="text-xs text-muted-foreground ml-auto">Enter your per-post fee</p>
            </div>
            <div className="space-y-4">
              {[
                { platform: "Instagram", keys: [["Post/day", "instagramDayPostPrice"], ["Post/week", "instagramWeekPostPrice"], ["Story/day", "instagramDayStoryPrice"], ["Story/week", "instagramWeekStoryPrice"]] as const },
                { platform: "TikTok", keys: [["Post/day", "tiktokDayPostPrice"], ["Post/week", "tiktokWeekPostPrice"]] as const },
                { platform: "YouTube", keys: [["Video/day", "youtubeDayPostPrice"], ["Video/week", "youtubeWeekPostPrice"]] as const },
                { platform: "Twitter/X", keys: [["Post/day", "twitterDayPostPrice"], ["Post/week", "twitterWeekPostPrice"]] as const },
              ].map(({ platform, keys }) => (
                <div key={platform}>
                  <div className="text-xs font-bold text-muted-foreground mb-2">{platform}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {keys.map(([label, key]) => (
                      <div key={key}>
                        <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
                        <Input type="number" value={form[key as keyof typeof form]} onChange={field(key as keyof typeof form)} placeholder="0" className="h-10 rounded-xl" />
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
