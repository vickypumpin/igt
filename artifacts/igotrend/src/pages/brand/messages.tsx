import { useState, useEffect, useRef } from "react";
import { useListConversations, useGetMessages, useSendMessage, getListConversationsQueryKey, getGetMessagesQueryKey, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageSquare } from "lucide-react";
import { usePageVisible } from "@/hooks/use-page-visible";

const POLL_INTERVAL = 4000;

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetMe();
  const isVisible = usePageVisible();
  const { data: conversations = [], isLoading } = useListConversations({ query: { queryKey: getListConversationsQueryKey() } });
  const { data: messages = [] } = useGetMessages(selectedUserId ?? 0, { query: { enabled: !!selectedUserId, queryKey: getGetMessagesQueryKey(selectedUserId ?? 0) } });
  const sendMutation = useSendMessage();

  useEffect(() => {
    if (!isVisible) return;
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      if (selectedUserId) queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(selectedUserId) });
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [selectedUserId, isVisible]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedUserId) return;
    const text = messageText;
    setMessageText("");
    sendMutation.mutate({ userId: selectedUserId, data: { body: text } }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(selectedUserId) });
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      },
      onError: () => setMessageText(text),
    });
  };

  const selected = conversations.find(c => c.userId === selectedUserId);

  return (
    <BrandLayout>
      <div className="flex gap-0 h-[calc(100vh-8rem)] bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm" data-testid="page-messages">
        {/* Sidebar */}
        <div className="w-72 border-r border-border/60 flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-border/60">
            <div className="text-sm font-bold text-foreground">Messages</div>
            <div className="text-xs text-muted-foreground mt-0.5">{conversations.length} conversations</div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-3 space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}</div>
            ) : !conversations.length ? (
              <div className="p-6 text-xs text-muted-foreground text-center mt-8">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-20" />
                No conversations yet
              </div>
            ) : (
              conversations.map((conv, idx) => {
                const gradients = ["linear-gradient(135deg, #1DCFB3, #0FA88E)", "linear-gradient(135deg, #8B5CF6, #6D28D9)", "linear-gradient(135deg, #3B82F6, #2563EB)", "linear-gradient(135deg, #F59E0B, #D97706)"];
                return (
                  <button key={conv.userId} onClick={() => setSelectedUserId(conv.userId)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${selectedUserId === conv.userId ? "bg-primary/8" : "hover:bg-muted/50"}`}
                    style={selectedUserId === conv.userId ? { borderRight: "3px solid #1DCFB3", background: "rgba(29,207,179,0.06)" } : {}}
                    data-testid={`conversation-${conv.userId}`}>
                    <Avatar className="h-9 w-9 flex-shrink-0">
                      <AvatarFallback className="text-xs font-bold" style={{ background: gradients[idx % gradients.length], color: "white" }}>{conv.user?.firstName?.[0]}{conv.user?.lastName?.[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold truncate">{conv.user?.firstName} {conv.user?.lastName}</div>
                      <div className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>{conv.unreadCount}</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {!selectedUserId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
                <MessageSquare className="h-8 w-8" style={{ color: "#1DCFB3" }} />
              </div>
              <div className="text-sm font-medium">Select a conversation</div>
              <div className="text-xs text-muted-foreground mt-1">to start messaging</div>
            </div>
          ) : (
            <>
              <div className="h-14 border-b border-border/60 flex items-center px-4 gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-bold" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{selected?.user?.firstName?.[0]}{selected?.user?.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold">{selected?.user?.firstName} {selected?.user?.lastName}</div>
                  <div className="text-xs text-muted-foreground">Creator</div>
                </div>
                <div className="ml-auto flex items-center gap-1.5" data-testid="live-indicator">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: isVisible ? "#1DCFB3" : "#9CA3AF" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: isVisible ? "#1DCFB3" : "#9CA3AF" }} />
                  </span>
                  <span className="text-xs font-semibold" style={{ color: isVisible ? "#0FA88E" : "#9CA3AF" }}>
                    {isVisible ? "Live" : "Paused"}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {messages.map(msg => {
                  const isMe = msg.fromUserId === me?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`} data-testid={`message-${msg.id}`}>
                      <div className={`max-w-xs lg:max-w-sm px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? "rounded-br-sm text-white" : "bg-muted text-foreground rounded-bl-sm"}`}
                        style={isMe ? { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" } : {}}>
                        {msg.body}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border/60 flex gap-2">
                <Input
                  value={messageText}
                  onChange={e => setMessageText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Type a message…"
                  className="h-10 rounded-xl flex-1"
                  data-testid="input-message"
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-xl flex-shrink-0"
                  style={{ background: messageText.trim() ? "linear-gradient(135deg, #1DCFB3, #0FA88E)" : undefined, border: "none" }}
                  onClick={handleSend}
                  disabled={!messageText.trim() || sendMutation.isPending}
                  data-testid="button-send"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </BrandLayout>
  );
}
