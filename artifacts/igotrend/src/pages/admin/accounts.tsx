import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, ShieldBan, ShieldCheck, Trash2, Eye } from "lucide-react";

interface User {
  id: number; firstName: string; lastName: string; userName: string; email: string;
  phone: string | null; role: "brand" | "creator" | "admin"; badge: string | null;
  isActive: boolean; isLocked: boolean; gems: number; avatarUrl: string | null;
  companyName: string | null; createdAt: string;
}

interface AccountsResponse { data: User[]; total: number; page: number; limit: number; }

const ROLE_BADGE = {
  brand:   { bg: "rgba(29,207,179,0.12)", color: "#0FA88E" },
  creator: { bg: "rgba(107,47,206,0.12)", color: "#6B2FCE" },
  admin:   { bg: "rgba(255,140,66,0.12)", color: "#FF8C42" },
};

type Tab = "all" | "brands" | "creators" | "pending";

const TAB_ROLE: Record<Tab, string | undefined> = { all: undefined, brands: "brand", creators: "creator", pending: undefined };
const TAB_STATUS: Record<Tab, string | undefined> = { all: undefined, brands: undefined, creators: undefined, pending: "pending" };

export default function AdminAccountsPage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const activeTab: Tab = location.endsWith("/brands") ? "brands"
    : location.endsWith("/creators") ? "creators"
    : location.endsWith("/pending") ? "pending"
    : "all";

  const role = TAB_ROLE[activeTab];
  const status = TAB_STATUS[activeTab];

  const queryKey = ["/admin/accounts", role, status, search, page];
  const { data, isLoading, refetch } = useQuery<AccountsResponse>({
    queryKey,
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (role) params.set("role", role);
      if (status) params.set("status", status);
      if (search) params.set("search", search);
      return customFetch<AccountsResponse>(`/api/admin/accounts?${params}`);
    },
  });

  const handleAction = async (id: number, action: string) => {
    await customFetch(`/api/admin/accounts/${id}/status`, { method: "PATCH", body: JSON.stringify({ action }) });
    toast({ title: `User ${action}d` });
    refetch();
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user ${name}? This cannot be undone.`)) return;
    await customFetch(`/api/admin/accounts/${id}`, { method: "DELETE" });
    toast({ title: "User deleted" });
    refetch();
  };

  const TABS: { key: Tab; label: string; href: string }[] = [
    { key: "all", label: "All Accounts", href: "/admin/accounts" },
    { key: "brands", label: "Brands", href: "/admin/accounts/brands" },
    { key: "creators", label: "Creators", href: "/admin/accounts/creators" },
    { key: "pending", label: "Pending", href: "/admin/accounts/pending" },
  ];

  const users = data?.data ?? [];

  return (
    <AdminLayout>
      <div data-testid="page-admin-accounts">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Account Management</h1>
          <p className="text-sm text-muted-foreground mt-0.5">View, manage and moderate all user accounts</p>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex gap-2">
            {TABS.map(t => (
              <a
                key={t.key}
                href={t.href}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                style={activeTab === t.key ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
                data-testid={`tab-${t.key}`}
              >
                {t.label}
              </a>
            ))}
          </div>
          <div className="ml-auto relative w-56">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name or email…"
              className="pl-8 h-9 rounded-xl text-xs"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
              <Users className="h-4 w-4" />
            </div>
            <div className="text-sm font-bold">Accounts</div>
            {data && <span className="ml-auto text-xs text-muted-foreground">{data.total} total</span>}
          </div>

          {isLoading ? (
            <div className="p-5 space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
          ) : !users.length ? (
            <div className="text-center py-16">
              <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No accounts found</p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {users.map(u => {
                const roleStyle = ROLE_BADGE[u.role] ?? ROLE_BADGE.brand;
                const displayName = u.role === "brand" && u.companyName ? u.companyName : `${u.firstName} ${u.lastName}`;
                return (
                  <div key={u.id} className="px-5 py-4 flex items-center gap-4" data-testid={`account-row-${u.id}`}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white flex-shrink-0 text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #141C35, #2D3A6E)" }}>
                      {(u.firstName[0] ?? "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{displayName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: roleStyle.bg, color: roleStyle.color }}>{u.role}</span>
                        {u.isLocked && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#DC2626" }}>Locked</span>}
                        {!u.isActive && !u.isLocked && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(245,158,11,0.12)", color: "#D97706" }}>Inactive</span>}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{u.email} · Joined {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {u.isActive && !u.isLocked ? (
                        <Button size="sm" variant="outline" onClick={() => handleAction(u.id, "suspend")} className="h-8 px-2.5 rounded-xl text-xs gap-1 text-amber-600 border-amber-200 hover:bg-amber-50">
                          <ShieldBan className="h-3.5 w-3.5" />Suspend
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleAction(u.id, "activate")} className="h-8 px-2.5 rounded-xl text-xs gap-1 text-green-600 border-green-200 hover:bg-green-50">
                          <ShieldCheck className="h-3.5 w-3.5" />Activate
                        </Button>
                      )}
                      <button onClick={() => handleDelete(u.id, displayName)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {data && data.total > 20 && (
            <div className="px-5 py-4 border-t border-border/60 flex items-center justify-between">
              <Button size="sm" variant="outline" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl h-8 text-xs">Previous</Button>
              <span className="text-xs text-muted-foreground">Page {page} of {Math.ceil(data.total / 20)}</span>
              <Button size="sm" variant="outline" onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(data.total / 20)} className="rounded-xl h-8 text-xs">Next</Button>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
