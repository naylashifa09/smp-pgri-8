import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SYSTEM_PROMPT = `Kamu adalah asisten virtual SMP PGRI 8 Kota Bogor. 
Tugasmu adalah menjawab pertanyaan seputar sekolah dengan ramah dan informatif.

Informasi sekolah:
- Nama: SMP PGRI 8 Kota Bogor
- Alamat: Jl. Raya Semplak, Cilendek Barat, Bogor Barat, Kota Bogor
- Program: PPDB Online tersedia di website
- Fasilitas: Perpustakaan, Laboratorium, Lapangan Olahraga
- Visi: Mencetak lulusan cerdas, berakhlak mulia, dan siap bersaing di era digital

Jawab dalam Bahasa Indonesia yang sopan dan singkat. 
Jika tidak tahu, sarankan untuk menghubungi sekolah langsung.`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Halo! Saya asisten virtual SMP PGRI 8 Kota Bogor. Ada yang bisa saya bantu? 😊" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
            userMessage
          ],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await response.json();
      const reply = data.choices[0].message.content;
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Maaf, terjadi kesalahan. Silakan coba lagi." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all"
        style={{ backgroundColor: "#015C4A" }}
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <MessageCircle className="text-white w-6 h-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="p-4 text-white flex items-center gap-2" style={{ backgroundColor: "#015C4A" }}>
            <Bot className="w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Asisten SMP PGRI 8</p>
              <p className="text-xs opacity-80">Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1" style={{ backgroundColor: "#015C4A" }}>
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "text-white rounded-tr-sm"
                      : "bg-gray-100 text-gray-800 rounded-tl-sm"
                  }`}
                  style={msg.role === "user" ? { backgroundColor: "#015C4A" } : {}}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#015C4A" }}>
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
            )}
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
              className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50"
              style={{ backgroundColor: "#015C4A" }}
            >
              <Send className="w-3 h-3 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
