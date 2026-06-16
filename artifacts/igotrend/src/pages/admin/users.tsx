import { useState } from "react";
import { useAdminListUsers, useAdminUpdateUserStatus, getAdminListUsersQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const ROLES = ["", "brand", "creator"];
const STATUSES = ["", "active", "inactive", "locked"];

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
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Users</h1>
          <p className="text-sm text-muted-foreground">{data?.total ?? 0} total users</p>
        </div>

        <div className="flex gap-3 mb-4">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 h-9" placeholder="Search email..." value={search} onChange={e => setSearch(e.target.value)} data-testid="input-search" />
          </div>
          <div className="flex gap-1">
            {ROLES.map(r => <button key={r} onClick={() => setRole(r === role ? "" : r)} className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-colors ${role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`} data-testid={`filter-role-${r || "all"}`}>{r || "All"}</button>)}
          </div>
          <div className="flex gap-1">
            {STATUSES.map(s => <button key={s} onClick={() => setStatus(s === status ? "" : s)} className={`px-2.5 py-1 text-xs rounded-md font-medium capitalize transition-colors ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`} data-testid={`filter-status-${s || "all"}`}>{s || "All status"}</button>)}
          </div>
        </div>

        {isLoading ? <div className="space-y-2">{Array(10).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50"><tr>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">User</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Role</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {users.map(u => (
                  <tr key={u.id} data-testid={`user-row-${u.id}`}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 capitalize text-muted-foreground">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.isLocked ? "bg-red-100 text-red-700" : u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{u.isLocked ? "Locked" : u.isActive ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7" data-testid={`button-actions-${u.id}`}><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!u.isActive && <DropdownMenuItem onClick={() => handleAction(u.id, "activate")} data-testid={`action-activate-${u.id}`}>Activate</DropdownMenuItem>}
                          {u.isActive && <DropdownMenuItem onClick={() => handleAction(u.id, "deactivate")} data-testid={`action-deactivate-${u.id}`}>Deactivate</DropdownMenuItem>}
                          {!u.isLocked && <DropdownMenuItem onClick={() => handleAction(u.id, "lock")} className="text-destructive" data-testid={`action-lock-${u.id}`}>Lock</DropdownMenuItem>}
                          {u.isLocked && <DropdownMenuItem onClick={() => handleAction(u.id, "unlock")} data-testid={`action-unlock-${u.id}`}>Unlock</DropdownMenuItem>}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
