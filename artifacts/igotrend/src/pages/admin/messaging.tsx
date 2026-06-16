import { useState } from "react";
import { useAdminBroadcast, useAdminMessages } from "@workspace/api-client-react";
import AdminLayout from "@/components/layout/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Megaphone, Send, Users, Shield } from "lucide-react";

const TARGET_OPTIONS = [
  { value: "all",     label: "All users" },
  { value: "brand",   label: "Brands only" },
  { value: "creator", label: "Creators only" },
];

const ROLE_STYLES: Record<string, { bg: string; color: string }> = {
  admin:   { bg: "rgba(255,140,66,0.12)", color: "#FF8C42" },
  brand:   { bg: "rgba(29,207,179,0.12)", color: "#0FA88E" },
  creator: { bg: "rgba(107,47,206,0.12)", color: "#6B2FCE" },
  unknown: { bg: "rgba(107,114,128,0.12)", color: "#6B7280" },
};

type Tab = "monitor" | "broadcast";

export default function AdminMessagingPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("monitor");
  const { data: messages = [], isLoading: loadingMessages } = useAdminMessages();
  const broadcastMutation = useAdminBroadcast();
  const [broadcastForm, setBroadcastForm] = useState({ message: "", targetRole: "all", link: "" });
  const [lastResult, setLastResult] = useState<{ sent: number } | null>(null);

  const handleSend = () => {
    if (!broadcastForm.message.trim()) { toast({ title: "Message is required", variant: "destructive" }); return; }
    broadcastMutation.mutate(
      { message: broadcastForm.message, targetRole: broadcastForm.targetRole === "all" ? undefined : broadcastForm.targetRole, link: broadcastForm.link || undefined },
      {
        onSuccess: (result) => {
          setLastResult(result);
          toast({ title: `Broadcast sent to ${result.sent} users ✓` });
          setBroadcastForm(f => ({ ...f, message: "", link: "" }));
        },
        onError: () => toast({ title: "Broadcast failed", variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div data-testid="page-admin-messaging">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold">Messaging</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Monitor platform messages and send broadcasts</p>
        </div>

        <div className="flex gap-2 mb-6">
          {([
            { key: "monitor" as Tab, label: "Message Monitor", Icon: MessageCircle },
            { key: "broadcast" as Tab, label: "Broadcast", Icon: Megaphone },
          ]).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all"
              style={tab === key ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
            >
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {tab === "monitor" && (
          <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="text-sm font-bold">Platform Messages</div>
              <div className="ml-auto text-xs text-muted-foreground">{messages.length} recent</div>
            </div>
            {loadingMessages ? (
              <div className="p-5 space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
            ) : !messages.length ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "rgba(255,140,66,0.1)" }}>
                  <MessageCircle className="h-6 w-6" style={{ color: "#FF8C42" }} />
                </div>
                <p className="text-sm font-medium">No messages yet</p>
                <p className="text-xs text-muted-foreground mt-1">Platform messages between users will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {messages.map(msg => {
                  const roleStyle = ROLE_STYLES[msg.fromRole] ?? ROLE_STYLES.unknown;
                  return (
                    <div key={msg.id} className="px-5 py-4 flex items-start gap-4" data-testid={`msg-row-${msg.id}`}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: roleStyle.bg }}>
                        <Shield className="h-4 w-4" style={{ color: roleStyle.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold">{msg.fromName}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize" style={{ background: roleStyle.bg, color: roleStyle.color }}>{msg.fromRole}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{new Date(msg.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{msg.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === "broadcast" && (
          <div className="max-w-2xl">
            {lastResult && (
              <div className="mb-5 p-4 rounded-2xl border flex items-center gap-3" style={{ background: "rgba(16,185,129,0.08)", borderColor: "rgba(16,185,129,0.3)" }}>
                <Megaphone className="h-5 w-5 flex-shrink-0" style={{ color: "#059669" }} />
                <p className="text-sm font-medium" style={{ color: "#059669" }}>Last broadcast sent to {lastResult.sent} users.</p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-border/60 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white" style={{ background: "linear-gradient(135deg, #FF8C42, #E47128)" }}>
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
                        onClick={() => setBroadcastForm(f => ({ ...f, targetRole: opt.value }))}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                        style={broadcastForm.targetRole === opt.value ? { background: "linear-gradient(135deg, #FF8C42, #E47128)", color: "#fff", border: "none" } : { background: "white", borderColor: "rgba(0,0,0,0.12)" }}
                        data-testid={`target-${opt.value}`}
                      >
                        <Users className="h-3.5 w-3.5" />{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Message</label>
                  <textarea
                    value={broadcastForm.message}
                    onChange={e => setBroadcastForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    placeholder="Write your broadcast message here…"
                    className="w-full rounded-xl border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                    data-testid="input-broadcast-message"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">{broadcastForm.message.length} chars</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Link (optional)</label>
                  <Input
                    value={broadcastForm.link}
                    onChange={e => setBroadcastForm(f => ({ ...f, link: e.target.value }))}
                    placeholder="e.g. /campaigns or https://…"
                    className="h-10 rounded-xl"
                    data-testid="input-broadcast-link"
                  />
                </div>
              </div>
              <div className="px-5 pb-5">
                <Button
                  onClick={handleSend}
                  disabled={broadcastMutation.isPending || !broadcastForm.message.trim()}
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
        )}
      </div>
    </AdminLayout>
  );
}
