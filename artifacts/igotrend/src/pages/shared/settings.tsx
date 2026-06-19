import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useGetMe, useUpdateProfile, useUpdatePassword, getGetMeQueryKey } from "@workspace/api-client-react";
import { useUpdateBankDetails } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { useAuth } from "@/contexts/auth-context";
import BrandLayout from "@/components/layout/brand-layout";
import CreatorLayout from "@/components/layout/creator-layout";
import AgencyLayout from "@/components/layout/agency-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { SiInstagram, SiTiktok, SiYoutube, SiX } from "react-icons/si";
import { User, Lock, Landmark } from "lucide-react";

const NIGERIAN_BANKS = [
  { label: "Access Bank", code: "044" },
  { label: "Citibank Nigeria", code: "023" },
  { label: "Ecobank Nigeria", code: "050" },
  { label: "Fidelity Bank", code: "070" },
  { label: "First Bank of Nigeria", code: "011" },
  { label: "First City Monument Bank (FCMB)", code: "214" },
  { label: "Guaranty Trust Bank (GTBank)", code: "058" },
  { label: "Heritage Bank", code: "030" },
  { label: "Jaiz Bank", code: "301" },
  { label: "Keystone Bank", code: "082" },
  { label: "Kuda Bank", code: "090267" },
  { label: "Moniepoint MFB", code: "000033" },
  { label: "Opay", code: "999" },
  { label: "Palmpay", code: "100033" },
  { label: "Polaris Bank", code: "076" },
  { label: "Providus Bank", code: "101" },
  { label: "Stanbic IBTC Bank", code: "221" },
  { label: "Standard Chartered Bank", code: "068" },
  { label: "Sterling Bank", code: "232" },
  { label: "Union Bank of Nigeria", code: "032" },
  { label: "United Bank for Africa (UBA)", code: "033" },
  { label: "Unity Bank", code: "215" },
  { label: "VFD Microfinance Bank", code: "566" },
  { label: "Wema Bank", code: "035" },
  { label: "Zenith Bank", code: "057" },
];

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  bio: z.string().optional(),
  instagramProfile: z.string().optional(),
  tiktokProfile: z.string().optional(),
  youtubeProfile: z.string().optional(),
  twitterProfile: z.string().optional(),
});
const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});
const bankSchema = z.object({
  bankName: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{10}$/, "Account number must be 10 digits"),
  accountName: z.string().min(2, "Account name is required"),
});

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;
type BankData = z.infer<typeof bankSchema>;

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
      <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-sm font-bold">{title}</div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();
  const updateBankDetails = useUpdateBankDetails();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", bio: "", instagramProfile: "", tiktokProfile: "", youtubeProfile: "", twitterProfile: "" },
  });
  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });
  const bankForm = useForm<BankData>({
    resolver: zodResolver(bankSchema),
    defaultValues: { bankName: "", accountNumber: "", accountName: "" },
  });

  useEffect(() => {
    if (me) {
      profileForm.reset({ firstName: me.firstName, lastName: me.lastName, phone: me.phone ?? "", bio: me.bio ?? "", instagramProfile: me.instagramProfile ?? "", tiktokProfile: me.tiktokProfile ?? "", youtubeProfile: me.youtubeProfile ?? "", twitterProfile: me.twitterProfile ?? "" });
      if (me.bankDetails) {
        bankForm.reset({
          bankName: me.bankDetails.bankName,
          accountNumber: "",
          accountName: me.bankDetails.accountName,
        });
      }
    }
  }, [me]);

  const onProfileSubmit = (values: ProfileData) => {
    updateProfile.mutate({ data: values }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }); toast({ title: "Profile updated ✓" }); } });
  };
  const onPasswordSubmit = (values: PasswordData) => {
    updatePassword.mutate({ data: values }, {
      onSuccess: () => { toast({ title: "Password updated ✓" }); passwordForm.reset(); },
      onError: () => { toast({ title: "Current password is incorrect", variant: "destructive" }); },
    });
  };
  const onBankSubmit = (values: BankData) => {
    updateBankDetails.mutate(values, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
        toast({ title: "Bank details saved ✓" });
      },
      onError: (err: unknown) => {
        const msg = (err as { data?: { error?: string } })?.data?.error ?? "Failed to save bank details";
        toast({ title: "Error", description: msg, variant: "destructive" });
      },
    });
  };

  const role = user?.role;
  const Layout = role === "creator" ? CreatorLayout : role === "agency" ? AgencyLayout : BrandLayout;
  const inputCls = "h-10 rounded-xl";
  const labelCls = "font-semibold text-sm";

  return (
    <Layout>
      <div className="max-w-2xl space-y-5" data-testid="page-settings">
        <div>
          <h1 className="text-2xl font-extrabold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account details</p>
        </div>

        <Section icon={User} title="Profile Information">
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <FormField control={profileForm.control} name="firstName" render={({ field }) => (
                  <FormItem><FormLabel className={labelCls}>First name</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-first-name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={profileForm.control} name="lastName" render={({ field }) => (
                  <FormItem><FormLabel className={labelCls}>Last name</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-last-name" /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={profileForm.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel className={labelCls}>Phone</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-phone" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={profileForm.control} name="bio" render={({ field }) => (
                <FormItem><FormLabel className={labelCls}>Bio</FormLabel><FormControl><Textarea {...field} rows={3} className="rounded-xl" data-testid="input-bio" /></FormControl><FormMessage /></FormItem>
              )} />
              {role === "creator" && (
                <>
                  <div className="pt-1 pb-0.5">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Social profiles</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={profileForm.control} name="instagramProfile" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#E1306C" }}><SiInstagram className="h-3.5 w-3.5" />Instagram URL</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-instagram" /></FormControl></FormItem>
                    )} />
                    <FormField control={profileForm.control} name="tiktokProfile" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-semibold flex items-center gap-1.5"><SiTiktok className="h-3.5 w-3.5" />TikTok URL</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-tiktok" /></FormControl></FormItem>
                    )} />
                    <FormField control={profileForm.control} name="youtubeProfile" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#CC0000" }}><SiYoutube className="h-3.5 w-3.5" />YouTube URL</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-youtube" /></FormControl></FormItem>
                    )} />
                    <FormField control={profileForm.control} name="twitterProfile" render={({ field }) => (
                      <FormItem><FormLabel className="text-xs font-semibold flex items-center gap-1.5"><SiX className="h-3.5 w-3.5" />X / Twitter URL</FormLabel><FormControl><Input {...field} className={inputCls} data-testid="input-twitter" /></FormControl></FormItem>
                    )} />
                  </div>
                </>
              )}
              <Button type="submit" disabled={updateProfile.isPending} className="rounded-xl font-semibold px-5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="button-save-profile">
                {updateProfile.isPending ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </Form>
        </Section>

        {role === "creator" && (
          <Section icon={Landmark} title="Bank Account">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground">
                Your bank details are used for payout disbursements. The account number is masked when displayed.
              </p>
              {me?.bankDetails && (
                <div className="mt-3 p-3 rounded-xl border border-border/60 bg-muted/30 text-sm">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-widest">Current account on file</div>
                  <div className="font-semibold">{me.bankDetails.bankName}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">{me.bankDetails.accountName} &mdash; {me.bankDetails.maskedAccountNumber}</div>
                </div>
              )}
            </div>
            <Form {...bankForm}>
              <form onSubmit={bankForm.handleSubmit(onBankSubmit)} className="space-y-3">
                <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Bank name</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        data-testid="select-bank-name"
                      >
                        <option value="">Select your bank…</option>
                        {NIGERIAN_BANKS.map(b => (
                          <option key={b.code} value={b.label}>{b.label}</option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Account number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="10-digit account number" maxLength={10} className={inputCls} data-testid="input-account-number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={bankForm.control} name="accountName" render={({ field }) => (
                  <FormItem>
                    <FormLabel className={labelCls}>Account name <span className="text-muted-foreground font-normal">(as it appears on the bank)</span></FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. John Doe" className={inputCls} data-testid="input-account-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={updateBankDetails.isPending} className="rounded-xl font-semibold px-5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} data-testid="button-save-bank">
                  {updateBankDetails.isPending ? "Saving…" : "Save bank details"}
                </Button>
              </form>
            </Form>
          </Section>
        )}

        <Section icon={Lock} title="Change Password">
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
              <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                <FormItem><FormLabel className={labelCls}>Current password</FormLabel><FormControl><Input {...field} type="password" className={inputCls} data-testid="input-current-password" /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                <FormItem><FormLabel className={labelCls}>New password</FormLabel><FormControl><Input {...field} type="password" className={inputCls} data-testid="input-new-password" /></FormControl><FormMessage /></FormItem>
              )} />
              <Button type="submit" variant="outline" disabled={updatePassword.isPending} className="rounded-xl font-semibold px-5 border-border hover:border-primary/40" data-testid="button-change-password">
                {updatePassword.isPending ? "Updating…" : "Change password"}
              </Button>
            </form>
          </Form>
        </Section>
      </div>
    </Layout>
  );
}
