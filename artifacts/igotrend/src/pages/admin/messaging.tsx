import { useState } from "react";
import { useAdminBroadcast } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Users, Megaphone } from "lucide-react";

const TARGET_OPTIONS = [
  { value: "all", label: "All users" },
  { value: "brand", label: "Brands only" },
  { value: "creator", label: "Creators only" },
];

export default function AdminMessagingPage() {
  const { toast } = useToast();
  const broadcastMutation = useAdminBroadcast();
  const [message, setMessage] = useState("");
  const [targetRole, setTargetRole] = useState("all");
  const [link, setLink] = useState("");
  const [lastResult, setLastResult] = useState<{ sent: number } | null>(null);

  const handleSend = () => {
    if (!message.trim()) {
      toast({ title: "Message is required", variant: "destructive" }); return;
    }
    broadcastMutation.mutate(
      { message, targetRole: targetRole === "all" ? undefined : targetRole, link: link || undefined },
      {
        onSuccess: (result) => {
          setLastResult(result);
          toast({ title: `Broadcast sent to ${result.sent} users ✓` });
          setMessage("");
          setLink("");
        },
        onError: () => toast({ title: "Broadcast failed", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-messaging" className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Broadcast Message</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Send in-platform notifications to your users</p>
        </div>

        {lastResult && (
          <div className="mb-5 p-4 rounded-2xl border flex items-center gap-3" style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }}>
            <Megaphone className="h-5 w-5 flex-shrink-0" style={{ color: "#059669" }} />
            <p className="text-sm font-medium" style={{ color: "#059669" }}>Last broadcast sent to {lastResult.sent} users.</p>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
              <Megaphone className="h-4 w-4" />
            </div>
            <div className="text-sm font-bold">New Broadcast</div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Target audience</label>
              <div className="flex gap-2">
                {TARGET_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTargetRole(opt.value)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                    style={targetRole === opt.value ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
                    data-testid={`target-${opt.value}`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                placeholder="Write your broadcast message here…"
                className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                data-testid="input-broadcast-message"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">{message.length} chars</div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Link (optional)</label>
              <Input
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="e.g. /campaigns or https://…"
                className="h-10 rounded-xl"
                data-testid="input-broadcast-link"
              />
            </div>
          </div>

          <div className="px-5 pb-5">
            <Button
              onClick={handleSend}
              disabled={broadcastMutation.isPending || !message.trim()}
              className="w-full h-11 rounded-xl font-bold gap-2"
              style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)", border: "none" }}
              data-testid="btn-send-broadcast"
            >
              <Send className="h-4 w-4" />
              {broadcastMutation.isPending ? "Sending…" : "Send Broadcast"}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
