import { useState } from "react";
import { useAdminListSubmissions, useReviewSubmission, getAdminListSubmissionsQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { approved: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", rejected: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

export default function AdminSubmissionsPage() {
  const [filter, setFilter] = useState("pending");
  const { toast } = useToast();
  const reviewMutation = useReviewSubmission();
  const params = filter !== "all" ? { status: filter as "pending" | "approved" | "rejected" } : {};
  const { data = [], isLoading } = useAdminListSubmissions(params, { query: { queryKey: getAdminListSubmissionsQueryKey(params) } });

  const handleReview = (id: number, status: "approved" | "rejected") => {
    reviewMutation.mutate({ id, data: { status } }, {
      onSuccess: () => { queryClient.invalidateQueries({ queryKey: getAdminListSubmissionsQueryKey() }); toast({ title: `Submission ${status}` }); },
    });
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-submissions">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Submissions</h1>
          <p className="text-sm text-muted-foreground">{data.length} submissions</p>
        </div>
        <div className="flex gap-1 mb-4">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`} data-testid={`filter-${f}`}>{f}</button>
          ))}
        </div>

        {isLoading ? <div className="space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14" />)}</div> : (
          <div className="space-y-2">
            {data.map(s => (
              <div key={s.id} className="border border-border rounded-lg p-4 flex items-start gap-3" data-testid={`submission-${s.id}`}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Creator #{s.creatorId}</span>
                    <span className="text-xs text-muted-foreground capitalize">{s.platform}</span>
                    <StatusBadge status={s.status} />
                  </div>
                  <a href={s.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />{s.screenshotUrl.slice(0, 60)}...
                  </a>
                  {(s.views || s.likes) && <div className="text-xs text-muted-foreground mt-1">{s.views?.toLocaleString()} views · {s.likes?.toLocaleString()} likes</div>}
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString()}</span>
                  {s.status === "pending" && (
                    <div className="flex gap-1.5">
                      <Button size="sm" className="h-7 text-xs" onClick={() => handleReview(s.id, "approved")} data-testid={`button-approve-${s.id}`}><CheckCircle className="h-3 w-3 mr-1" />Approve</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs text-destructive" onClick={() => handleReview(s.id, "rejected")} data-testid={`button-reject-${s.id}`}><XCircle className="h-3 w-3 mr-1" />Reject</Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {!data.length && <div className="text-center py-12 text-muted-foreground text-sm">No submissions</div>}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
