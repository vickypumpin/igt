import { useState, useEffect } from "react";
import { useAccountProfile, useUpdateAccountProfile, getAccountProfileQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe, Camera, MapPin } from "lucide-react";

type FormState = {
  firstName: string; lastName: string; email: string; phone: string;
  companyName: string; companySize: string; companyType: string;
  websiteUrl: string; bio: string; avatarUrl: string;
  countryId: string; stateId: string;
};

const EMPTY: FormState = {
  firstName: "", lastName: "", email: "", phone: "",
  companyName: "", companySize: "", companyType: "",
  websiteUrl: "", bio: "", avatarUrl: "", countryId: "", stateId: "",
};

type AnyProfile = Record<string, unknown>;

export default function BrandAccountEditPage() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useAccountProfile();
  const updateMutation = useUpdateAccountProfile();
  const [form, setForm] = useState<FormState>(EMPTY);

  useEffect(() => {
    if (profile) {
      const p = profile as unknown as AnyProfile;
      setForm({
        firstName: profile.firstName ?? "", lastName: profile.lastName ?? "",
        email: profile.email ?? "", phone: profile.phone ?? "",
        companyName: profile.companyName ?? "",
        companySize: profile.companySize ?? "", companyType: profile.companyType ?? "",
        websiteUrl: String(p["websiteUrl"] ?? ""),
        bio: profile.bio ?? "", avatarUrl: profile.avatarUrl ?? "",
        countryId: profile.countryId ? String(profile.countryId) : "",
        stateId: profile.stateId ? String(profile.stateId) : "",
      });
    }
  }, [profile]);

  const field = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    const payload = {
      firstName: form.firstName, lastName: form.lastName,
      email: form.email || undefined,
      phone: form.phone || null,
      companyName: form.companyName || null, companySize: form.companySize || null,
      companyType: form.companyType || null,
      websiteUrl: form.websiteUrl || null,
      bio: form.bio || null,
      avatarUrl: form.avatarUrl || null,
      countryId: form.countryId ? parseInt(form.countryId, 10) : null,
      stateId: form.stateId ? parseInt(form.stateId, 10) : null,
    };

    updateMutation.mutate(payload as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAccountProfileQueryKey() });
        toast({ title: "Profile saved ✓" });
      },
      onError: () => toast({ title: "Failed to save profile", variant: "destructive" }),
    });
  };

  if (isLoading) return (
    <BrandLayout>
      <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div>
    </BrandLayout>
  );

  return (
    <BrandLayout>
      <div data-testid="page-brand-account-edit" className="max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Account</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update your brand profile and contact information</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending}
            className="rounded-xl font-semibold px-6"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
            data-testid="btn-save-profile">
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-5">
          {/* Logo / avatar */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><Camera className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Brand Logo / Profile Photo</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#1DCFB3] to-[#6B2FCE] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {form.avatarUrl
                  ? <img src={form.avatarUrl} alt="logo" className="w-14 h-14 rounded-xl object-cover" />
                  : (form.companyName[0] ?? "B").toUpperCase()}
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Logo URL</label>
                <Input value={form.avatarUrl} onChange={field("avatarUrl")} placeholder="https://…" className="h-10 rounded-xl" data-testid="input-avatarUrl" />
                <p className="text-xs text-muted-foreground mt-1">Paste a link to your brand logo</p>
              </div>
            </div>
          </div>

          {/* Account info (read-only email) */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}><Globe className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Account Details</div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email address</label>
                <Input value={form.email} onChange={field("email")} type="email" placeholder="you@brand.com" className="h-10 rounded-xl" data-testid="input-email" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {([["First name", "firstName"], ["Last name", "lastName"]] as [string, keyof FormState][]).map(([label, key]) => (
                  <div key={key}>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                    <Input value={form[key]} onChange={field(key)} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Phone number</label>
                <Input value={form.phone} onChange={field("phone")} className="h-10 rounded-xl" data-testid="input-phone" />
              </div>
            </div>
          </div>

          {/* Company info */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><Building2 className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Company Information</div>
            </div>
            <div className="space-y-3">
              {([
                ["Company name", "companyName", "Your company or brand name"],
                ["Company type", "companyType", "e.g. Agency, Brand, SME"],
                ["Company size", "companySize", "e.g. 1-10, 11-50, 51-200"],
              ] as [string, keyof FormState, string][]).map(([label, key, placeholder]) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} placeholder={placeholder} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Website URL</label>
                <Input value={form.websiteUrl} onChange={field("websiteUrl")} placeholder="https://yourbrand.com" className="h-10 rounded-xl" data-testid="input-websiteUrl" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">About / Bio</label>
                <textarea value={form.bio} onChange={field("bio")} rows={3} placeholder="Tell creators about your brand…"
                  className="w-full rounded-xl border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-bio" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}><MapPin className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Location</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Country ID</label>
                <Input type="number" value={form.countryId} onChange={field("countryId")} placeholder="Country ID" className="h-10 rounded-xl" data-testid="input-countryId" />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">State ID</label>
                <Input type="number" value={form.stateId} onChange={field("stateId")} placeholder="State ID" className="h-10 rounded-xl" data-testid="input-stateId" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}
