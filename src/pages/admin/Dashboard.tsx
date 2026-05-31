import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminGetStats } from "@/services/supabase/adminQueries";
import { Newspaper, Building2, Image, Users, FileText } from "lucide-react";

type Stats = {
  berita: number;
  fasilitas: number;
  galeri: number;
  guruStaff: number;
  ppdb: number;
};

const statCards = [
  { key: "berita", label: "Berita", icon: Newspaper, to: "/admin/berita", color: "bg-blue-500" },
  { key: "fasilitas", label: "Fasilitas", icon: Building2, to: "/admin/fasilitas", color: "bg-green-500" },
  { key: "galeri", label: "Galeri", icon: Image, to: "/admin/galeri", color: "bg-purple-500" },
  { key: "guruStaff", label: "Guru & Staff", icon: Users, to: "/admin/guru-staff", color: "bg-orange-500" },
  { key: "ppdb", label: "Pendaftar PPDB", icon: FileText, to: "/admin/ppdb", color: "bg-red-500" },
] as const;

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminGetStats().then(setStats).catch(console.error);
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Selamat datang di panel admin SMP PGRI 8.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <Link
              key={card.key}
              to={card.to}
              className="bg-card border border-border rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className={`h-10 w-10 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                <card.icon className="h-5 w-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats ? stats[card.key] : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="font-semibold text-foreground mb-3">Pintasan Cepat</h2>
          <div className="flex flex-wrap gap-x-3 gap-y-2">
            <Link to="/admin/berita" className="text-sm text-primary hover:underline">+ Tambah Berita</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/galeri" className="text-sm text-primary hover:underline">+ Tambah Foto Galeri</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/guru-staff" className="text-sm text-primary hover:underline">+ Tambah Guru / Staff</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/ppdb" className="text-sm text-primary hover:underline">Lihat Pendaftar PPDB</Link>
            <span className="text-muted-foreground">·</span>
            <Link to="/admin/config" className="text-sm text-primary hover:underline">Edit Info Sekolah</Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
