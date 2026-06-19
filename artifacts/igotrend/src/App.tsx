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
import ResetPasswordPage from "@/pages/auth/reset-password";

import HomePage from "@/pages/public/home";
import BrandsPage from "@/pages/public/brands";
import AgenciesPage from "@/pages/public/agencies";
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
import CreatorMessagesPage from "@/pages/creator/messages";
import PaymentsPage from "@/pages/brand/payments";
import BrandBillingPage from "@/pages/brand/billing";
import BrandAccountEditPage from "@/pages/brand/account-edit";
import BrandRewardsPage from "@/pages/brand/rewards";
import CreatorPaymentsPage from "@/pages/creator/payments";

import CreatorDashboardPage from "@/pages/creator/dashboard";
import InvitesPage from "@/pages/creator/invites";
import SubmitPage from "@/pages/creator/submit";
import EarningsPage from "@/pages/creator/earnings";
import CreatorBillingPage from "@/pages/creator/billing";
import CreatorCampaignsPage from "@/pages/creator/campaigns";
import CreatorAccountEditPage from "@/pages/creator/account-edit";
import CreatorVerifyPage from "@/pages/creator/verify";

import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminUsersPage from "@/pages/admin/users";
import AdminAccountsPage from "@/pages/admin/accounts";
import AdminCampaignsPage from "@/pages/admin/campaigns";
import AdminSubmissionsPage from "@/pages/admin/submissions";
import VerifyRequestsPage from "@/pages/admin/verify-requests";
import AdminKycRequestsPage from "@/pages/admin/kyc-requests";
import AdminPayoutsPage from "@/pages/admin/payouts";
import AdminSettingsPage from "@/pages/admin/settings";
import AdminFaqsPage from "@/pages/admin/faqs";
import AdminLegalPage from "@/pages/admin/legal";
import AdminMessagingPage from "@/pages/admin/messaging";
import AdminRolesPage from "@/pages/admin/roles";

import SettingsPage from "@/pages/shared/settings";
import FaqPage from "@/pages/shared/faq";
import TrendAiPage from "@/pages/shared/trend-ai";

import BlogPage from "@/pages/public/blog";
import HelpPage from "@/pages/public/help";
import PublicSearchPage from "@/pages/public/search";
import PublicCreatorProfilePage from "@/pages/public/creator-profile";
import AdminReportsPage from "@/pages/admin/reports";
import BrandReportsPage from "@/pages/brand/reports";

import AgencyDashboardPage from "@/pages/agency/dashboard";
import AgencyClientsPage from "@/pages/agency/clients";
import AgencyCampaignsPage from "@/pages/agency/campaigns";
import AgencyBillingPage from "@/pages/agency/billing";
import AgencyMessagesPage from "@/pages/agency/messages";
import AgencyReportsPage from "@/pages/agency/reports";

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
      <Route path="/reset-password" component={ResetPasswordPage} />

      {/* ── Public creator profiles (always accessible) ── */}
      <Route path="/c/:username" component={PublicCreatorProfilePage} />

      {/* ── Public pages (always accessible to everyone) ── */}
      <Route path="/privacy" component={LegalPage} />
      <Route path="/terms" component={LegalPage} />
      <Route path="/terms-of-use" component={LegalPage} />
      <Route path="/gdpr" component={LegalPage} />
      <Route path="/community-guidelines" component={CommunityGuidelinesPage} />
      <Route path="/brands" component={BrandsPage} />
      <Route path="/agencies" component={AgenciesPage} />
      <Route path="/influencers-creators" component={InfluencersCreatorsPage} />
      <Route path="/search" component={PublicSearchPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/help" component={HelpPage} />

      {/* ── Home page — only for unauthenticated (logged-in users land on their dashboard) ── */}
      {!user && <Route path="/" component={HomePage} />}

      {/* ── Admin routes ── */}
      {user && role === "admin" && (
        <>
          <Route path="/" component={() => <Redirect to="/admin" />} />
          <Route path="/admin" component={AdminDashboardPage} />

          {/* Account Mgt sub-pages */}
          <Route path="/admin/accounts" component={AdminAccountsPage} />
          <Route path="/admin/accounts/brands" component={AdminAccountsPage} />
          <Route path="/admin/accounts/creators" component={AdminAccountsPage} />
          <Route path="/admin/accounts/agencies" component={AdminAccountsPage} />
          <Route path="/admin/accounts/pending" component={AdminAccountsPage} />
          {/* Legacy users route */}
          <Route path="/admin/users" component={() => <Redirect to="/admin/accounts" />} />

          {/* Campaign Mgt sub-pages */}
          <Route path="/admin/campaigns" component={AdminCampaignsPage} />
          <Route path="/admin/campaigns/active" component={AdminCampaignsPage} />
          <Route path="/admin/campaigns/pending" component={AdminCampaignsPage} />
          <Route path="/admin/campaigns/completed" component={AdminCampaignsPage} />
          <Route path="/admin/campaigns/declined" component={AdminCampaignsPage} />

          {/* Payments */}
          <Route path="/admin/payouts" component={AdminPayoutsPage} />

          {/* Approval Request sub-pages — /admin/approvals is canonical, /admin/verify-requests is legacy alias */}
          <Route path="/admin/approvals" component={VerifyRequestsPage} />
          <Route path="/admin/approvals/approved" component={VerifyRequestsPage} />
          <Route path="/admin/approvals/declined" component={VerifyRequestsPage} />
          <Route path="/admin/verify-requests" component={VerifyRequestsPage} />
          <Route path="/admin/verify-requests/approved" component={VerifyRequestsPage} />
          <Route path="/admin/verify-requests/declined" component={VerifyRequestsPage} />

          {/* KYC Identity Verification */}
          <Route path="/admin/kyc-requests" component={AdminKycRequestsPage} />
          <Route path="/admin/kyc-requests/pending" component={AdminKycRequestsPage} />
          <Route path="/admin/kyc-requests/approved" component={AdminKycRequestsPage} />

          {/* Reports */}
          <Route path="/admin/reports" component={AdminReportsPage} />

          {/* Submissions */}
          <Route path="/admin/submissions" component={AdminSubmissionsPage} />

          {/* Messaging */}
          <Route path="/admin/messages" component={AdminMessagingPage} />
          <Route path="/admin/messages/broadcast" component={AdminMessagingPage} />

          {/* Settings sub-pages */}
          <Route path="/admin/settings" component={AdminSettingsPage} />
          <Route path="/admin/settings/general" component={AdminSettingsPage} />
          <Route path="/admin/settings/fees" component={AdminSettingsPage} />
          <Route path="/admin/settings/gateway" component={AdminSettingsPage} />
          <Route path="/admin/settings/smtp" component={AdminSettingsPage} />

          {/* Roles & Permissions */}
          <Route path="/admin/roles" component={AdminRolesPage} />

          {/* FAQs & Legal */}
          <Route path="/admin/faqs" component={AdminFaqsPage} />
          <Route path="/admin/legal" component={AdminLegalPage} />

          {/* Account / Profile */}
          <Route path="/admin/account" component={() => <Redirect to="/settings/profile" />} />
          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {/* ── Creator routes ── */}
      {user && role === "creator" && (
        <>
          <Route path="/" component={CreatorDashboardPage} />

          {/* Account Edit */}
          <Route path="/account/edit" component={CreatorAccountEditPage} />

          {/* Campaign Management — URL-driven filter tabs */}
          <Route path="/campaigns" component={CreatorCampaignsPage} />
          <Route path="/campaigns/pending" component={CreatorCampaignsPage} />
          <Route path="/campaigns/accepted" component={CreatorCampaignsPage} />
          <Route path="/campaigns/active" component={CreatorCampaignsPage} />
          <Route path="/campaigns/completed" component={CreatorCampaignsPage} />
          <Route path="/campaigns/declined" component={CreatorCampaignsPage} />

          <Route path="/invites" component={InvitesPage} />
          <Route path="/invites/:id" component={InvitesPage} />
          <Route path="/invites/accepted" component={InvitesPage} />
          <Route path="/invites/completed" component={InvitesPage} />
          <Route path="/invites/declined" component={InvitesPage} />

          <Route path="/submissions/new" component={SubmitPage} />
          <Route path="/earnings" component={EarningsPage} />
          <Route path="/messages" component={CreatorMessagesPage} />
          <Route path="/verify" component={CreatorVerifyPage} />

          <Route path="/billing" component={CreatorBillingPage} />
          <Route path="/payments" component={CreatorPaymentsPage} />
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

          {/* Account Edit */}
          <Route path="/account/edit" component={BrandAccountEditPage} />

          {/* Campaign Mgt sub-pages */}
          <Route path="/campaigns" component={CampaignsPage} />
          <Route path="/campaigns/new" component={CampaignNewPage} />
          <Route path="/campaigns/:id" component={CampaignDetailPage} />
          <Route path="/campaigns/active" component={CampaignsPage} />
          <Route path="/campaigns/completed" component={CampaignsPage} />

          <Route path="/creators" component={CreatorsPage} />
          <Route path="/creators/:id" component={CreatorProfilePage} />
          <Route path="/messages" component={BrandMessagesPage} />
          <Route path="/payments" component={PaymentsPage} />

          <Route path="/rewards" component={BrandRewardsPage} />
          <Route path="/reports" component={BrandReportsPage} />
          <Route path="/billing" component={BrandBillingPage} />
          <Route path="/trend-ai" component={TrendAiPage} />
          <Route path="/faq" component={FaqPage} />

          <Route path="/settings/profile" component={SettingsPage} />
          <Route component={NotFound} />
        </>
      )}

      {/* ── Agency routes ── */}
      {user && role === "agency" && (
        <>
          <Route path="/" component={AgencyDashboardPage} />
          <Route path="/agency/dashboard" component={AgencyDashboardPage} />
          <Route path="/agency/clients" component={AgencyClientsPage} />
          <Route path="/agency/campaigns" component={AgencyCampaignsPage} />
          <Route path="/agency/billing" component={AgencyBillingPage} />
          <Route path="/agency/messages" component={AgencyMessagesPage} />
          <Route path="/agency/reports" component={AgencyReportsPage} />
          <Route path="/agency/settings" component={SettingsPage} />
          <Route path="/trend-ai" component={TrendAiPage} />
          <Route path="/faq" component={FaqPage} />
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
