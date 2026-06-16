import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import { getToken } from "@/lib/auth-store";
import { useEffect } from "react";

import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";

import BrandDashboardPage from "@/pages/brand/dashboard";
import CampaignsPage from "@/pages/brand/campaigns";
import CampaignNewPage from "@/pages/brand/campaign-new";
import CampaignDetailPage from "@/pages/brand/campaign-detail";
import CreatorsPage from "@/pages/brand/creators";
import CreatorProfilePage from "@/pages/brand/creator-profile";
import BrandMessagesPage from "@/pages/brand/messages";
import PaymentsPage from "@/pages/brand/payments";

import CreatorDashboardPage from "@/pages/creator/dashboard";
import InvitesPage from "@/pages/creator/invites";
import SubmitPage from "@/pages/creator/submit";
import EarningsPage from "@/pages/creator/earnings";

import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminCampaignsPage from "@/pages/admin/campaigns";
import AdminSubmissionsPage from "@/pages/admin/submissions";
import VerifyRequestsPage from "@/pages/admin/verify-requests";
import AdminPayoutsPage from "@/pages/admin/payouts";
import AdminSettingsPage from "@/pages/admin/settings";

import SettingsPage from "@/pages/shared/settings";

function AppRouter() {
  const { user, setAuth, isLoading: authLoading } = useAuth();
  const hasToken = !!getToken();
  const { data: me, isLoading: meLoading, isSuccess } = useGetMe({
    query: {
      queryKey: getGetMeQueryKey(),
      enabled: hasToken && !user,
      retry: false,
    },
  });

  useEffect(() => {
    if (isSuccess && me && !user) {
      setAuth(getToken()!, me);
    }
  }, [isSuccess, me, user]);

  const loading = authLoading || (hasToken && !user && meLoading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const role = user?.role;

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />

      {!user && (
        <Route>{() => <Redirect to="/login" />}</Route>
      )}

      {user && role === "admin" && (
        <>
          <Route path="/" component={() => <Redirect to="/admin" />} />
          <Route path="/admin" component={AdminDashboardPage} />
          <Route path="/admin/users" component={AdminUsersPage} />
          <Route path="/admin/campaigns" component={AdminCampaignsPage} />
          <Route path="/admin/submissions" component={AdminSubmissionsPage} />
          <Route path="/admin/verify-requests" component={VerifyRequestsPage} />
          <Route path="/admin/payouts" component={AdminPayoutsPage} />
          <Route path="/admin/settings" component={AdminSettingsPage} />
          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {user && role === "creator" && (
        <>
          <Route path="/" component={CreatorDashboardPage} />
          <Route path="/invites" component={InvitesPage} />
          <Route path="/invites/:id" component={InvitesPage} />
          <Route path="/submissions/new" component={SubmitPage} />
          <Route path="/earnings" component={EarningsPage} />
          <Route path="/messages" component={BrandMessagesPage} />
          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {user && role === "brand" && (
        <>
          <Route path="/" component={BrandDashboardPage} />
          <Route path="/campaigns" component={CampaignsPage} />
          <Route path="/campaigns/new" component={CampaignNewPage} />
          <Route path="/campaigns/:id" component={CampaignDetailPage} />
          <Route path="/creators" component={CreatorsPage} />
          <Route path="/creators/:id" component={CreatorProfilePage} />
          <Route path="/messages" component={BrandMessagesPage} />
          <Route path="/payments" component={PaymentsPage} />
          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
