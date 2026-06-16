import { useState } from "react";
import { Link } from "wouter";
import { useListMyInvites, useAcceptInvite, useDeclineInvite, getListMyInvitesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import CreatorLayout from "@/components/layout/creator-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Inbox, Calendar, Users } from "lucide-react";

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", completed: "bg-blue-100 text-blue-700", declined: "bg-red-100 text-red-700" };
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[status] ?? "bg-muted text-muted-foreground"}`}>{status}</span>;
}

const FILTERS = ["all", "pending", "active", "completed", "declined"];

export default function InvitesPage() {
  const [filter, setFilter] = useState("all");
  const { toast } = useToast();
  const params = filter !== "all" ? { status: filter as "pending" | "active" | "completed" | "declined" } : {};
  const { data = [], isLoading } = useListMyInvites(params, { query: { queryKey: getListMyInvitesQueryKey(params) } });
  const acceptMutation = useAcceptInvite();
  const declineMutation = useDeclineInvite();

  const handleAccept = (id: number) => {
    acceptMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invitation accepted!" }); } });
  };
  const handleDecline = (id: number) => {
    declineMutation.mutate({ id }, { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getListMyInvitesQueryKey() }); toast({ title: "Invitation declined" }); } });
  };

  return (
    <CreatorLayout>
      <div data-testid="page-invites">
        <div className="mb-5">
          <h1 className="text-xl font-semibold">Campaign Invitations</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data.length} invitations</p>
        </div>
        <div className="flex gap-1 mb-4">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs rounded-md font-medium capitalize transition-colors ${filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`} data-testid={`filter-${f}`}>{f}</button>
          ))}
        </div>

        {isLoading ? <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div> :
          !data.length ? (
            <div className="text-center py-16">
              <Inbox className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">No invitations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.map(inv => (
                <div key={inv.id} className="border border-border rounded-lg p-4" data-testid={`invite-card-${inv.id}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{inv.campaign?.name}</span>
                        <StatusBadge status={inv.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">{inv.campaign?.sponsor}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{inv.campaign?.startDate} — {inv.campaign?.endDate}</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{inv.campaign?.noOfCreators} creators</span>
                        <span className="capitalize">{inv.campaign?.type?.replace("_", " ")}</span>
                      </div>
                    </div>
                    {inv.status === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline" onClick={() => handleDecline(inv.id)} disabled={declineMutation.isPending} className="h-8 text-xs" data-testid={`button-decline-${inv.id}`}>
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Decline
                        </Button>
                        <Button size="sm" onClick={() => handleAccept(inv.id)} disabled={acceptMutation.isPending} className="h-8 text-xs" data-testid={`button-accept-${inv.id}`}>
                          <CheckCircle className="h-3.5 w-3.5 mr-1" /> Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </CreatorLayout>
  );
}
