import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content: "Halo! Saya asisten virtual SMP PGRI 8 Kota Bogor. Ada yang bisa saya bantu? 😊",
};

const STORAGE_KEY = "smppgri8-chat";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://tvwppkrpikgjlrbocciq.supabase.co";
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_hoCBJsmf5KbMAKj-FZRMaA_SfOFTQai";

const BRAND = "#015C4A";

function loadMessages(): Message[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    // ignore corrupt storage
  }
  return [GREETING];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Persist conversation across reloads (cleared when the tab closes).
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const clearChat = () => {
    setMessages([GREETING]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const history = [...messages, userMessage];
    // Add the user message plus an empty assistant message we stream into.
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    const appendToReply = (chunk: string) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: next[next.length - 1].content + chunk,
        };
        return next;
      });

    try {
      // The Groq key lives only in the "chat" Edge Function (server-side),
      // so it is never exposed to the browser. The function streams plain text.
      const res = await fetch(`${SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
        body: JSON.stringify({ messages: history.slice(-8) }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`Chat function error: ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        appendToReply(decoder.decode(value, { stream: true }));
      }
    } catch (err) {
      console.error("Chatbot request failed:", err);
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup chat" : "Buka chat asisten"}
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all"
        style={{ backgroundColor: BRAND }}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 z-50 w-auto sm:w-80 max-w-[calc(100vw-2rem)] h-[28rem] max-h-[70vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-4 text-white flex items-center gap-2" style={{ backgroundColor: BRAND }}>
            <Bot className="w-5 h-5" />
            <div className="flex-1">
              <p className="font-semibold text-sm">Asisten SMP PGRI 8</p>
              <p className="text-xs opacity-80">Online</p>
            </div>
            <button
              onClick={clearChat}
              aria-label="Bersihkan percakapan"
              title="Bersihkan percakapan"
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => {
              const isLastAssistant = i === messages.length - 1 && msg.role === "assistant";
              // Show typing dots while the streamed reply is still empty.
              if (isLastAssistant && msg.content === "" && isLoading) {
                return (
                  <div key={i} className="flex gap-2 justify-start">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: BRAND }}>
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}
                    style={msg.role === "user" ? { backgroundColor: BRAND } : {}}
                  >
                    {msg.role === "assistant" ? (
                      <div className="leading-relaxed [&_p]:m-0 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-1 [&_li]:my-0.5 [&_strong]:font-semibold [&_a]:underline" style={{ overflowWrap: "anywhere" }}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: (props) => <a {...props} target="_blank" rel="noreferrer" style={{ color: BRAND }} />,
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-3 h-3 text-gray-600" />
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ketik pertanyaan..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 outline-none focus:border-green-600"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Kirim pesan"
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-50"
              style={{ backgroundColor: BRAND }}
            >
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
