import { useAuth } from "@/contexts/auth-context";
import BrandLayout from "@/components/layout/brand-layout";
import CreatorLayout from "@/components/layout/creator-layout";
import AgencyLayout from "@/components/layout/agency-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect, useCallback } from "react";
import { getToken } from "@/lib/auth-store";
import { Sparkles, Plus, Send, Trash2, Bot, User, Loader2, MessageSquare, ChevronRight } from "lucide-react";

const TEAL = "#1DCFB3";
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface AiConversation { id: number; title: string; createdAt: string; }
interface AiMessage { id: number; conversationId: number; role: string; content: string; createdAt: string; }

async function apiFetch(path: string, opts: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}/api${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...opts.headers },
  });
  if (!res.ok) throw new Error(await res.text());
  return res;
}

const STARTERS = [
  "What micro-influencer strategy works best for Lagos food brands?",
  "How do I brief a Ghanaian creator for a fintech campaign?",
  "What are the top content formats driving engagement in West Africa?",
  "How should I price a sponsored post deal with a 100K follower creator?",
];

function MarkdownText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\n)/g);
  return (
    <span>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
        if (p.startsWith("`") && p.endsWith("`")) return <code key={i} className="bg-black/10 px-1 rounded text-sm font-mono">{p.slice(1, -1)}</code>;
        if (p === "\n") return <br key={i} />;
        return p;
      })}
    </span>
  );
}

export default function TrendAiPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<AiConversation[]>([]);
  const [activeConvoId, setActiveConvoId] = useState<number | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamText, setStreamText] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const role = user?.role ?? "brand";
  const Layout = role === "creator" ? CreatorLayout : role === "agency" ? AgencyLayout : BrandLayout;

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, streamText]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await apiFetch("/openai/conversations");
      const data = await res.json();
      setConversations(data);
    } catch { /* silent */ }
    finally { setLoadingConvos(false); }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  const loadMessages = useCallback(async (convoId: number) => {
    setLoadingMessages(true);
    setMessages([]);
    try {
      const res = await apiFetch(`/openai/conversations/${convoId}`);
      const data = await res.json();
      setMessages(data.messages ?? []);
    } catch { /* silent */ }
    finally { setLoadingMessages(false); }
  }, []);

  const selectConversation = (id: number) => {
    setActiveConvoId(id);
    setStreamText("");
    loadMessages(id);
  };

  const createConversation = async (title: string) => {
    try {
      const res = await apiFetch("/openai/conversations", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      const convo = await res.json();
      setConversations((prev) => [convo, ...prev]);
      setActiveConvoId(convo.id);
      setMessages([]);
      setStreamText("");
      return convo.id as number;
    } catch { return null; }
  };

  const deleteConversation = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await apiFetch(`/openai/conversations/${id}`, { method: "DELETE" });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvoId === id) {
        setActiveConvoId(null);
        setMessages([]);
        setStreamText("");
      }
    } catch { /* silent */ }
  };

  const sendMessage = async (text: string = input.trim()) => {
    if (!text || streaming) return;
    setInput("");

    let convoId = activeConvoId;
    if (!convoId) {
      const title = text.length > 50 ? text.slice(0, 50) + "…" : text;
      convoId = await createConversation(title);
      if (!convoId) return;
    }

    const userMsg: AiMessage = {
      id: Date.now(), conversationId: convoId, role: "user", content: text, createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, userMsg]);
    setStreaming(true);
    setStreamText("");

    try {
      const token = getToken();
      const res = await fetch(`${BASE}/api/openai/conversations/${convoId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.done) {
                const assistantMsg: AiMessage = {
                  id: Date.now() + 1, conversationId: convoId, role: "assistant",
                  content: full, createdAt: new Date().toISOString()
                };
                setMessages((prev) => [...prev, assistantMsg]);
                setStreamText("");
              } else if (parsed.content) {
                full += parsed.content;
                setStreamText(full);
              }
            } catch { /* ignore parse errors */ }
          }
        }
      }
    } catch (err) {
      const errMsg: AiMessage = {
        id: Date.now() + 2, conversationId: convoId, role: "assistant",
        content: "Sorry, something went wrong. Please try again.", createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errMsg]);
      setStreamText("");
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmptyState = !activeConvoId && messages.length === 0;

  return (
    <Layout>
      <div className="h-[calc(100vh-116px)] flex rounded-2xl overflow-hidden border border-gray-100 bg-white" data-testid="page-trend-ai">

        {/* Sidebar */}
        <div className="w-64 flex flex-col flex-shrink-0 border-r border-gray-100" style={{ background: "#FAFAFA" }}>
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={() => { setActiveConvoId(null); setMessages([]); setStreamText(""); }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: `linear-gradient(135deg, ${TEAL}, #0FA88E)` }}
            >
              <Plus className="h-4 w-4" />
              New Chat
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {loadingConvos ? (
              <div className="flex items-center justify-center h-20">
                <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-24 text-center px-3">
                <MessageSquare className="h-5 w-5 text-gray-200 mb-1.5" />
                <p className="text-xs text-gray-400">No conversations yet</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectConversation(c.id)}
                  className="group w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-white"
                  style={activeConvoId === c.id
                    ? { background: "rgba(29,207,179,0.08)", border: "1px solid rgba(29,207,179,0.2)" }
                    : {}}
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 text-gray-300" />
                  <span className="flex-1 text-xs font-medium text-gray-700 truncate">{c.title}</span>
                  <button
                    onClick={(e) => deleteConversation(c.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:text-red-500 transition-all"
                  >
                    <Trash2 className="h-3 w-3 text-gray-400" />
                  </button>
                </button>
              ))
            )}
          </div>

          <div className="p-3 border-t border-gray-100">
            <div className="flex items-center gap-2 px-2 py-2 rounded-xl" style={{ background: "rgba(29,207,179,0.06)" }}>
              <Bot className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
              <div>
                <div className="text-xs font-bold" style={{ color: TEAL }}>Trend AI</div>
                <div className="text-xs text-gray-400">West Africa Expert</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Header */}
          <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(29,207,179,0.12)" }}>
              <Sparkles className="h-4 w-4" style={{ color: TEAL }} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">Trend AI</div>
              <div className="text-xs text-gray-400">Influencer marketing intelligence for West Africa</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {isEmptyState ? (
              <div className="h-full flex flex-col items-center justify-center px-8 py-12">
                <div className="h-16 w-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.15), rgba(29,207,179,0.05))", border: "1px solid rgba(29,207,179,0.2)" }}>
                  <Bot className="h-8 w-8" style={{ color: TEAL }} />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2 text-center">Ask Trend AI anything</h2>
                <p className="text-sm text-gray-400 text-center max-w-xs mb-8 leading-relaxed">
                  Your AI-powered advisor for influencer marketing strategy, campaign planning, and trend insights across West Africa.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="flex items-start gap-2.5 p-4 rounded-xl border border-gray-100 hover:border-[#1DCFB3] hover:bg-[rgba(29,207,179,0.04)] text-left transition-colors group"
                    >
                      <ChevronRight className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-gray-300 group-hover:text-[#1DCFB3] transition-colors" />
                      <span className="text-xs font-medium text-gray-600 leading-relaxed">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-5 space-y-5">
                {loadingMessages ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={msg.role === "user"
                          ? { background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" }
                          : { background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}
                      >
                        {msg.role === "user"
                          ? <User className="h-3.5 w-3.5 text-white" />
                          : <Bot className="h-3.5 w-3.5 text-white" />}
                      </div>
                      <div
                        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "text-white rounded-tr-sm"
                            : "text-gray-800 bg-gray-50 rounded-tl-sm border border-gray-100"
                        }`}
                        style={msg.role === "user" ? { background: "linear-gradient(135deg, #6B2FCE, #5B21B6)" } : {}}
                      >
                        <MarkdownText text={msg.content} />
                      </div>
                    </div>
                  ))
                )}

                {streamText && (
                  <div className="flex gap-3 flex-row">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed text-gray-800 bg-gray-50 border border-gray-100">
                      <MarkdownText text={streamText} />
                      <span className="inline-block w-1.5 h-4 bg-gray-400 animate-pulse ml-0.5 rounded-sm align-text-bottom" />
                    </div>
                  </div>
                )}

                {streaming && !streamText && (
                  <div className="flex gap-3">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)" }}>
                      <Bot className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-gray-50 border border-gray-100">
                      <div className="flex gap-1 items-center h-5">
                        <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="h-1.5 w-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2 items-end rounded-2xl border border-gray-200 bg-white px-4 py-3 focus-within:border-[#1DCFB3] transition-colors"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <Textarea
                ref={textareaRef}
                placeholder="Ask anything about influencer marketing in West Africa…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={streaming}
                rows={1}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[24px] max-h-[120px] text-sm p-0 shadow-none"
                style={{ overflowY: "auto" }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || streaming}
                className="h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                style={{ background: input.trim() && !streaming ? TEAL : "#E5E7EB" }}
              >
                {streaming
                  ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" />
                  : <Send className="h-3.5 w-3.5 text-white" />}
              </button>
            </div>
            <p className="text-center text-xs text-gray-300 mt-2">
              Trend AI provides marketing guidance. Always verify with your team before major decisions.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
