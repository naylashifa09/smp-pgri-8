// Supabase Edge Function: "chat"
// Proxies requests to the Groq API so the API key never reaches the browser.
// Streams the reply back to the client as plain-text chunks (SSE -> text).
//
// The key is stored as a server-side secret (GROQ_API_KEY), set via:
//   supabase secrets set GROQ_API_KEY=gsk_...
// Deploy with:
//   supabase functions deploy chat --no-verify-jwt

const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

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

// Allow the browser to call this function. Tighten the origin for production
// if you want to restrict it to your own domain.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  if (!GROQ_API_KEY) {
    console.error("GROQ_API_KEY is not configured");
    return json({ error: "Layanan chat belum dikonfigurasi." }, 500);
  }

  let messages: ChatMessage[];
  try {
    const body = await req.json();
    messages = body?.messages;
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: "Field 'messages' harus berupa array yang berisi." }, 400);
    }
  } catch {
    return json({ error: "Body request tidak valid." }, 400);
  }

  // Sanitize: only forward role/content, cap history and per-message length.
  const safeMessages = messages
    .slice(-8)
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...safeMessages],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    });
  } catch (err) {
    console.error("Chat function failed:", err);
    return json({ error: "Terjadi kesalahan internal." }, 500);
  }

  if (!groqRes.ok || !groqRes.body) {
    const detail = await groqRes.text().catch(() => "");
    console.error("Groq API error", groqRes.status, detail);
    return json({ error: "Gagal menghubungi layanan AI." }, 502);
  }

  // Transform Groq's SSE stream into a plain-text stream of content deltas.
  const stream = groqRes.body
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(sseToTextTransform());

  return new Response(stream, {
    headers: {
      ...corsHeaders,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
});

// Parses OpenAI/Groq-style SSE ("data: {json}\n\n", terminated by "[DONE]")
// and emits only the assistant's text deltas.
function sseToTextTransform(): TransformStream<string, Uint8Array> {
  const encoder = new TextEncoder();
  let buffer = "";

  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? ""; // keep the last (possibly partial) line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") continue;
        try {
          const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        } catch {
          // Ignore keep-alives / partial JSON.
        }
      }
    },
  });
}

function json(payload: unknown, status: number): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
