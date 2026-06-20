import { useState, useEffect, useRef } from "react";
import { useGetMe, getGetMeQueryKey } from "@workspace/api-client-react";
import {
  useListBankAccounts, useAddBankAccount, useSetDefaultBankAccount, useDeleteBankAccount,
  useBillingBalance, getBillingBalanceQueryKey, getListBankAccountsQueryKey,
  useListBanks, useVerifyBankAccount,
} from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ArrowDownCircle, ArrowUpCircle, BadgeCheck, Gem, Gift, Landmark, Loader2, Plus, ShieldCheck, Star, Trash2, X } from "lucide-react";

function AddBankModal({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const addMutation = useAddBankAccount();
  const { data: bankOptions = [], isLoading: banksLoading } = useListBanks();
  const verifyMutation = useVerifyBankAccount();

  const [selectedBank, setSelectedBank] = useState<{ name: string; code: string } | null>(null);
  const [bankSearch, setBankSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredBanks = bankOptions.filter(b =>
    b.name.toLowerCase().includes(bankSearch.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (accountNumber.length === 10 && selectedBank) {
      setVerified(false);
      setAccountName("");
      setVerifyError("");
      verifyMutation.mutate(
        { accountNumber, bankCode: selectedBank.code },
        {
          onSuccess: (data) => {
            setAccountName(data.accountName);
            setVerified(true);
            setVerifyError("");
          },
          onError: (err: unknown) => {
            const msg = (err as { data?: { error?: string } })?.data?.error
              ?? (err instanceof Error ? err.message : "Verification failed");
            setVerifyError(msg);
            setAccountName("");
            setVerified(false);
          },
        }
      );
    } else if (accountNumber.length < 10) {
      setVerified(false);
      setAccountName("");
      setVerifyError("");
    }
  }, [accountNumber, selectedBank]);

  const submit = () => {
    if (!selectedBank || !accountNumber || !verified) {
      toast({ title: "Please complete account verification first", variant: "destructive" }); return;
    }
    addMutation.mutate(
      { bankName: selectedBank.name, bankCode: selectedBank.code, accountNumber, isDefault },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListBankAccountsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getBillingBalanceQueryKey() });
          toast({ title: "Bank account added ✓" });
          onClose();
        },
        onError: () => toast({ title: "Failed to add account", variant: "destructive" }),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="px-6 py-5 border-b border-border/60 flex items-center justify-between">
          <div className="text-base font-bold">Add Bank Account</div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          {/* Bank dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Bank</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(o => !o)}
              className="w-full h-10 rounded-xl border border-input px-3 text-sm text-left flex items-center justify-between focus:outline-none focus:ring-1 focus:ring-ring bg-white"
            >
              <span className={selectedBank ? "text-foreground" : "text-muted-foreground"}>
                {banksLoading ? "Loading banks…" : (selectedBank?.name ?? "Select a bank…")}
              </span>
              <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-border rounded-xl shadow-lg overflow-hidden">
                <div className="p-2 border-b border-border/60">
                  <Input
                    autoFocus
                    placeholder="Search bank…"
                    value={bankSearch}
                    onChange={e => setBankSearch(e.target.value)}
                    className="h-8 rounded-lg text-sm"
                  />
                </div>
                <div className="max-h-52 overflow-y-auto">
                  {filteredBanks.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">No banks found</div>
                  ) : filteredBanks.map(b => (
                    <button
                      key={b.code}
                      type="button"
                      className="w-full px-3 py-2 text-sm text-left hover:bg-muted/60 transition-colors"
                      onClick={() => {
                        setSelectedBank(b);
                        setBankSearch("");
                        setDropdownOpen(false);
                        setAccountNumber("");
                        setAccountName("");
                        setVerified(false);
                        setVerifyError("");
                      }}
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Account number */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Account number</label>
            <Input
              placeholder="10-digit account number"
              value={accountNumber}
              maxLength={10}
              onChange={e => setAccountNumber(e.target.value.replace(/\D/g, ""))}
              className="h-10 rounded-xl"
            />
          </div>

          {/* Account name — auto-filled & read-only */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 flex items-center gap-2">
              Account name
              {verified && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>
                  <ShieldCheck className="h-3 w-3" />Verified ✓
                </span>
              )}
            </label>
            <div className="relative">
              <Input
                readOnly
                placeholder={
                  !selectedBank ? "Select a bank first" :
                  accountNumber.length < 10 ? "Enter 10-digit account number" :
                  verifyMutation.isPending ? "Verifying…" :
                  verifyError ? "Verification failed" :
                  "Account name will appear here"
                }
                value={accountName}
                className="h-10 rounded-xl bg-muted/40 cursor-default pr-9"
              />
              {verifyMutation.isPending && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {verified && !verifyMutation.isPending && (
                <BadgeCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#059669" }} />
              )}
            </div>
            {verifyError && (
              <p className="text-xs mt-1" style={{ color: "#DC2626" }}>{verifyError}</p>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input type="checkbox" checked={isDefault} onChange={e => setIsDefault(e.target.checked)} className="h-4 w-4 rounded border-border" />
            <span className="text-sm text-muted-foreground">Set as default payout account</span>
          </label>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancel</Button>
          <Button
            onClick={submit}
            disabled={addMutation.isPending || !verified}
            className="flex-1 rounded-xl font-semibold"
            style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}
          >
            {addMutation.isPending ? "Adding…" : "Add Account"}
          </Button>
        </div>
      </div>
    </div>
  );
}

const TXN_ICONS: Record<string, React.ElementType> = {
  purchase: ArrowDownCircle,
  reward: Gift,
  spend: ArrowUpCircle,
};
const TXN_COLORS: Record<string, string> = {
  purchase: "#059669",
  reward: "#6B2FCE",
  spend: "#DC2626",
};

export default function CreatorBillingPage() {
  const { data: me } = useGetMe({ query: { queryKey: getGetMeQueryKey() } });
  const { data: accounts = [], isLoading: loadingAccounts } = useListBankAccounts();
  const { data: billing, isLoading: loadingBilling } = useBillingBalance();
  const setDefault = useSetDefaultBankAccount();
  const deleteAccount = useDeleteBankAccount();
  const { toast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  const handleSetDefault = (id: number) => {
    setDefault.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBankAccountsQueryKey() }); toast({ title: "Default account updated ✓" }); },
    });
  };

  const handleDelete = (id: number) => {
    deleteAccount.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListBankAccountsQueryKey() }); toast({ title: "Account removed" }); },
    });
  };

  const transactions = billing?.transactions ?? [];

  return (
    <CreatorLayout>
      <div data-testid="page-creator-billing">
        {showAdd && <AddBankModal onClose={() => setShowAdd(false)} />}

        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Billing & Bank Accounts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your payout accounts and gem balance</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}>
                <Gem className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">{me?.gems ?? billing?.gems ?? 0}</div>
                <div className="text-xs text-muted-foreground">Gem balance</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                <Landmark className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold">{accounts.length}</div>
                <div className="text-xs text-muted-foreground">Bank accounts</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
            <div className="text-sm font-bold">Payout Bank Accounts</div>
            <Button onClick={() => setShowAdd(true)} size="sm" className="rounded-xl gap-1.5 h-8 px-3 text-xs font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}>
              <Plus className="h-3.5 w-3.5" />Add Account
            </Button>
          </div>
          {loadingAccounts ? (
            <div className="p-5 space-y-2">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : !accounts.length ? (
            <div className="text-center py-14">
              <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                <Landmark className="h-6 w-6" style={{ color: "#1DCFB3" }} />
              </div>
              <p className="text-sm font-medium">No bank accounts yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add an account to receive payouts</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {accounts.map(a => (
                <div key={a.id} className="px-5 py-4 flex items-center gap-4" data-testid={`bank-account-${a.id}`}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }}>
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm flex items-center gap-2">
                      {a.bankName}
                      {a.isDefault && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(29,207,179,0.12)", color: "#0FA88E" }}>Default</span>}
                      {a.verified && (
                        <span className="inline-flex items-center gap-0.5 text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}>
                          <ShieldCheck className="h-3 w-3" />Verified
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{a.accountName} · {a.accountNumber}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!a.isDefault && (
                      <button onClick={() => handleSetDefault(a.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground" title="Set as default">
                        <Star className="h-4 w-4" />
                      </button>
                    )}
                    <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-500" title="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/60">
            <div className="text-sm font-bold">Transaction History</div>
          </div>
          {loadingBilling ? (
            <div className="p-5 space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-12 rounded-xl" />)}</div>
          ) : !transactions.length ? (
            <div className="text-center py-12">
              <p className="text-sm font-medium text-muted-foreground">No transactions yet</p>
              <p className="text-xs text-muted-foreground mt-1">Gem earnings and spending will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {transactions.map(txn => {
                const Icon = TXN_ICONS[txn.type] ?? Gem;
                const color = TXN_COLORS[txn.type] ?? "#6B7280";
                const sign = txn.type === "spend" ? "-" : "+";
                return (
                  <div key={txn.id} className="px-5 py-4 flex items-center gap-4" data-testid={`txn-row-${txn.id}`}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{txn.description ?? txn.type}</div>
                      <div className="text-xs text-muted-foreground">{new Date(txn.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="font-bold text-sm flex-shrink-0" style={{ color }}>
                      {sign}{txn.gemsDelta} <span className="font-normal text-muted-foreground">gems</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CreatorLayout>
  );
}
