// Naive Bayes intent classifier — PKB/AI layer
// Classifies user input into one of 4 school-related intents,
// then returns a rule-based answer when confidence is high enough.
// Falls back to null (→ LLM) for unrecognized or ambiguous input.

export type Intent = "jadwal" | "ppdb" | "fasilitas" | "kontak" | "umum";

export interface ClassificationResult {
  intent: Intent;
  confidence: number; // 0–1, can be shown as "alasan" to assessors
  answer: string | null; // null means forward to LLM
}

// ── Training data: manually curated word frequencies per intent ──────────────
// Higher weight = stronger signal for that intent.
const VOCAB: Record<Intent, Record<string, number>> = {
  jadwal: {
    jadwal: 6, jam: 5, masuk: 4, pulang: 4, pelajaran: 5, hari: 4,
    senin: 4, selasa: 4, rabu: 4, kamis: 4, jumat: 4, sabtu: 4,
    mulai: 4, selesai: 4, waktu: 4, kapan: 5, libur: 5, kalender: 5,
    akademik: 4, ujian: 4, ulangan: 4, semester: 4, pagi: 3, siang: 3,
  },
  ppdb: {
    ppdb: 9, daftar: 6, pendaftaran: 7, baru: 5, siswa: 4,
    syarat: 6, persyaratan: 6, dokumen: 5, berkas: 5, formulir: 6,
    registrasi: 6, penerimaan: 6, gelombang: 5, biaya: 4, bayar: 4,
    online: 4, cara: 4, ijazah: 6, akta: 5, foto: 4,
  },
  fasilitas: {
    fasilitas: 9, perpustakaan: 7, laboratorium: 7, lab: 6, lapangan: 6,
    olahraga: 5, kantin: 6, toilet: 5, mushola: 6, masjid: 5, aula: 6,
    kelas: 4, ruang: 4, komputer: 6, internet: 5, wifi: 6,
  },
  kontak: {
    kontak: 8, hubungi: 7, telepon: 7, telp: 7, nomor: 6, hp: 6,
    whatsapp: 7, wa: 6, email: 7, alamat: 6, lokasi: 6, dimana: 5,
    letak: 5, instagram: 5, sosial: 4, media: 4,
  },
  umum: {
    sekolah: 1, smp: 1, pgri: 1, bogor: 1, halo: 1, hai: 1,
    apa: 1, siapa: 1, tolong: 1, bantu: 1, info: 1, informasi: 1,
  },
};

// Prior probability per class
const PRIORS: Record<Intent, number> = {
  jadwal: 0.23,
  ppdb: 0.23,
  fasilitas: 0.23,
  kontak: 0.23,
  umum: 0.08,
};

// ── Rule-based answers (knowledge base) ─────────────────────────────────────
const FAQ: Record<Exclude<Intent, "umum">, string> = {
  jadwal:
`**Jadwal Sekolah SMP PGRI 8 Kota Bogor:**
- Senin–Kamis : 07.00–14.00 WIB
- Jumat       : 07.00–11.30 WIB
- Sabtu       : 07.00–13.00 WIB

Untuk kalender akademik lengkap dan jadwal ujian, silakan cek halaman **Pengumuman** di website atau hubungi sekolah.`,

  ppdb:
`**Informasi PPDB SMP PGRI 8 Kota Bogor:**
Pendaftaran dilakukan secara **online** melalui halaman PPDB di website ini.

**Persyaratan umum:**
- Ijazah / SKL SD/MI atau sederajat
- Kartu Keluarga (KK)
- Akta kelahiran
- Pas foto terbaru

Untuk detail gelombang dan jadwal pendaftaran, kunjungi halaman **PPDB** atau hubungi sekolah.`,

  fasilitas:
`**Fasilitas SMP PGRI 8 Kota Bogor:**
- 📚 Perpustakaan
- 🔬 Laboratorium IPA & Komputer
- ⚽ Lapangan Olahraga
- 🕌 Mushola
- 🍽️ Kantin
- 📶 Akses Internet / WiFi

Silakan kunjungi sekolah untuk informasi lebih lengkap.`,

  kontak:
`**Kontak SMP PGRI 8 Kota Bogor:**
- 📍 Jl. Raya Semplak, Cilendek Barat, Bogor Barat, Kota Bogor
- 🌐 Website: smppgri8kotabogor.sch.id

Silakan hubungi sekolah langsung pada jam operasional (Senin–Sabtu) untuk nomor telepon & WhatsApp terbaru.`,
};

// ── Classifier ───────────────────────────────────────────────────────────────
const CONFIDENCE_THRESHOLD = 0.55;
const INTENTS: Intent[] = ["jadwal", "ppdb", "fasilitas", "kontak", "umum"];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function classify(text: string): ClassificationResult {
  const tokens = tokenize(text);

  // Log-probability per intent (Multinomial Naive Bayes with Laplace smoothing)
  const logScores: Record<string, number> = {};
  for (const intent of INTENTS) {
    const vocab = VOCAB[intent];
    const totalFreq = Object.values(vocab).reduce((a, b) => a + b, 0);
    const vocabSize = Object.keys(vocab).length;

    let logP = Math.log(PRIORS[intent]);
    for (const token of tokens) {
      const freq = vocab[token] ?? 0;
      logP += Math.log((freq + 1) / (totalFreq + vocabSize + 1));
    }
    logScores[intent] = logP;
  }

  // Softmax → normalized confidence scores
  const max = Math.max(...Object.values(logScores));
  let sumExp = 0;
  const exps: Record<string, number> = {};
  for (const intent of INTENTS) {
    exps[intent] = Math.exp(logScores[intent] - max);
    sumExp += exps[intent];
  }
  const probs: Record<string, number> = {};
  for (const intent of INTENTS) probs[intent] = exps[intent] / sumExp;

  const bestIntent = INTENTS.reduce((a, b) =>
    probs[a] > probs[b] ? a : b
  ) as Intent;
  const confidence = probs[bestIntent];

  if (bestIntent === "umum" || confidence < CONFIDENCE_THRESHOLD) {
    return { intent: "umum", confidence, answer: null };
  }

  return {
    intent: bestIntent,
    confidence,
    answer: FAQ[bestIntent as Exclude<Intent, "umum">],
  };
}
