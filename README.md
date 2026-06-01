# Anggota Kelompok
**Gian Padang Andrury Asbi - M0405241063**
**Hafidz Syadi Ismallah Hidayat - M0405241061**
**Nayla Shifa Aurelia - M0405241060**


# SMP PGRI 8 Kota Bogor — Website Resmi

Website informasi sekolah modern untuk SMP PGRI 8 Kota Bogor, dibangun dengan React + TypeScript + Supabase.

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Database & Storage | Supabase (PostgreSQL + Storage) |
| Animasi | Framer Motion |
| Form Validation | Zod |
| Routing | React Router DOM v6 |
| Charts | Recharts |
| Maps | React Leaflet |

---

## Struktur Project

```
src/
├── assets/
│   └── images/
│       ├── about/          # Foto halaman profil
│       ├── facilities/     # Foto fasilitas (fallback lokal)
│       ├── hero/           # Foto hero section
│       ├── news/           # Foto berita (fallback lokal)
│       └── school/         # Foto gedung sekolah
├── components/
│   ├── common/             # Komponen reusable (NavLink)
│   ├── forms/              # Form PPDB
│   ├── layout/             # Navbar, TopBar, Footer, PPDBNavbar
│   ├── sections/           # Section halaman utama
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Stats.tsx
│   │   ├── News.tsx        # ← data dari Supabase (tabel: berita)
│   │   ├── Facilities.tsx  # ← data dari Supabase (tabel: fasilitas)
│   │   ├── Gallery.tsx     # ← data dari Supabase (tabel: galeri)
│   │   ├── Contact.tsx     # ← data dari Supabase (tabel: website_config)
│   │   └── FAQ.tsx
│   └── ui/                 # shadcn/ui + custom components
├── hooks/                  # Custom hooks (useNavbarTop, useScrollTrigger, dll)
├── lib/                    # Utility (cn, dll)
├── pages/                  # Halaman (Index, PPDB, NotFound)
├── services/
│   └── supabase/
│       ├── client.ts       # Supabase client instance
│       ├── queries.ts      # Query functions (getBerita, getFasilitas, dll)
│       └── types.ts        # TypeScript types untuk semua tabel
└── styles/
    └── index.css           # Global styles + Tailwind directives
```

---

## Setup & Instalasi

### 1. Clone & Install

```bash
git clone https://github.com/BangJhen/smp-pgri8-web.git
cd smp-pgri8-web
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```env
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_publishable_key"
VITE_SUPABASE_URL="https://your_project_id.supabase.co"
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:5173`

---

## Perintah Tersedia

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run preview` | Preview hasil build |
| `npm run lint` | Jalankan ESLint |
| `npm run test` | Jalankan tests |

---

## Konfigurasi Supabase

### Tabel Database

| Tabel | Keterangan | Kolom Penting |
|-------|------------|---------------|
| `berita` | Artikel berita & pengumuman | title, slug, excerpt, content, category, thumbnail_url, status, published_at |
| `fasilitas` | Data fasilitas sekolah | name, description, image_url |
| `galeri` | Foto & video kegiatan | title, media_url, media_type, event_date |
| `guru_staff` | Data guru dan staff | full_name, position, type, photo_url, bio |
| `dokumen` | Dokumen & file PDF | title, file_url, file_type |
| `website_config` | Konfigurasi website (1 row) | school_name, vision, mission, address, phone, email |
| `pendaftaran_ppdb` | Data pendaftar PPDB | nama_lengkap, nisn, tanggal_lahir, jenis_kelamin, asal_sekolah, status |

### Storage Buckets

| Bucket | Isi | Maks | Format |
|--------|-----|------|--------|
| `berita` | Thumbnail berita | 5 MB | jpg, png, webp, gif |
| `fasilitas` | Foto fasilitas | 5 MB | jpg, png, webp, gif |
| `galeri` | Foto/video kegiatan | 5 MB | jpg, png, webp, gif, mp4 |
| `guru-staff` | Foto profil guru & staff | 5 MB | jpg, png, webp |
| `dokumen` | File dokumen | 10 MB | pdf |

URL format file yang tersimpan di Storage:
```
https://<project_id>.supabase.co/storage/v1/object/public/<bucket>/<filename>
```

---

## Cara Ganti ke Supabase Project Baru

Ikuti langkah berikut jika ingin pindah ke project Supabase yang berbeda:

### Langkah 1 — Update `.env`

```env
VITE_SUPABASE_PROJECT_ID="project_id_baru"
VITE_SUPABASE_PUBLISHABLE_KEY="publishable_key_baru"
VITE_SUPABASE_URL="https://project_id_baru.supabase.co"
```

### Langkah 2 — Buat tabel di project baru

Jalankan SQL berikut di Supabase Dashboard → SQL Editor:

```sql
-- Enum types
CREATE TYPE berita_status AS ENUM ('draft', 'published');
CREATE TYPE media_type AS ENUM ('photo', 'video');
CREATE TYPE staff_type AS ENUM ('guru', 'staff');

-- Tabel berita
CREATE TABLE berita (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  excerpt text,
  content text NOT NULL,
  category text,
  thumbnail_url text,
  status berita_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tabel fasilitas
CREATE TABLE fasilitas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabel galeri
CREATE TABLE galeri (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  media_url text NOT NULL,
  media_type media_type NOT NULL,
  event_date date,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabel guru_staff
CREATE TABLE guru_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  position text NOT NULL,
  type staff_type NOT NULL,
  photo_url text,
  bio text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabel dokumen
CREATE TABLE dokumen (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Tabel website_config (singleton — hanya 1 row)
CREATE TABLE website_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text,
  history text,
  vision text,
  mission text,
  address text,
  phone text,
  email text,
  map_embed_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX website_config_singleton ON website_config ((true));

-- Tabel pendaftaran_ppdb
CREATE TABLE pendaftaran_ppdb (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap text NOT NULL,
  nisn text,
  tempat_lahir text NOT NULL,
  tanggal_lahir date NOT NULL,
  jenis_kelamin text NOT NULL CHECK (jenis_kelamin IN ('L', 'P')),
  agama text NOT NULL,
  alamat text NOT NULL,
  asal_sekolah text NOT NULL,
  nama_orangtua text NOT NULL,
  no_hp text NOT NULL,
  email text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
```

### Langkah 3 — Buat Storage Buckets

Jalankan SQL berikut di SQL Editor:

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('berita',     'berita',     true, 5242880,  '{image/jpeg,image/png,image/webp,image/gif}'),
  ('fasilitas',  'fasilitas',  true, 5242880,  '{image/jpeg,image/png,image/webp,image/gif}'),
  ('galeri',     'galeri',     true, 5242880,  '{image/jpeg,image/png,image/webp,image/gif,video/mp4}'),
  ('guru-staff', 'guru-staff', true, 5242880,  '{image/jpeg,image/png,image/webp}'),
  ('dokumen',    'dokumen',    true, 10485760, '{application/pdf}')
ON CONFLICT (id) DO NOTHING;
```

### Langkah 4 — Rebuild

```bash
npm run build
```

---

## Upload Gambar ke Storage

Upload via Supabase Dashboard → Storage → pilih bucket → Upload file.

Atau via curl (gunakan service_role key):

```bash
curl -X POST "https://<project_id>.supabase.co/storage/v1/object/<bucket>/<filename>" \
  -H "Authorization: Bearer <service_role_key>" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/file.jpg"
```

Setelah upload, simpan URL ke kolom yang sesuai di tabel:
```
https://<project_id>.supabase.co/storage/v1/object/public/<bucket>/<filename>
```

---

## Desain

- **Primary:** `#015C4A` (hijau tua)
- **Accent:** `#DAA428` (emas)
- **Font:** Inter (body) + display font (heading)
- **Responsive:** Mobile-first

---

## Lisensi

Proprietary — SMP PGRI 8 Kota Bogor.
