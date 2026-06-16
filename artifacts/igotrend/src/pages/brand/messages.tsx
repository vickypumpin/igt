import { useState } from "react";
import { useListConversations, useGetMessages, useSendMessage, getListConversationsQueryKey, getGetMessagesQueryKey } from "@workspace/api-client-react";
import { queryClient } from "@/lib/query-client";
import BrandLayout from "@/components/layout/brand-layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Send } from "lucide-react";
import { useGetMe } from "@workspace/api-client-react";

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const { data: me } = useGetMe();
  const { data: conversations = [], isLoading } = useListConversations({ query: { queryKey: getListConversationsQueryKey() } });
  const { data: messages = [] } = useGetMessages(selectedUserId ?? 0, { query: { enabled: !!selectedUserId, queryKey: getGetMessagesQueryKey(selectedUserId ?? 0) } });
  const sendMutation = useSendMessage();

  const handleSend = () => {
    if (!messageText.trim() || !selectedUserId) return;
    sendMutation.mutate({ userId: selectedUserId, data: { body: messageText } }, {
      onSuccess: () => {
        setMessageText("");
        queryClient.invalidateQueries({ queryKey: getGetMessagesQueryKey(selectedUserId) });
        queryClient.invalidateQueries({ queryKey: getListConversationsQueryKey() });
      },
    });
  };

  const selected = conversations.find(c => c.userId === selectedUserId);

  return (
    <BrandLayout>
      <div className="flex h-[calc(100vh-8rem)] border border-border rounded-lg overflow-hidden" data-testid="page-messages">
        <div className="w-64 border-r border-border bg-muted/20 flex flex-col">
          <div className="p-3 border-b border-border font-medium text-sm">Messages</div>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? <div className="p-3 space-y-2">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-12" />)}</div> :
              !conversations.length ? <div className="p-4 text-xs text-muted-foreground text-center">No conversations yet</div> :
              conversations.map(conv => (
                <button key={conv.userId} onClick={() => setSelectedUserId(conv.userId)} className={`w-full flex items-center gap-2.5 p-3 text-left hover:bg-muted transition-colors ${selectedUserId === conv.userId ? "bg-muted" : ""}`} data-testid={`conversation-${conv.userId}`}>
                  <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="text-xs">{conv.user?.firstName?.[0]}{conv.user?.lastName?.[0]}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{conv.user?.firstName} {conv.user?.lastName}</div>
                    <div className="text-xs text-muted-foreground truncate">{conv.lastMessage}</div>
                  </div>
                  {conv.unreadCount > 0 && <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center flex-shrink-0">{conv.unreadCount}</span>}
                </button>
              ))
            }
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {!selectedUserId ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">Select a conversation</div>
          ) : (
            <>
              <div className="h-12 border-b border-border flex items-center px-4 gap-2">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-xs">{selected?.user?.firstName?.[0]}{selected?.user?.lastName?.[0]}</AvatarFallback></Avatar>
                <span className="text-sm font-medium">{selected?.user?.firstName} {selected?.user?.lastName}</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => {
                  const isMe = msg.fromUserId === me?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`} data-testid={`message-${msg.id}`}>
                      <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>{msg.body}</div>
                    </div>
                  );
                })}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <Input value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Type a message..." className="h-9" data-testid="input-message" />
                <Button size="sm" onClick={handleSend} disabled={!messageText.trim() || sendMutation.isPending} data-testid="button-send">
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
