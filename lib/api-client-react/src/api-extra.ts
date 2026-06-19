import { customFetch } from "./custom-fetch";
import { useMutation, useQuery, type UseQueryOptions, type UseMutationOptions } from "@tanstack/react-query";

// ── Types ────────────────────────────────────────────────────────────────────

export interface BankAccount {
  id: number;
  userId: number;
  bankName: string;
  bankCode: string | null;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  createdAt: string;
}

export interface GemsTransaction {
  id: number;
  type: "purchase" | "spend" | "reward";
  gemsDelta: number;
  amount: number | null;
  description: string | null;
  reference: string | null;
  gateway: string | null;
  createdAt: string;
}

export interface BillingBalance {
  gems: number;
  balance: string;
  transactions: GemsTransaction[];
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface LegalPage {
  id: number;
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface AdminMessage {
  id: number;
  fromUserId: number;
  toUserId: number;
  body: string;
  isRead: boolean;
  fromName: string;
  fromRole: string;
  createdAt: string;
}

// ── Bank Accounts ─────────────────────────────────────────────────────────────

export const getListBankAccountsQueryKey = () => ["/account/bank-accounts"] as const;

export const listBankAccounts = () =>
  customFetch<BankAccount[]>("/api/account/bank-accounts");

export const useListBankAccounts = <TData = BankAccount[]>(options?: {
  query?: UseQueryOptions<BankAccount[], unknown, TData>;
}) =>
  useQuery<BankAccount[], unknown, TData>({
    queryKey: getListBankAccountsQueryKey(),
    queryFn: () => listBankAccounts(),
    ...options?.query,
  });

export const useAddBankAccount = (
  options?: UseMutationOptions<BankAccount, unknown, { bankName: string; bankCode?: string; accountNumber: string; accountName: string; isDefault?: boolean }>
) =>
  useMutation<BankAccount, unknown, { bankName: string; bankCode?: string; accountNumber: string; accountName: string; isDefault?: boolean }>({
    mutationFn: (data) =>
      customFetch<BankAccount>("/api/account/bank-accounts", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });

export const useSetDefaultBankAccount = (
  options?: UseMutationOptions<{ message: string }, unknown, { id: number }>
) =>
  useMutation<{ message: string }, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<{ message: string }>(`/api/account/bank-accounts/${id}/default`, { method: "PUT" }),
    ...options,
  });

export const useDeleteBankAccount = (
  options?: UseMutationOptions<void, unknown, { id: number }>
) =>
  useMutation<void, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<void>(`/api/account/bank-accounts/${id}`, { method: "DELETE" }),
    ...options,
  });

// ── Billing Balance ────────────────────────────────────────────────────────────

export const getBillingBalanceQueryKey = () => ["/billing/balance"] as const;

export const useBillingBalance = <TData = BillingBalance>(options?: {
  query?: UseQueryOptions<BillingBalance, unknown, TData>;
}) =>
  useQuery<BillingBalance, unknown, TData>({
    queryKey: getBillingBalanceQueryKey(),
    queryFn: () => customFetch<BillingBalance>("/api/billing/balance"),
    ...options?.query,
  });

export const usePurchaseGems = (
  options?: UseMutationOptions<{ paymentUrl: string | null; txRef: string }, unknown, { packageId: string; currency?: string }>
) =>
  useMutation<{ paymentUrl: string | null; txRef: string }, unknown, { packageId: string; currency?: string }>({
    mutationFn: (data) =>
      customFetch<{ paymentUrl: string | null; txRef: string }>("/api/billing/purchase", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });

export const useVerifyGemsPurchase = (
  options?: UseMutationOptions<{ success: boolean; gemsAdded: number }, unknown, { txRef: string }>
) =>
  useMutation<{ success: boolean; gemsAdded: number }, unknown, { txRef: string }>({
    mutationFn: (data) =>
      customFetch<{ success: boolean; gemsAdded: number }>("/api/billing/verify", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });

// ── FAQs (public) ─────────────────────────────────────────────────────────────

export const getListFaqsQueryKey = () => ["/faqs"] as const;

export const listFaqs = () => customFetch<Faq[]>("/api/faqs");

export const useListFaqs = <TData = Faq[]>(options?: {
  query?: UseQueryOptions<Faq[], unknown, TData>;
}) =>
  useQuery<Faq[], unknown, TData>({
    queryKey: getListFaqsQueryKey(),
    queryFn: () => listFaqs(),
    ...options?.query,
  });

// ── FAQs (admin) ──────────────────────────────────────────────────────────────

export const getAdminListFaqsQueryKey = () => ["/admin/faqs"] as const;

export const useAdminListFaqs = <TData = Faq[]>(options?: {
  query?: UseQueryOptions<Faq[], unknown, TData>;
}) =>
  useQuery<Faq[], unknown, TData>({
    queryKey: getAdminListFaqsQueryKey(),
    queryFn: () => customFetch<Faq[]>("/api/admin/faqs"),
    ...options?.query,
  });

export const useAdminCreateFaq = (
  options?: UseMutationOptions<Faq, unknown, { question: string; answer: string; category?: string; sortOrder?: number }>
) =>
  useMutation<Faq, unknown, { question: string; answer: string; category?: string; sortOrder?: number }>({
    mutationFn: (data) =>
      customFetch<Faq>("/api/admin/faqs", { method: "POST", body: JSON.stringify(data) }),
    ...options,
  });

export const useAdminUpdateFaq = (
  options?: UseMutationOptions<Faq, unknown, { id: number; question?: string; answer?: string; category?: string; isActive?: boolean; sortOrder?: number }>
) =>
  useMutation<Faq, unknown, { id: number; question?: string; answer?: string; category?: string; isActive?: boolean; sortOrder?: number }>({
    mutationFn: ({ id, ...data }) =>
      customFetch<Faq>(`/api/admin/faqs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    ...options,
  });

export const useAdminDeleteFaq = (
  options?: UseMutationOptions<void, unknown, { id: number }>
) =>
  useMutation<void, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<void>(`/api/admin/faqs/${id}`, { method: "DELETE" }),
    ...options,
  });

// ── Legal Pages ───────────────────────────────────────────────────────────────

export const getLegalPageQueryKey = (slug: string) => [`/legal/${slug}`] as const;

export const useLegalPage = (slug: string, options?: {
  query?: UseQueryOptions<LegalPage, unknown>;
}) =>
  useQuery<LegalPage, unknown>({
    queryKey: getLegalPageQueryKey(slug),
    queryFn: () => customFetch<LegalPage>(`/api/legal/${slug}`),
    retry: false,
    ...options?.query,
  });

export const getAdminListLegalQueryKey = () => ["/admin/legal"] as const;

export const useAdminListLegal = <TData = LegalPage[]>(options?: {
  query?: UseQueryOptions<LegalPage[], unknown, TData>;
}) =>
  useQuery<LegalPage[], unknown, TData>({
    queryKey: getAdminListLegalQueryKey(),
    queryFn: () => customFetch<LegalPage[]>("/api/admin/legal"),
    ...options?.query,
  });

export const useAdminSaveLegalPage = (
  options?: UseMutationOptions<LegalPage, unknown, { slug: string; title: string; content: string }>
) =>
  useMutation<LegalPage, unknown, { slug: string; title: string; content: string }>({
    mutationFn: ({ slug, ...data }) =>
      customFetch<LegalPage>(`/api/admin/legal/${slug}`, { method: "PUT", body: JSON.stringify(data) }),
    ...options,
  });

// ── Admin Broadcast ───────────────────────────────────────────────────────────

export const useAdminBroadcast = (
  options?: UseMutationOptions<{ sent: number }, unknown, { message: string; targetRole?: string; link?: string }>
) =>
  useMutation<{ sent: number }, unknown, { message: string; targetRole?: string; link?: string }>({
    mutationFn: (data) =>
      customFetch<{ sent: number }>("/api/admin/messages/broadcast", { method: "POST", body: JSON.stringify(data) }),
    ...options,
  });

// ── Admin Messages Monitor ────────────────────────────────────────────────────

export const getAdminMessagesQueryKey = () => ["/admin/messages"] as const;

export const useAdminMessages = <TData = AdminMessage[]>(options?: {
  query?: UseQueryOptions<AdminMessage[], unknown, TData>;
}) =>
  useQuery<AdminMessage[], unknown, TData>({
    queryKey: getAdminMessagesQueryKey(),
    queryFn: () => customFetch<AdminMessage[]>("/api/admin/messages"),
    ...options?.query,
  });

// ── Reward Creators (POST /rewards) ───────────────────────────────────────────

export const useRewardCreators = (
  options?: UseMutationOptions<{ paymentUrl: string; txRef: string }, unknown, { creatorIds: number[]; amount: number; rewardType: string; campaignId?: number | null }>
) =>
  useMutation<{ paymentUrl: string; txRef: string }, unknown, { creatorIds: number[]; amount: number; rewardType: string; campaignId?: number | null }>({
    mutationFn: (data) =>
      customFetch<{ paymentUrl: string; txRef: string }>("/api/rewards", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });

// ── Account Profile (GET/PUT /api/account/profile) ───────────────────────────

export interface AccountProfile {
  id: number; firstName: string; lastName: string; userName: string; email: string;
  phone: string | null; role: string; gender: string | null; badge: string | null;
  isActive: boolean; isLocked: boolean; bio: string | null; avatarUrl: string | null;
  dob: string | null; companyName: string | null; companySize: string | null; companyType: string | null;
  instagramProfile: string | null; facebookProfile: string | null; twitterProfile: string | null;
  youtubeProfile: string | null; tiktokProfile: string | null; snapchatProfile: string | null;
  contentCategory: string | null; creatorCategory: string | null;
  countryId: number | null; stateId: number | null;
  gems: number; balance: string;
  instagramDayPostPrice: number | null; instagramWeekPostPrice: number | null;
  instagramDayStoryPrice: number | null; instagramWeekStoryPrice: number | null;
  instagramDayReelPrice: number | null; instagramWeekReelPrice: number | null;
  instagramDayLivePrice: number | null; instagramWeekLivePrice: number | null;
  fbDayPostPrice: number | null; fbWeekPostPrice: number | null;
  tiktokDayPostPrice: number | null; tiktokWeekPostPrice: number | null;
  youtubeDayPostPrice: number | null; youtubeWeekPostPrice: number | null;
  twitterDayPostPrice: number | null; twitterWeekPostPrice: number | null;
  snapchatDayStoryPrice: number | null; snapchatWeekStoryPrice: number | null;
  contentCreatorRate: number | null;
  createdAt: string;
}

export const getAccountProfileQueryKey = () => ["/account/profile"] as const;

export const useAccountProfile = <TData = AccountProfile>(options?: {
  query?: UseQueryOptions<AccountProfile, unknown, TData>;
}) =>
  useQuery<AccountProfile, unknown, TData>({
    queryKey: getAccountProfileQueryKey(),
    queryFn: () => customFetch<AccountProfile>("/api/account/profile"),
    ...options?.query,
  });

export const useUpdateAccountProfile = (
  options?: UseMutationOptions<AccountProfile, unknown, Partial<AccountProfile>>
) =>
  useMutation<AccountProfile, unknown, Partial<AccountProfile>>({
    mutationFn: (data) =>
      customFetch<AccountProfile>("/api/account/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    ...options,
  });

// ── KYC / Identity Verification ───────────────────────────────────────────────

export interface KycRequest {
  id: number;
  userId: number;
  legalName: string;
  country: string;
  idType: "national_id" | "passport" | "drivers_licence";
  idNumber: string;
  documentUrl: string | null;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface KycRequestAdmin extends KycRequest {
  creator: {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    verified: boolean;
  };
}

export const getMyKycRequestQueryKey = () => ["/creator/kyc-request"] as const;

export const useGetMyKycRequest = <TData = KycRequest>(options?: {
  query?: UseQueryOptions<KycRequest, unknown, TData>;
}) =>
  useQuery<KycRequest, unknown, TData>({
    queryKey: getMyKycRequestQueryKey(),
    queryFn: () => customFetch<KycRequest>("/api/creator/kyc-request"),
    retry: false,
    ...options?.query,
  });

export const useSubmitKycRequest = (
  options?: UseMutationOptions<KycRequest, unknown, { legalName: string; country: string; idType: string; idNumber: string; documentUrl?: string | null }>
) =>
  useMutation<KycRequest, unknown, { legalName: string; country: string; idType: string; idNumber: string; documentUrl?: string | null }>({
    mutationFn: (data) =>
      customFetch<KycRequest>("/api/creator/kyc-request", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    ...options,
  });

export const getAdminKycRequestsQueryKey = () => ["/admin/kyc-requests"] as const;

export const useAdminKycRequests = <TData = KycRequestAdmin[]>(options?: {
  query?: UseQueryOptions<KycRequestAdmin[], unknown, TData>;
}) =>
  useQuery<KycRequestAdmin[], unknown, TData>({
    queryKey: getAdminKycRequestsQueryKey(),
    queryFn: () => customFetch<KycRequestAdmin[]>("/api/admin/kyc-requests"),
    ...options?.query,
  });

export const useAdminApproveKycRequest = (
  options?: UseMutationOptions<{ message: string }, unknown, { id: number }>
) =>
  useMutation<{ message: string }, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<{ message: string }>(`/api/admin/kyc-requests/${id}/approve`, { method: "POST" }),
    ...options,
  });

export const useAdminRejectKycRequest = (
  options?: UseMutationOptions<{ message: string }, unknown, { id: number }>
) =>
  useMutation<{ message: string }, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<{ message: string }>(`/api/admin/kyc-requests/${id}/reject`, { method: "POST" }),
    ...options,
  });

// ── Campaign Discovery ─────────────────────────────────────────────────────────

export interface DiscoverCampaign {
  id: number;
  name: string;
  sponsor: string;
  description: string | null;
  type: "influencer" | "content_creator";
  campaignDuration: "day" | "weekly";
  campaignCategoryId: number | null;
  startDate: string;
  endDate: string;
  noOfCreators: number;
  gemsPerCreator: number | null;
  coverImageUrl: string | null;
  createdAt: string;
}

export const getDiscoverCampaignsQueryKey = () => ["/creator/discover-campaigns"] as const;

export const useDiscoverCampaigns = <TData = DiscoverCampaign[]>(options?: {
  query?: UseQueryOptions<DiscoverCampaign[], unknown, TData>;
}) =>
  useQuery<DiscoverCampaign[], unknown, TData>({
    queryKey: getDiscoverCampaignsQueryKey(),
    queryFn: () => customFetch<DiscoverCampaign[]>("/api/creator/discover-campaigns"),
    ...options?.query,
  });

export const useApplyToCampaign = (
  options?: UseMutationOptions<{ id: number; campaignId: number; creatorId: number; status: string; createdAt: string }, unknown, { campaignId: number }>
) =>
  useMutation<{ id: number; campaignId: number; creatorId: number; status: string; createdAt: string }, unknown, { campaignId: number }>({
    mutationFn: ({ campaignId }) =>
      customFetch(`/api/creator/campaigns/${campaignId}/apply`, { method: "POST" }),
    ...options,
  });

// ── Brand Application Approve / Reject ────────────────────────────────────────

export const useBrandApproveApplication = (
  options?: UseMutationOptions<{ message: string }, unknown, { campaignId: number; inviteId: number }>
) =>
  useMutation<{ message: string }, unknown, { campaignId: number; inviteId: number }>({
    mutationFn: ({ campaignId, inviteId }) =>
      customFetch(`/api/campaigns/${campaignId}/applications/${inviteId}/approve`, { method: "POST" }),
    ...options,
  });

export const useBrandRejectApplication = (
  options?: UseMutationOptions<{ message: string }, unknown, { campaignId: number; inviteId: number }>
) =>
  useMutation<{ message: string }, unknown, { campaignId: number; inviteId: number }>({
    mutationFn: ({ campaignId, inviteId }) =>
      customFetch(`/api/campaigns/${campaignId}/applications/${inviteId}/reject`, { method: "POST" }),
    ...options,
  });

// ── Onboarding Complete ────────────────────────────────────────────────────────

export const useCompleteOnboarding = (
  options?: UseMutationOptions<{ message: string }, unknown, void>
) =>
  useMutation<{ message: string }, unknown, void>({
    mutationFn: () =>
      customFetch<{ message: string }>("/api/auth/me/onboarding-complete", { method: "PATCH" }),
    ...options,
  });

// ── Update Bank Details (creator) ─────────────────────────────────────────────

export const useUpdateBankDetails = (
  options?: UseMutationOptions<{ message: string }, unknown, { bankName: string; accountNumber: string; accountName: string }>
) =>
  useMutation<{ message: string }, unknown, { bankName: string; accountNumber: string; accountName: string }>({
    mutationFn: (data) =>
      customFetch<{ message: string }>("/api/auth/me/bank-details", {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    ...options,
  });

// ── Admin Approve & Disburse Payout ───────────────────────────────────────────

export interface PayoutWithGateway {
  id: number;
  creatorId: number;
  amount: number;
  status: string;
  gateway: string | null;
  transferRef: string | null;
  createdAt: string;
  creator?: {
    id: number; firstName: string; lastName: string; userName: string;
    badge: string | null; avatarUrl: string | null;
  } | null;
  bankDetails?: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  } | null;
}

export interface DisburseResult {
  message: string;
  gateway: string;
  transferRef: string;
}

export const useAdminApproveAndDisburse = (
  options?: UseMutationOptions<DisburseResult, unknown, { id: number }>
) =>
  useMutation<DisburseResult, unknown, { id: number }>({
    mutationFn: ({ id }) =>
      customFetch<DisburseResult>(`/api/admin/payouts/${id}/approve`, { method: "POST" }),
    ...options,
  });
