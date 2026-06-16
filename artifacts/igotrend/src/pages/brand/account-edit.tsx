import { useState, useEffect } from "react";
import { useGetMe, useUpdateProfile, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Building2, Globe } from "lucide-react";

export default function BrandAccountEditPage() {
  const { toast } = useToast();
  const { data: me, isLoading } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateMutation = useUpdateProfile();

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    companyName: "", companySize: "", companyType: "",
    bio: "",
  });

  useEffect(() => {
    if (me) {
      setForm({
        firstName: me.firstName ?? "", lastName: me.lastName ?? "",
        phone: me.phone ?? "", companyName: me.companyName ?? "",
        companySize: me.companySize ?? "", companyType: me.companyType ?? "",
        bio: me.bio ?? "",
      });
    }
  }, [me]);

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = () => {
    updateMutation.mutate({ data: form } as Parameters<typeof updateMutation.mutate>[0], {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Profile saved ✓" });
      },
      onError: () => toast({ title: "Failed to save profile", variant: "destructive" }),
    });
  };

  if (isLoading) return <BrandLayout><div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}</div></BrandLayout>;

  return (
    <BrandLayout>
      <div data-testid="page-brand-account-edit" className="max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Account</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Update your brand profile and contact information</p>
          </div>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="rounded-xl font-semibold px-6" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="btn-save-profile">
            {updateMutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}><Building2 className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Company Information</div>
            </div>
            <div className="space-y-3">
              {[
                { label: "Company name", key: "companyName" as const, placeholder: "Your company or brand name" },
                { label: "Company type", key: "companyType" as const, placeholder: "e.g. Agency, Brand, SME" },
                { label: "Company size", key: "companySize" as const, placeholder: "e.g. 1-10, 11-50, 51-200" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} placeholder={placeholder} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">About / Bio</label>
                <textarea value={form.bio} onChange={field("bio")} rows={3} placeholder="Tell creators about your brand…" className="w-full rounded-xl border border-input px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring" data-testid="input-bio" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}><Globe className="h-4 w-4" /></div>
              <div className="text-sm font-bold">Contact Person</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "First name", key: "firstName" as const },
                { label: "Last name", key: "lastName" as const },
                { label: "Phone number", key: "phone" as const },
              ].map(({ label, key }) => (
                <div key={key} className={key === "phone" ? "" : ""}>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">{label}</label>
                  <Input value={form[key]} onChange={field(key)} className="h-10 rounded-xl" data-testid={`input-${key}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BrandLayout>
  );
}
