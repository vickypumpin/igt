import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  useAccountProfile,
  useUpdateAccountProfile,
  getAccountProfileQueryKey,
  useCompleteOnboarding,
  getGetMeQueryKey,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { User, Instagram, DollarSign, ShieldCheck, CheckCircle2, ChevronLeft, ChevronRight, X } from "lucide-react";

const CONTENT_CATEGORIES = [
  "Fashion", "Beauty", "Technology", "Gaming", "Fitness", "Food",
  "Travel", "Lifestyle", "Education", "Finance", "Entertainment", "Sports",
];

type WizardForm = {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  instagramProfile: string; instagramFollowers: string;
  tiktokProfile: string; tiktokFollowers: string;
  youtubeProfile: string; youtubeFollowers: string;
  twitterProfile: string; twitterFollowers: string;
  facebookProfile: string; facebookFollowers: string;
  snapchatProfile: string; snapchatFollowers: string;
  contentCategory: string;
  creatorCategory: string;
  instagramDayPostPrice: string;
  tiktokDayPostPrice: string;
  youtubeDayPostPrice: string;
  twitterDayPostPrice: string;
};

const EMPTY_FORM: WizardForm = {
  firstName: "", lastName: "", phone: "", bio: "", avatarUrl: "",
  instagramProfile: "", instagramFollowers: "",
  tiktokProfile: "", tiktokFollowers: "",
  youtubeProfile: "", youtubeFollowers: "",
  twitterProfile: "", twitterFollowers: "",
  facebookProfile: "", facebookFollowers: "",
  snapchatProfile: "", snapchatFollowers: "",
  contentCategory: "",
  creatorCategory: "",
  instagramDayPostPrice: "",
  tiktokDayPostPrice: "",
  youtubeDayPostPrice: "",
  twitterDayPostPrice: "",
};

const STEPS = [
  { label: "Profile", icon: User },
  { label: "Socials", icon: Instagram },
  { label: "Categories & Pricing", icon: DollarSign },
  { label: "Verification", icon: ShieldCheck },
];

interface Props {
  onClose: () => void;
}

export default function CreatorOnboardingWizard({ onClose }: Props) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { data: profile } = useAccountProfile();
  const updateMutation = useUpdateAccountProfile();
  const completeOnboarding = useCompleteOnboarding();

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState<WizardForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const p = profile as unknown as Record<string, unknown>;
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phone: profile.phone ?? "",
        bio: profile.bio ?? "",
        avatarUrl: profile.avatarUrl ?? "",
        instagramProfile: profile.instagramProfile ?? "",
        instagramFollowers: String(p["instagramFollowers"] ?? ""),
        tiktokProfile: profile.tiktokProfile ?? "",
        tiktokFollowers: String(p["tiktokFollowers"] ?? ""),
        youtubeProfile: profile.youtubeProfile ?? "",
        youtubeFollowers: String(p["youtubeFollowers"] ?? ""),
        twitterProfile: profile.twitterProfile ?? "",
        twitterFollowers: String(p["twitterFollowers"] ?? ""),
        facebookProfile: profile.facebookProfile ?? "",
        facebookFollowers: String(p["facebookFollowers"] ?? ""),
        snapchatProfile: profile.snapchatProfile ?? "",
        snapchatFollowers: String(p["snapchatFollowers"] ?? ""),
        contentCategory: profile.contentCategory ?? "",
        creatorCategory: profile.creatorCategory ?? "",
        instagramDayPostPrice: String(profile.instagramDayPostPrice ?? ""),
        tiktokDayPostPrice: String(profile.tiktokDayPostPrice ?? ""),
        youtubeDayPostPrice: String(profile.youtubeDayPostPrice ?? ""),
        twitterDayPostPrice: String(profile.twitterDayPostPrice ?? ""),
      });
    }
  }, [profile]);

  const field = (key: keyof WizardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const saveCurrentStep = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      if (step === 0) {
        Object.assign(payload, {
          firstName: form.firstName || undefined,
          lastName: form.lastName || undefined,
          phone: form.phone || null,
          bio: form.bio || null,
          avatarUrl: form.avatarUrl || null,
        });
      } else if (step === 1) {
        Object.assign(payload, {
          instagramProfile: form.instagramProfile || null,
          instagramFollowers: form.instagramFollowers ? parseInt(form.instagramFollowers) : null,
          tiktokProfile: form.tiktokProfile || null,
          tiktokFollowers: form.tiktokFollowers ? parseInt(form.tiktokFollowers) : null,
          youtubeProfile: form.youtubeProfile || null,
          youtubeFollowers: form.youtubeFollowers ? parseInt(form.youtubeFollowers) : null,
          twitterProfile: form.twitterProfile || null,
          twitterFollowers: form.twitterFollowers ? parseInt(form.twitterFollowers) : null,
          facebookProfile: form.facebookProfile || null,
          facebookFollowers: form.facebookFollowers ? parseInt(form.facebookFollowers) : null,
          snapchatProfile: form.snapchatProfile || null,
          snapchatFollowers: form.snapchatFollowers ? parseInt(form.snapchatFollowers) : null,
        });
      } else if (step === 2) {
        Object.assign(payload, {
          contentCategory: form.contentCategory || null,
          creatorCategory: form.creatorCategory || null,
          instagramDayPostPrice: form.instagramDayPostPrice ? parseInt(form.instagramDayPostPrice) : null,
          tiktokDayPostPrice: form.tiktokDayPostPrice ? parseInt(form.tiktokDayPostPrice) : null,
          youtubeDayPostPrice: form.youtubeDayPostPrice ? parseInt(form.youtubeDayPostPrice) : null,
          twitterDayPostPrice: form.twitterDayPostPrice ? parseInt(form.twitterDayPostPrice) : null,
        });
      }
      if (Object.keys(payload).length > 0) {
        await updateMutation.mutateAsync(payload as Parameters<typeof updateMutation.mutateAsync>[0]);
        queryClient.invalidateQueries({ queryKey: getAccountProfileQueryKey() });
      }
    } catch {
      toast({ title: "Failed to save changes", variant: "destructive" });
      setSaving(false);
      return false;
    }
    setSaving(false);
    return true;
  };

  const handleNext = async () => {
    const ok = await saveCurrentStep();
    if (!ok) return;
    setStep(s => s + 1);
  };

  const handleComplete = async (goVerify = false) => {
    setSaving(true);
    try {
      await completeOnboarding.mutateAsync();
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
      setDone(true);
      if (goVerify) {
        setTimeout(() => { navigate("/verify"); onClose(); }, 1500);
      } else {
        setTimeout(() => onClose(), 2000);
      }
    } catch {
      toast({ title: "Could not save onboarding state", variant: "destructive" });
    }
    setSaving(false);
  };

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-4 max-w-sm w-full mx-4 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.15), rgba(29,207,179,0.05))", border: "2px solid rgba(29,207,179,0.3)" }}>
            <CheckCircle2 className="h-10 w-10" style={{ color: "#1DCFB3" }} />
          </div>
          <h2 className="text-xl font-extrabold text-foreground">You're all set!</h2>
          <p className="text-sm text-muted-foreground">Your profile is ready. You can now be discovered by brands and apply to campaigns.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">Welcome to iGoTrend! 🎉</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Let's set up your creator profile in 4 quick steps</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;
              return (
                <div key={i} className="flex items-center gap-1 flex-1 last:flex-none">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: isDone ? "#1DCFB3" : isActive ? "linear-gradient(135deg, #1DCFB3, #0FA88E)" : "#F3F4F6",
                        color: isDone || isActive ? "white" : "#9CA3AF",
                      }}
                    >
                      {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                    </div>
                    <span className={`text-xs font-semibold hidden sm:block ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-1 rounded-full" style={{ background: isDone ? "#1DCFB3" : "#E5E7EB" }} />
                  )}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-2">Step {step + 1} of {STEPS.length}</p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 0 && <StepProfile form={form} field={field} />}
          {step === 1 && <StepSocials form={form} field={field} />}
          {step === 2 && <StepPricing form={form} field={field} setForm={setForm} />}
          {step === 3 && <StepKyc />}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => step > 0 ? setStep(s => s - 1) : undefined}
            disabled={step === 0 || saving}
            className="rounded-xl gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            {step < 3 ? (
              <Button
                onClick={handleNext}
                disabled={saving}
                className="rounded-xl font-semibold px-6 gap-1"
                style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
              >
                {saving ? "Saving…" : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => handleComplete(false)}
                  disabled={saving}
                  className="rounded-xl text-muted-foreground"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Do this later
                </Button>
                <Button
                  onClick={() => handleComplete(true)}
                  disabled={saving}
                  className="rounded-xl font-semibold px-6"
                  style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
                >
                  {saving ? "Saving…" : "Start Verification"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepProfile({ form, field }: { form: WizardForm; field: (k: keyof WizardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
          <User className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">Personal Info & Bio</div>
          <div className="text-xs text-muted-foreground">Tell brands who you are</div>
        </div>
      </div>
      {form.avatarUrl && (
        <div className="flex justify-center">
          <img src={form.avatarUrl} alt="avatar" className="w-16 h-16 rounded-2xl object-cover border border-gray-100 shadow-sm" />
        </div>
      )}
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Avatar URL</label>
        <Input value={form.avatarUrl} onChange={field("avatarUrl")} placeholder="https://…" className="h-10 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">First name</label>
          <Input value={form.firstName} onChange={field("firstName")} className="h-10 rounded-xl" data-testid="wizard-firstName" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground mb-1 block">Last name</label>
          <Input value={form.lastName} onChange={field("lastName")} className="h-10 rounded-xl" data-testid="wizard-lastName" />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone</label>
        <Input value={form.phone} onChange={field("phone")} placeholder="+234…" className="h-10 rounded-xl" />
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bio</label>
        <textarea
          value={form.bio}
          onChange={field("bio")}
          rows={3}
          placeholder="Tell brands about yourself, your niche, and what makes you unique…"
          className="w-full rounded-xl border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          data-testid="wizard-bio"
        />
      </div>
    </div>
  );
}

function StepSocials({ form, field }: { form: WizardForm; field: (k: keyof WizardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void }) {
  const platforms = [
    { label: "Instagram", emoji: "📸", handleKey: "instagramProfile" as keyof WizardForm, followersKey: "instagramFollowers" as keyof WizardForm, placeholder: "@handle" },
    { label: "TikTok", emoji: "🎵", handleKey: "tiktokProfile" as keyof WizardForm, followersKey: "tiktokFollowers" as keyof WizardForm, placeholder: "@handle" },
    { label: "YouTube", emoji: "▶️", handleKey: "youtubeProfile" as keyof WizardForm, followersKey: "youtubeFollowers" as keyof WizardForm, placeholder: "Channel URL" },
    { label: "Twitter / X", emoji: "🐦", handleKey: "twitterProfile" as keyof WizardForm, followersKey: "twitterFollowers" as keyof WizardForm, placeholder: "@handle" },
    { label: "Facebook", emoji: "👥", handleKey: "facebookProfile" as keyof WizardForm, followersKey: "facebookFollowers" as keyof WizardForm, placeholder: "Profile URL" },
    { label: "Snapchat", emoji: "👻", handleKey: "snapchatProfile" as keyof WizardForm, followersKey: "snapchatFollowers" as keyof WizardForm, placeholder: "@handle" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}>
          <Instagram className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">Social Media Handles</div>
          <div className="text-xs text-muted-foreground">Connect your platforms to get discovered</div>
        </div>
      </div>
      {platforms.map(({ label, emoji, handleKey, followersKey, placeholder }) => (
        <div key={label} className="grid grid-cols-3 gap-2 items-end">
          <div className="col-span-2">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">{emoji} {label}</label>
            <Input value={form[handleKey]} onChange={field(handleKey)} placeholder={placeholder} className="h-9 rounded-xl text-sm" data-testid={`wizard-${handleKey}`} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Followers</label>
            <Input type="number" value={form[followersKey]} onChange={field(followersKey)} placeholder="0" className="h-9 rounded-xl text-sm" />
          </div>
        </div>
      ))}
    </div>
  );
}

function StepPricing({
  form,
  field,
  setForm,
}: {
  form: WizardForm;
  field: (k: keyof WizardForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<WizardForm>>;
}) {
  const toggleCategory = (cat: string) => {
    setForm(f => {
      const current = f.contentCategory ? f.contentCategory.split(",").map(s => s.trim()).filter(Boolean) : [];
      const next = current.includes(cat) ? current.filter(c => c !== cat) : [...current, cat];
      return { ...f, contentCategory: next.join(", ") };
    });
  };
  const selected = form.contentCategory ? form.contentCategory.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
          <DollarSign className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">Categories & Rate Card</div>
          <div className="text-xs text-muted-foreground">Help brands find you and know your pricing</div>
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-2 block">Content Categories</label>
        <div className="flex flex-wrap gap-1.5">
          {CONTENT_CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleCategory(cat)}
              className="text-xs px-3 py-1 rounded-full border font-medium transition-all"
              style={{
                background: selected.includes(cat) ? "linear-gradient(135deg, #1DCFB3, #0FA88E)" : "white",
                color: selected.includes(cat) ? "white" : "#6B7280",
                borderColor: selected.includes(cat) ? "#1DCFB3" : "#E5E7EB",
              }}
              data-testid={`wizard-cat-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold text-muted-foreground mb-1 block">Creator Type / Niche</label>
        <Input value={form.creatorCategory} onChange={field("creatorCategory")} placeholder="e.g. Fashion Influencer, Tech Reviewer" className="h-10 rounded-xl" />
      </div>
      <div>
        <div className="text-xs font-bold text-muted-foreground mb-2">Base Rates (₦ per post/day)</div>
        <div className="grid grid-cols-2 gap-3">
          {([
            ["📸 Instagram", "instagramDayPostPrice"],
            ["🎵 TikTok", "tiktokDayPostPrice"],
            ["▶️ YouTube", "youtubeDayPostPrice"],
            ["🐦 Twitter / X", "twitterDayPostPrice"],
          ] as [string, keyof WizardForm][]).map(([label, key]) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <Input type="number" value={form[key]} onChange={field(key)} placeholder="0" className="h-9 rounded-xl text-sm" data-testid={`wizard-${key}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepKyc() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <div className="text-sm font-bold">Identity Verification</div>
          <div className="text-xs text-muted-foreground">Build trust with brands instantly</div>
        </div>
      </div>
      <div className="rounded-2xl p-5 space-y-4" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.06), rgba(107,47,206,0.04))", border: "1px solid rgba(29,207,179,0.2)" }}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,207,179,0.12)" }}>
            <CheckCircle2 className="h-5 w-5" style={{ color: "#1DCFB3" }} />
          </div>
          <div>
            <div className="text-sm font-bold">Verified Badge on Your Profile</div>
            <div className="text-xs text-muted-foreground mt-0.5">Stand out to brands browsing creator profiles</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(107,47,206,0.1)" }}>
            <ShieldCheck className="h-5 w-5" style={{ color: "#6B2FCE" }} />
          </div>
          <div>
            <div className="text-sm font-bold">Higher Campaign Invite Priority</div>
            <div className="text-xs text-muted-foreground mt-0.5">Brands prefer verified creators for exclusive campaigns</div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.1)" }}>
            <DollarSign className="h-5 w-5" style={{ color: "#D97706" }} />
          </div>
          <div>
            <div className="text-sm font-bold">Faster Payout Processing</div>
            <div className="text-xs text-muted-foreground mt-0.5">Verified identity speeds up earnings withdrawal</div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        You'll need to upload a government-issued ID. This only takes 2 minutes.
      </p>
    </div>
  );
}
