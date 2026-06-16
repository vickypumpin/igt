import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck } from "lucide-react";

type PermissionMatrix = Record<string, Record<string, boolean>>;

const ROLE_COLORS: Record<string, { gradient: string }> = {
  admin:   { gradient: "linear-gradient(135deg, #FF8C42, #E47128)" },
  brand:   { gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)" },
  creator: { gradient: "linear-gradient(135deg, #6B2FCE, #5B21B6)" },
};

export default function AdminRolesPage() {
  const { toast } = useToast();
  const [matrix, setMatrix] = useState<PermissionMatrix | null>(null);

  const { isLoading, data: rolesData } = useQuery<PermissionMatrix>({
    queryKey: ["/admin/roles"],
    queryFn: () => customFetch<PermissionMatrix>("/api/admin/roles"),
  });

  useEffect(() => { if (rolesData && !matrix) setMatrix(rolesData); }, [rolesData]);

  const saveMutation = useMutation({
    mutationFn: (data: PermissionMatrix) => customFetch("/api/admin/roles", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => toast({ title: "Permissions saved ✓" }),
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const toggle = (role: string, perm: string) => {
    setMatrix(m => {
      if (!m) return m;
      return { ...m, [role]: { ...m[role], [perm]: !m[role][perm] } };
    });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-roles" className="max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Roles & Permissions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage what each role can do on the platform</p>
          </div>
          {matrix && (
            <Button
              onClick={() => saveMutation.mutate(matrix)}
              disabled={saveMutation.isPending}
              className="rounded-xl font-semibold px-6"
              style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
              data-testid="btn-save-roles"
            >
              {saveMutation.isPending ? "Saving…" : "Save Permissions"}
            </Button>
          )}
        </div>

        {isLoading || !matrix ? (
          <div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>
        ) : (
          <div className="space-y-5">
            {Object.entries(matrix).map(([role, perms]) => {
              const roleStyle = ROLE_COLORS[role] ?? ROLE_COLORS.admin;
              return (
                <div key={role} className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: roleStyle.gradient }}>
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-sm font-bold capitalize">{role}</div>
                  </div>
                  <div className="p-5 grid grid-cols-2 gap-3">
                    {Object.entries(perms).map(([perm, enabled]) => {
                      const label = perm.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase());
                      return (
                        <label key={perm} className="flex items-center gap-3 cursor-pointer group" data-testid={`perm-${role}-${perm}`}>
                          <div
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0"
                            style={enabled ? { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", borderColor: "#1DCFB3" } : { borderColor: "#D1D5DB" }}
                            onClick={() => toggle(role, perm)}
                          >
                            {enabled && <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                          </div>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
