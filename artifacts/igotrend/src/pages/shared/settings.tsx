import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useGetMe, useUpdateProfile, useUpdatePassword, getGetMeQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import { useAuth } from "@/contexts/auth-context";
import BrandLayout from "@/components/layout/brand-layout";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const updateProfile = useUpdateProfile();
  const updatePassword = useUpdatePassword();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", bio: "", instagramProfile: "", tiktokProfile: "", youtubeProfile: "", twitterProfile: "" },
  });
  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  useEffect(() => {
    if (me) profileForm.reset({ firstName: me.firstName, lastName: me.lastName, phone: me.phone ?? "", bio: me.bio ?? "", instagramProfile: me.instagramProfile ?? "", tiktokProfile: me.tiktokProfile ?? "", youtubeProfile: me.youtubeProfile ?? "", twitterProfile: me.twitterProfile ?? "" });
  }, [me]);

  const onProfileSubmit = (values: ProfileData) => {
    updateProfile.mutate({ data: values }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() }); toast({ title: "Profile updated!" }); },
    });
  };
  const onPasswordSubmit = (values: PasswordData) => {
    updatePassword.mutate({ data: values }, {
      onSuccess: () => { toast({ title: "Password updated!" }); passwordForm.reset(); },
      onError: () => { toast({ title: "Current password is incorrect", variant: "destructive" }); },
    });
  };

  const role = user?.role;
  const Layout = role === "creator" ? CreatorLayout : BrandLayout;

  return (
    <Layout>
      <div className="max-w-2xl space-y-5" data-testid="page-settings">
        <div>
          <h1 className="text-xl font-semibold">Profile Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your account details</p>
        </div>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Profile Information</CardTitle></CardHeader>
          <CardContent>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField control={profileForm.control} name="firstName" render={({ field }) => (
                    <FormItem><FormLabel>First name</FormLabel><FormControl><Input {...field} data-testid="input-first-name" /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={profileForm.control} name="lastName" render={({ field }) => (
                    <FormItem><FormLabel>Last name</FormLabel><FormControl><Input {...field} data-testid="input-last-name" /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <FormField control={profileForm.control} name="phone" render={({ field }) => (
                  <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} data-testid="input-phone" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={profileForm.control} name="bio" render={({ field }) => (
                  <FormItem><FormLabel>Bio</FormLabel><FormControl><Textarea {...field} rows={3} data-testid="input-bio" /></FormControl><FormMessage /></FormItem>
                )} />
                {role === "creator" && (
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={profileForm.control} name="instagramProfile" render={({ field }) => (<FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} data-testid="input-instagram" /></FormControl></FormItem>)} />
                    <FormField control={profileForm.control} name="tiktokProfile" render={({ field }) => (<FormItem><FormLabel>TikTok URL</FormLabel><FormControl><Input {...field} data-testid="input-tiktok" /></FormControl></FormItem>)} />
                    <FormField control={profileForm.control} name="youtubeProfile" render={({ field }) => (<FormItem><FormLabel>YouTube URL</FormLabel><FormControl><Input {...field} data-testid="input-youtube" /></FormControl></FormItem>)} />
                    <FormField control={profileForm.control} name="twitterProfile" render={({ field }) => (<FormItem><FormLabel>X / Twitter URL</FormLabel><FormControl><Input {...field} data-testid="input-twitter" /></FormControl></FormItem>)} />
                  </div>
                )}
                <Button type="submit" disabled={updateProfile.isPending} data-testid="button-save-profile">
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Change Password</CardTitle></CardHeader>
          <CardContent>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-3">
                <FormField control={passwordForm.control} name="currentPassword" render={({ field }) => (
                  <FormItem><FormLabel>Current password</FormLabel><FormControl><Input {...field} type="password" data-testid="input-current-password" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                  <FormItem><FormLabel>New password</FormLabel><FormControl><Input {...field} type="password" data-testid="input-new-password" /></FormControl><FormMessage /></FormItem>
                )} />
                <Button type="submit" variant="outline" disabled={updatePassword.isPending} data-testid="button-change-password">
                  {updatePassword.isPending ? "Updating..." : "Change Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
