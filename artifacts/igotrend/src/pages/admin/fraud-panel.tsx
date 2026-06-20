import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { customFetch } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import {
  Lock, Unlock, AlertTriangle, TrendingUp, CreditCard, ShieldAlert, CheckCircle,
} from "lucide-react";

interface FlaggedUser {
  id: number;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  email: string | null;
  role: string | null;
  isLocked: boolean;
  lockedUntil: string | null;
  failedLoginAttempts: number;
  followersFlag: boolean;
  createdAt: string;
  rejections?: number;
}

interface FlaggedData {
  locked: FlaggedUser[];
  followerFlagged: FlaggedUser[];
  multipleKycRejections: FlaggedUser[];
  unverifiedBankPayouts: FlaggedUser[];
}

type TabKey = "locked" | "followerFlagged" | "multipleKycRejections" | "unverifiedBankPayouts";

async function fetchFlaggedAccounts(): Promise<FlaggedData> {
  return customFetch<FlaggedData>("/api/admin/flagged-accounts");
}

async function unlockUser(id: number): Promise<void> {
  await customFetch(`/api/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ action: "unlock" }) });
}

async function clearFlag(id: number): Promise<void> {
  await customFetch(`/api/admin/flagged-accounts/${id}/clear-flag`, { method: "PATCH" });
}

const TAB_CONFIG: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; emptyMsg: string }[] = [
  { key: "locked", label: "Locked Accounts", icon: Lock, emptyMsg: "No locked accounts." },
  { key: "followerFlagged", label: "Follower Flags", icon: TrendingUp, emptyMsg: "No follower plausibility flags." },
  { key: "multipleKycRejections", label: "Multiple KYC Rejections", icon: AlertTriangle, emptyMsg: "No accounts with multiple KYC rejections." },
  { key: "unverifiedBankPayouts", label: "Unverified Bank + Pending Payout", icon: CreditCard, emptyMsg: "No accounts with unverified banks and pending payouts." },
];

export default function FraudPanelPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("locked");
  const { toast } = useToast();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<FlaggedData>({
    queryKey: ["admin-flagged-accounts"],
    queryFn: fetchFlaggedAccounts,
  });

  const unlockMutation = useMutation({
    mutationFn: unlockUser,
    onSuccess: () => {
      toast({ title: "Account unlocked" });
      qc.invalidateQueries({ queryKey: ["admin-flagged-accounts"] });
    },
    onError: () => toast({ title: "Failed to unlock", variant: "destructive" }),
  });

  const clearFlagMutation = useMutation({
    mutationFn: clearFlag,
    onSuccess: () => {
      toast({ title: "Flag cleared" });
      qc.invalidateQueries({ queryKey: ["admin-flagged-accounts"] });
    },
    onError: () => toast({ title: "Failed to clear flag", variant: "destructive" }),
  });

  const counts: Record<TabKey, number> = {
    locked: data?.locked.length ?? 0,
    followerFlagged: data?.followerFlagged.length ?? 0,
    multipleKycRejections: data?.multipleKycRejections.length ?? 0,
    unverifiedBankPayouts: data?.unverifiedBankPayouts.length ?? 0,
  };

  const users: FlaggedUser[] = data?.[activeTab] ?? [];

  return (
    <AdminLayout>
      <div data-testid="page-admin-fraud-panel">
        <div className="mb-7">
          <div className="flex items-center gap-3 mb-1">
            <ShieldAlert className="h-6 w-6 text-rose-500" />
            <h1 className="text-2xl font-extrabold text-foreground">Flagged Accounts</h1>
          </div>
          <p className="text-sm text-muted-foreground">Accounts requiring fraud review or admin action.</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {TAB_CONFIG.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`bg-white rounded-2xl p-4 border shadow-sm text-left transition-all hover:shadow-md ${activeTab === key ? "border-rose-400 ring-2 ring-rose-200" : "border-gray-100"}`}
            >
              <Icon className={`h-5 w-5 mb-2 ${counts[key] > 0 ? "text-rose-500" : "text-muted-foreground"}`} />
              <div className={`text-2xl font-extrabold ${counts[key] > 0 ? "text-rose-600" : "text-foreground"}`}>{isLoading ? "–" : counts[key]}</div>
              <div className="text-xs text-muted-foreground mt-0.5 leading-tight">{label}</div>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex gap-0 border-b border-gray-100 overflow-x-auto">
            {TAB_CONFIG.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === key
                    ? "border-rose-500 text-rose-600 bg-rose-50/50"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
                {counts[key] > 0 && (
                  <span className="ml-2 bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {counts[key]}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="p-6 space-y-3">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}
              </div>
            ) : users.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
                <CheckCircle className="h-10 w-10 opacity-20" />
                <p className="text-sm">{TAB_CONFIG.find(t => t.key === activeTab)?.emptyMsg}</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">User</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Details</th>
                    <th className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-foreground">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-muted-foreground">@{u.userName} · {u.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="capitalize">{u.role ?? "—"}</Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground space-y-1">
                        {activeTab === "locked" && (
                          <>
                            <div className="flex items-center gap-1.5">
                              <Lock className="h-3 w-3 text-rose-500" />
                              <span>Failed attempts: {u.failedLoginAttempts}</span>
                            </div>
                            {u.lockedUntil && (
                              <div>Locked until: {new Date(u.lockedUntil).toLocaleString()}</div>
                            )}
                          </>
                        )}
                        {activeTab === "followerFlagged" && (
                          <div className="flex items-center gap-1.5">
                            <TrendingUp className="h-3 w-3 text-amber-500" />
                            <span>Suspicious follower count jump detected</span>
                          </div>
                        )}
                        {activeTab === "multipleKycRejections" && (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="h-3 w-3 text-rose-500" />
                            <span>{(u as FlaggedUser & { rejections?: number }).rejections ?? 2}× KYC rejected</span>
                          </div>
                        )}
                        {activeTab === "unverifiedBankPayouts" && (
                          <div className="flex items-center gap-1.5">
                            <CreditCard className="h-3 w-3 text-rose-500" />
                            <span>Unverified bank account with pending payout</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {activeTab === "locked" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => unlockMutation.mutate(u.id)}
                              disabled={unlockMutation.isPending}
                            >
                              <Unlock className="h-3 w-3" /> Unlock
                            </Button>
                          )}
                          {activeTab === "followerFlagged" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => clearFlagMutation.mutate(u.id)}
                              disabled={clearFlagMutation.isPending}
                            >
                              <CheckCircle className="h-3 w-3" /> Clear Flag
                            </Button>
                          )}
                          {(activeTab === "multipleKycRejections" || activeTab === "unverifiedBankPayouts") && (
                            <span className="text-xs text-muted-foreground italic">Review via KYC / Payouts pages</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
