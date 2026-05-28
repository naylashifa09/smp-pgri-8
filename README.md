# SMP PGRI 8 Kota Bogor - Website

Modern, responsive school information portal with admin content management system for SMP PGRI 8 Kota Bogor.

## 🎯 Overview

Website SMP PGRI 8 Kota Bogor is a comprehensive digital platform designed to:
- Provide official school information to the public
- Showcase school facilities, programs, and achievements
- Enable online student registration (PPDB)
- Manage school content through an admin dashboard

## 🚀 Tech Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Form Validation:** Zod
- **Data Fetching:** TanStack React Query
- **Routing:** React Router DOM v6

## 📋 Features

### For Visitors
- 🏠 Homepage with school overview
- 📖 School profile (history, vision, mission)
- 👨‍🏫 Teacher and staff directory
- 🏢 Facilities information
- 📰 News and announcements
- 🖼️ Photo gallery
- 📞 Contact information and location map
- 📝 Online student registration (PPDB)

### For Admin
- 🔐 Secure login system
- 📊 Admin dashboard
- ✏️ Content management (news, gallery, teacher data)
- 🖼️ Media upload and management
- ⚙️ Website settings

## 🛠️ Installation

### Prerequisites
- Node.js v16+ or Bun
- npm or Bun package manager

### Setup

1. Clone the repository
```bash
git clone https://github.com/BangJhen/smp-pgri8-web.git
cd smp-pgri8-web
```

2. Install dependencies
```bash
bun install
# or
npm install
```

3. Setup environment variables
Create `.env.local` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server
```bash
bun run dev
# or
npm run dev
```

Visit `http://localhost:5173/`

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run test` | Run tests |
| `bun run test:watch` | Run tests in watch mode |

## 📁 Project Structure

```
src/
├── components/
│   ├── site/          # Page sections (Hero, About, News, etc)
│   └── ui/            # shadcn/ui components
├── pages/             # Page components
├── integrations/
│   └── supabase/      # Supabase client & types
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── assets/            # Images and static files
└── App.tsx            # Main app component
```

## 🎨 Design System

- **Primary Color:** Teal (#2D9B8F)
- **Accent Color:** Orange (#FF8C42)
- **Typography:** Poppins (headings) + Inter (body)
- **Responsive:** Mobile-first design

## 🔒 Security Features

- HTTPS/SSL encryption
- Secure admin authentication
- Input validation with Zod
- CSRF protection
- Regular data backups

## 📊 Performance

- Page load time: < 3 seconds
- Supports 100+ concurrent visitors
- Optimized images and assets
- Efficient database queries

## 🤝 Contributing

This is a school project developed by Kelompok 14:
- Nayla Shifa Aurelia (M0405241060)
- Hafidz Syadi Ismallah Hidayat (M0405241061)
- Gian Padang Andrury Asbi (M0405241063)

## 📄 License

This project is proprietary to SMP PGRI 8 Kota Bogor.

## 📞 Contact

**SMP PGRI 8 Kota Bogor**
- 📍 Jl. PGRI No. 8, Kota Bogor
- 📧 info@smppgri8bogor.sch.id
- 📱 (0251) 123-4567

---

Built with ❤️ for education in Indonesia
