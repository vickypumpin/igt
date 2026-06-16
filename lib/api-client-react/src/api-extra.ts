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
  options?: UseMutationOptions<{ paymentUrl: string | null; txRef: string }, unknown, { packageId: string; amount: number; gems: number; currency?: string }>
) =>
  useMutation<{ paymentUrl: string | null; txRef: string }, unknown, { packageId: string; amount: number; gems: number; currency?: string }>({
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
