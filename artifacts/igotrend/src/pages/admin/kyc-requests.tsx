import { useState } from "react";
import { useAdminKycRequests, useAdminApproveKycRequest, useAdminRejectKycRequest, getAdminKycRequestsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ShieldCheck, Eye } from "lucide-react";

type StatusFilter = "all" | "pending" | "approved" | "rejected";

const STATUS_CFG: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  pending:  { bg: "rgba(245,158,11,0.12)", color: "#D97706", dot: "#F59E0B", label: "Pending" },
  approved: { bg: "rgba(16,185,129,0.12)", color: "#059669", dot: "#10B981", label: "Approved" },
  rejected: { bg: "rgba(239,68,68,0.12)",  color: "#DC2626", dot: "#EF4444", label: "Rejected" },
};

const ID_LABELS: Record<string, string> = {
  national_id: "National ID",
  passport: "Passport",
  drivers_licence: "Driver's Licence",
};

function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", color: "#71717a", dot: "#a1a1aa", label: status };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

export default function AdminKycRequestsPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data = [], isLoading } = useAdminKycRequests({ query: { queryKey: getAdminKycRequestsQueryKey() } });
  const approveMutation = useAdminApproveKycRequest();
  const rejectMutation = useAdminRejectKycRequest();

  const filtered = filter === "all" ? data : data.filter(r => r.status === filter);

  const handleApprove = (id: number) => {
    approveMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminKycRequestsQueryKey() }); toast({ title: "Verification approved ✓" }); },
      onError: () => toast({ title: "Failed to approve", variant: "destructive" }),
    });
  };
  const handleReject = (id: number) => {
    rejectMutation.mutate({ id }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminKycRequestsQueryKey() }); toast({ title: "Verification rejected" }); },
      onError: () => toast({ title: "Failed to reject", variant: "destructive" }),
    });
  };

  const pendingCount = data.filter(r => r.status === "pending").length;

  return (
    <AdminLayout>
      <div data-testid="page-admin-kyc">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">KYC Verification Requests</h1>
          <p className="text-sm text-muted-foreground">{pendingCount} pending review</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as StatusFilter[]).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
              style={filter === f
                ? { background: "rgba(29,207,179,0.15)", color: "#0FA88E", border: "1px solid rgba(29,207,179,0.3)" }
                : { color: "#6b7280", border: "1px solid transparent" }}
              data-testid={`filter-${f}`}
            >{f} ({f === "all" ? data.length : data.filter(r => r.status === f).length})</button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>
        ) : !filtered.length ? (
          <div className="text-center py-16 rounded-2xl border border-border/60">
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
              <ShieldCheck className="h-7 w-7" style={{ color: "#FF8C42" }} />
            </div>
            <p className="text-sm font-medium">No {filter === "all" ? "" : filter} verification requests</p>
            <p className="text-xs text-muted-foreground mt-1">All caught up!</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ background: "#fafbfd", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Creator</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Legal Name</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Country</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">ID Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">ID Number</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Document</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Submitted</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filtered.map(r => (
                    <tr key={r.id} className="hover:bg-muted/30 transition-colors" data-testid={`kyc-row-${r.id}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                            {(r.creator.firstName[0] ?? "C").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-xs">{r.creator.firstName} {r.creator.lastName}</div>
                            <div className="text-xs text-muted-foreground">@{r.creator.userName}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-xs">{r.legalName}</td>
                      <td className="px-5 py-3.5 text-xs">{r.country}</td>
                      <td className="px-5 py-3.5 text-xs">{ID_LABELS[r.idType] ?? r.idType}</td>
                      <td className="px-5 py-3.5 font-mono text-xs">{r.idNumber}</td>
                      <td className="px-5 py-3.5">
                        {r.documentUrl ? (
                          <button
                            onClick={() => setPreviewUrl(r.documentUrl)}
                            className="flex items-center gap-1 text-xs text-teal-600 hover:underline font-semibold"
                            data-testid={`btn-preview-doc-${r.id}`}
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-3.5">
                        {r.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 text-xs rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} onClick={() => handleApprove(r.id)} disabled={approveMutation.isPending} data-testid={`btn-approve-${r.id}`}>
                              <CheckCircle className="h-3 w-3 mr-1" />Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl text-destructive font-semibold" onClick={() => handleReject(r.id)} disabled={rejectMutation.isPending} data-testid={`btn-reject-${r.id}`}>
                              <XCircle className="h-3 w-3 mr-1" />Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Document preview modal */}
        {previewUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setPreviewUrl(null)}>
            <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full mx-4 p-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-sm">ID Document Preview</span>
                <button onClick={() => setPreviewUrl(null)} className="text-muted-foreground hover:text-foreground text-xs">✕ Close</button>
              </div>
              {previewUrl.startsWith("data:image") ? (
                <img src={previewUrl} alt="ID Document" className="w-full rounded-xl max-h-96 object-contain" />
              ) : previewUrl.startsWith("data:application/pdf") ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  <p>PDF document uploaded</p>
                  <a href={previewUrl} download="id-document.pdf" className="text-teal-600 hover:underline text-xs mt-2 inline-block">Download PDF</a>
                </div>
              ) : (
                <img src={previewUrl} alt="ID Document" className="w-full rounded-xl max-h-96 object-contain" />
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
