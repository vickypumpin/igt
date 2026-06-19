import { useState } from "react";
import { useAdminListSubmissions, useReviewSubmission, getAdminListSubmissionsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ExternalLink, FileCheck } from "lucide-react";

const STATUS_CFG: Record<string, { bg: string; text: string; dot: string }> = {
  approved: { bg: "rgba(16,185,129,0.12)", text: "#059669", dot: "#10B981" },
  pending:  { bg: "rgba(245,158,11,0.12)", text: "#D97706", dot: "#F59E0B" },
  rejected: { bg: "rgba(239,68,68,0.12)",  text: "#DC2626", dot: "#EF4444" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? { bg: "#f4f4f5", text: "#71717a", dot: "#a1a1aa" };
  return <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: c.bg, color: c.text }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />{status}</span>;
}

const FILTERS = ["all", "pending", "approved", "rejected"];

export default function AdminSubmissionsPage() {
  const [filter, setFilter] = useState("pending");
  const { toast } = useToast();
  const reviewMutation = useReviewSubmission();
  const params = filter !== "all" ? { status: filter as "pending" | "approved" | "rejected" } : {};
  const { data = [], isLoading } = useAdminListSubmissions(params, { query: { queryKey: getAdminListSubmissionsQueryKey(params) } });

  const handleReview = (id: number, status: "approved" | "rejected") => {
    reviewMutation.mutate({ id, data: { status } }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListSubmissionsQueryKey() }); toast({ title: `Submission ${status}` }); } });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-submissions">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Submissions</h1>
          <p className="text-sm text-muted-foreground">{data.length} submissions</p>
        </div>

        <div className="flex gap-1 mb-5">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs rounded-xl font-semibold capitalize transition-all"
              style={filter === f ? { background: "rgba(255,140,66,0.15)", color: "#E47128", border: "1px solid rgba(255,140,66,0.3)" } : { color: "#6b7280", border: "1px solid transparent" }}
              data-testid={`filter-${f}`}>{f}</button>
          ))}
        </div>

        {isLoading ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}</div> : (
          <div className="space-y-3">
            {data.map(s => (
              <div key={s.id} className="bg-white rounded-2xl border border-border/60 p-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow" data-testid={`submission-${s.id}`}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
                  {s.platform?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className="text-sm font-bold">Creator #{s.creatorId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize" style={{ background: "rgba(29,207,179,0.1)", color: "#0FA88E" }}>{s.platform}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <a href={s.screenshotUrl ?? undefined} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 hover:underline truncate" style={{ color: "#1DCFB3" }}>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />{(s.screenshotUrl ?? "").slice(0, 60)}{(s.screenshotUrl ?? "").length > 60 ? "…" : ""}
                  </a>
                  {(s.views || s.likes) && <div className="text-xs text-muted-foreground mt-1 font-medium">{s.views?.toLocaleString()} views · {s.likes?.toLocaleString()} likes</div>}
                </div>
                <div className="flex flex-col gap-2 items-end flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</span>
                  {s.status === "pending" && (
                    <div className="flex gap-1.5">
                      <Button size="sm" className="h-8 text-xs rounded-xl font-semibold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }} onClick={() => handleReview(s.id, "approved")} data-testid={`button-approve-${s.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs rounded-xl text-destructive font-semibold" onClick={() => handleReview(s.id, "rejected")} data-testid={`button-reject-${s.id}`}><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!data.length && (
              <div className="text-center py-16 rounded-2xl border border-border/60">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                  <FileCheck className="h-7 w-7" style={{ color: "#FF8C42" }} />
                </div>
                <p className="text-sm font-medium">No submissions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
