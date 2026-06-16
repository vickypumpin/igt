import { useState } from "react";
import { useAdminListUsers, useAdminUpdateUserStatus, getAdminListUsersQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search, Users } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ROLES = ["", "brand", "creator"];
const STATUSES = ["", "active", "inactive", "locked"];
const AVATAR_GRADIENTS = ["linear-gradient(135deg, #1DCFB3, #0FA88E)", "linear-gradient(135deg, #8B5CF6, #6D28D9)", "linear-gradient(135deg, #3B82F6, #2563EB)", "linear-gradient(135deg, #F59E0B, #D97706)", "linear-gradient(135deg, #EF4444, #DC2626)"];

function FilterPill({ label, active, onClick, testid }: { label: string; active: boolean; onClick: () => void; testid?: string }) {
  return (
    <button onClick={onClick} data-testid={testid}
      className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
      style={active ? { background: "rgba(255,140,66,0.15)", color: "#E47128", border: "1px solid rgba(255,140,66,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
    >{label || "All"}</button>
  );
}

export default function AdminUsersPage() {
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const updateStatus = useAdminUpdateUserStatus();

  const params = { ...(role && { role: role as "brand" | "creator" }), ...(status && { status: status as "active" | "inactive" | "locked" }), ...(search && { search }), page: 1 };
  const { data, isLoading } = useAdminListUsers(params, { query: { queryKey: getAdminListUsersQueryKey(params) } });
  const users = data?.data ?? [];

  const handleAction = (userId: number, action: "activate" | "deactivate" | "lock" | "unlock") => {
    updateStatus.mutate({ id: userId, data: { action } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListUsersQueryKey() }); toast({ title: "User updated" }); },
      onError: () => { toast({ title: "Update failed", variant: "destructive" }); },
    });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-users">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Users</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total users</p>
        </div>

        <div className="flex gap-3 mb-5 flex-wrap items-center">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-10 rounded-xl" placeholder="Search email or name…" value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1">
            {ROLES.map(r => <FilterPill key={r} label={r} active={role === r} onClick={() => setRole(r === role ? "" : r)} testid={`filter-role-${r || "all"}`} />)}
          </div>
          <div className="flex gap-1">
            {STATUSES.map(s => <FilterPill key={s} label={s || "All status"} active={status === s} onClick={() => setStatus(s === status ? "" : s)} testid={`filter-status-${s || "all"}`} />)}
          </div>
        </div>

        {isLoading ? <div className="space-y-2">{Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div> :
          !users.length ? (
            <div className="text-center py-20">
              <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                <Users className="h-7 w-7" style={{ color: "#FF8C42" }} />
              </div>
              <p className="text-sm font-medium">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">User</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Role</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Joined</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors" data-testid={`user-row-${u.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs font-bold" style={{ background: AVATAR_GRADIENTS[idx % AVATAR_GRADIENTS.length], color: "white" }}>{u.firstName?.[0]}{u.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-sm">{u.firstName} {u.lastName}</div>
                            <div className="text-xs text-muted-foreground">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="capitalize text-xs font-semibold px-2 py-1 rounded-full"
                          style={u.role === "creator" ? { background: "rgba(139,92,246,0.12)", color: "#7C3AED" } : u.role === "brand" ? { background: "rgba(29,207,179,0.12)", color: "#0FA88E" } : { background: "rgba(255,140,66,0.12)", color: "#E47128" }}>{u.role}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={u.isLocked ? { background: "rgba(239,68,68,0.12)", color: "#DC2626" } : u.isActive ? { background: "rgba(16,185,129,0.12)", color: "#059669" } : { background: "rgba(107,114,128,0.12)", color: "#4B5563" }}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.isLocked ? "#EF4444" : u.isActive ? "#10B981" : "#6B7280" }} />
                          {u.isLocked ? "Locked" : u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" data-testid={`button-actions-${u.id}`}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!u.isActive && <DropdownMenuItem onClick={() => handleAction(u.id, "activate")} data-testid={`action-activate-${u.id}`}>Activate</DropdownMenuItem>}
                            {u.isActive && <DropdownMenuItem onClick={() => handleAction(u.id, "deactivate")} data-testid={`action-deactivate-${u.id}`}>Deactivate</DropdownMenuItem>}
                            {!u.isLocked && <DropdownMenuItem onClick={() => handleAction(u.id, "lock")} className="text-destructive" data-testid={`action-lock-${u.id}`}>Lock account</DropdownMenuItem>}
                            {u.isLocked && <DropdownMenuItem onClick={() => handleAction(u.id, "unlock")} data-testid={`action-unlock-${u.id}`}>Unlock account</DropdownMenuItem>}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </AdminLayout>
  );
}
