import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
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
import ForgotPasswordPage from "@/pages/auth/forgot-password";

import HomePage from "@/pages/public/home";
import BrandsPage from "@/pages/public/brands";
import InfluencersCreatorsPage from "@/pages/public/influencers-creators";
import ServicesPage from "@/pages/public/services";
import CommunityGuidelinesPage from "@/pages/public/community-guidelines";
import LegalPage from "@/pages/public/legal";

import BrandDashboardPage from "@/pages/brand/dashboard";
import CampaignsPage from "@/pages/brand/campaigns";
import CampaignNewPage from "@/pages/brand/campaign-new";
import CampaignDetailPage from "@/pages/brand/campaign-detail";
import CreatorsPage from "@/pages/brand/creators";
import CreatorProfilePage from "@/pages/brand/creator-profile";
import BrandMessagesPage from "@/pages/brand/messages";
import PaymentsPage from "@/pages/brand/payments";
import BrandBillingPage from "@/pages/brand/billing";

import CreatorDashboardPage from "@/pages/creator/dashboard";
import InvitesPage from "@/pages/creator/invites";
import SubmitPage from "@/pages/creator/submit";
import EarningsPage from "@/pages/creator/earnings";
import CreatorBillingPage from "@/pages/creator/billing";
import CreatorCampaignsPage from "@/pages/creator/campaigns";

import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminCampaignsPage from "@/pages/admin/campaigns";
import AdminSubmissionsPage from "@/pages/admin/submissions";
import VerifyRequestsPage from "@/pages/admin/verify-requests";
import AdminPayoutsPage from "@/pages/admin/payouts";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminFaqsPage from "@/pages/admin/faqs";
import AdminLegalPage from "@/pages/admin/legal";
import AdminMessagingPage from "@/pages/admin/messaging";

import SettingsPage from "@/pages/shared/settings";
import FaqPage from "@/pages/shared/faq";
import TrendAiPage from "@/pages/shared/trend-ai";
import ComingSoonPage from "@/pages/shared/coming-soon";

const AdminSettingsFeesPage    = () => <AdminSettingsPage />;
const AdminSettingsGatewayPage = () => <AdminSettingsPage />;
const AdminSettingsSmtpPage    = () => <AdminSettingsPage />;
const AdminSettingsRolesPage   = () => <ComingSoonPage title="Roles & Permissions" description="Fine-grained role management is coming soon." />;

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
      {/* ── Auth pages (always accessible) ── */}
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />

      {/* ── Public legal pages (always accessible) ── */}
      <Route path="/privacy" component={LegalPage} />
      <Route path="/terms" component={LegalPage} />
      <Route path="/terms-of-use" component={LegalPage} />
      <Route path="/gdpr" component={LegalPage} />
      <Route path="/community-guidelines" component={CommunityGuidelinesPage} />

      {/* ── Public marketing pages (unauthenticated users) ── */}
      {!user && (
        <>
          <Route path="/" component={HomePage} />
          <Route path="/brands" component={BrandsPage} />
          <Route path="/influencers-creators" component={InfluencersCreatorsPage} />
          <Route path="/services" component={ServicesPage} />
          <Route component={NotFound} />
        </>
      )}

      {/* ── Admin routes ── */}
      {user && role === "admin" && (
        <>
          <Route path="/" component={() => <Redirect to="/admin" />} />
          <Route path="/admin" component={AdminDashboardPage} />

          {/* Account Mgt sub-pages */}
          <Route path="/admin/users" component={AdminUsersPage} />
          <Route path="/admin/users/brands" component={() => <AdminUsersPage />} />
          <Route path="/admin/users/creators" component={() => <AdminUsersPage />} />
          <Route path="/admin/users/pending" component={() => <AdminUsersPage />} />

          {/* Campaign Mgt sub-pages */}
          <Route path="/admin/campaigns" component={AdminCampaignsPage} />
          <Route path="/admin/campaigns/active" component={() => <AdminCampaignsPage />} />
          <Route path="/admin/campaigns/pending" component={() => <AdminCampaignsPage />} />

          {/* Payments */}
          <Route path="/admin/payouts" component={AdminPayoutsPage} />

          {/* Approval Request sub-pages */}
          <Route path="/admin/verify-requests" component={VerifyRequestsPage} />
          <Route path="/admin/verify-requests/approved" component={() => <VerifyRequestsPage />} />
          <Route path="/admin/verify-requests/declined" component={() => <VerifyRequestsPage />} />

          {/* Submissions */}
          <Route path="/admin/submissions" component={AdminSubmissionsPage} />

          {/* Messaging */}
          <Route path="/admin/messages" component={AdminMessagingPage} />
          <Route path="/admin/messages/broadcast" component={AdminMessagingPage} />

          {/* Settings sub-pages */}
          <Route path="/admin/settings" component={AdminSettingsPage} />
          <Route path="/admin/settings/fees" component={AdminSettingsFeesPage} />
          <Route path="/admin/settings/gateway" component={AdminSettingsGatewayPage} />
          <Route path="/admin/settings/smtp" component={AdminSettingsSmtpPage} />
          <Route path="/admin/settings/roles" component={AdminSettingsRolesPage} />

          {/* FAQs & Legal */}
          <Route path="/admin/faqs" component={AdminFaqsPage} />
          <Route path="/admin/legal" component={AdminLegalPage} />

          {/* Account */}
          <Route path="/admin/account" component={() => <Redirect to="/settings/profile" />} />
          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {/* ── Creator routes ── */}
      {user && role === "creator" && (
        <>
          <Route path="/" component={CreatorDashboardPage} />

          {/* Campaign Mgt sub-pages */}
          <Route path="/campaigns" component={CreatorCampaignsPage} />
          <Route path="/campaigns/accepted" component={() => <CreatorCampaignsPage />} />
          <Route path="/campaigns/completed" component={() => <CreatorCampaignsPage />} />
          <Route path="/campaigns/declined" component={() => <CreatorCampaignsPage />} />
          <Route path="/invites" component={InvitesPage} />
          <Route path="/invites/:id" component={InvitesPage} />
          <Route path="/invites/accepted" component={() => <InvitesPage />} />
          <Route path="/invites/completed" component={() => <InvitesPage />} />
          <Route path="/invites/declined" component={() => <InvitesPage />} />

          <Route path="/submissions/new" component={SubmitPage} />
          <Route path="/earnings" component={EarningsPage} />
          <Route path="/messages" component={BrandMessagesPage} />

          <Route path="/billing" component={CreatorBillingPage} />
          <Route path="/trend-ai" component={TrendAiPage} />
          <Route path="/faq" component={FaqPage} />

          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {/* ── Brand routes ── */}
      {user && role === "brand" && (
        <>
          <Route path="/" component={BrandDashboardPage} />

          {/* Campaign Mgt sub-pages */}
          <Route path="/campaigns" component={CampaignsPage} />
          <Route path="/campaigns/new" component={CampaignNewPage} />
          <Route path="/campaigns/:id" component={CampaignDetailPage} />
          <Route path="/campaigns/active" component={() => <CampaignsPage />} />
          <Route path="/campaigns/completed" component={() => <CampaignsPage />} />

          <Route path="/creators" component={CreatorsPage} />
          <Route path="/creators/:id" component={CreatorProfilePage} />
          <Route path="/messages" component={BrandMessagesPage} />
          <Route path="/payments" component={PaymentsPage} />

          <Route path="/billing" component={BrandBillingPage} />
          <Route path="/trend-ai" component={TrendAiPage} />
          <Route path="/faq" component={FaqPage} />

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
