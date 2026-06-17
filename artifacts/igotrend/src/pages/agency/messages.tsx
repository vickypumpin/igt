import { useState, useEffect, useRef } from "react";
import { useListConversations, useGetMessages, useSendMessage, getListConversationsQueryKey, getGetMessagesQueryKey, useGetMe } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import AgencyLayout from "@/components/layout/agency-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, MessageSquare } from "lucide-react";

const PURPLE = "#6B2FCE";
const POLL_INTERVAL = 4000;

export default function AgencyMessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { data: me } = useGetMe();
  const { data: conversations = [], isLoading } = useListConversations({ query: { queryKey: getListConversationsQueryKey() } });
  const { data: messages = [] } = useGetMessages(selectedUserId ?? 0, { query: { enabled: !!selectedUserId, queryKey: getGetMessagesQueryKey(selectedUserId ?? 0) } });
  const sendMutation = useSendMessage();

  useEffect(() => {
    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      if (selectedUserId) queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(selectedUserId) });
    }, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [selectedUserId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedUserId) return;
    const text = messageText;
    setMessageText("");
    sendMutation.mutate(
      { userId: selectedUserId, data: { body: text } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(selectedUserId) });
          queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
        },
        onError: () => setMessageText(text),
      }
    );
  };

  const selected = conversations.find((c: any) => c.userId === selectedUserId);

  return (
    <AgencyLayout>
      <div className="h-[calc(100vh-116px)] flex bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="w-72 flex flex-col border-r border-gray-100 flex-shrink-0">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">Messages</h2>
            <p className="text-xs text-gray-400 mt-0.5">{conversations.length} conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {isLoading
              ? [...Array(4)].map((_, i) => (
                  <div key={i} className="p-3 flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-2.5 w-36" />
                    </div>
                  </div>
                ))
              : conversations.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center px-4">
                    <MessageSquare className="h-6 w-6 text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400">No conversations yet</p>
                  </div>
                )
              : (conversations as any[]).map((c) => {
                  const other = c.user;
                  const initials = `${other?.firstName?.[0] ?? "?"}${other?.lastName?.[0] ?? ""}`;
                  const isSelected = selectedUserId === c.userId;
                  return (
                    <button
                      key={c.userId}
                      onClick={() => setSelectedUserId(c.userId)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                      style={isSelected ? { background: "rgba(107,47,206,0.07)", borderLeft: `3px solid ${PURPLE}` } : {}}
                    >
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarFallback className="text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-900 truncate">{other?.firstName} {other?.lastName}</div>
                        <div className="text-xs text-gray-400 truncate">{c.lastMessage ?? "No messages yet"}</div>
                      </div>
                      {c.unreadCount > 0 && (
                        <span className="h-5 w-5 rounded-full text-white text-xs flex items-center justify-center font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}>{c.unreadCount}</span>
                      )}
                    </button>
                  );
                })}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedUserId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageSquare className="h-12 w-12 mb-4" style={{ color: "rgba(107,47,206,0.2)" }} />
              <p className="text-sm font-semibold text-gray-500">Select a conversation</p>
              <p className="text-xs text-gray-400 mt-1">Choose a contact from the list to start messaging</p>
            </div>
          ) : (
            <>
              <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-bold text-white" style={{ background: `linear-gradient(135deg, ${PURPLE}, #8B5CF6)` }}>
                    {(selected as any)?.user?.firstName?.[0]}{(selected as any)?.user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-bold text-gray-900">{(selected as any)?.user?.firstName} {(selected as any)?.user?.lastName}</div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {(messages as any[]).map((msg) => {
                  const isMine = msg.fromUserId === me?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-xs px-4 py-2.5 rounded-2xl text-sm"
                        style={isMine
                          ? { background: PURPLE, color: "white", borderBottomRightRadius: 4 }
                          : { background: "#F3F4F6", color: "#111827", borderBottomLeftRadius: 4 }}
                      >
                        {msg.body}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <Input
                  placeholder="Type a message…"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sendMutation.isPending}
                  size="icon"
                  style={{ background: PURPLE }}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </AgencyLayout>
  );
}
