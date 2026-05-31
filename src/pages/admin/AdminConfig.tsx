import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminGetWebsiteConfig, adminUpdateWebsiteConfig } from "@/services/supabase/adminQueries";
import type { WebsiteConfig } from "@/services/supabase/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const AdminConfig = () => {
  const [config, setConfig] = useState<WebsiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    school_name: "", history: "", vision: "", mission: "",
    address: "", phone: "", email: "", map_embed_url: "",
  });

  useEffect(() => {
    adminGetWebsiteConfig()
      .then((data) => {
        setConfig(data);
        setForm({
          school_name: data.school_name ?? "",
          history: data.history ?? "",
          vision: data.vision ?? "",
          mission: data.mission ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          map_embed_url: data.map_embed_url ?? "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!config) return;
    setSaving(true);
    try {
      await adminUpdateWebsiteConfig(config.id, {
        school_name: form.school_name || null,
        history: form.history || null,
        vision: form.vision || null,
        mission: form.mission || null,
        address: form.address || null,
        phone: form.phone || null,
        email: form.email || null,
        map_embed_url: form.map_embed_url || null,
      });
      toast.success("Pengaturan disimpan");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-4 max-w-2xl">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-secondary rounded animate-pulse" />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan Website</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit informasi umum sekolah yang ditampilkan di website.</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-foreground">Informasi Umum</h2>
          <div className="space-y-2">
            <Label>Nama Sekolah</Label>
            <Input
              value={form.school_name}
              onChange={(e) => setForm((f) => ({ ...f, school_name: e.target.value }))}
              placeholder="SMP PGRI 8 Kota Bogor"
            />
          </div>
          <div className="space-y-2">
            <Label>Sejarah Sekolah</Label>
            <Textarea
              value={form.history}
              onChange={(e) => setForm((f) => ({ ...f, history: e.target.value }))}
              rows={5}
              placeholder="Sejarah singkat sekolah..."
            />
          </div>
          <div className="space-y-2">
            <Label>Visi</Label>
            <Textarea
              value={form.vision}
              onChange={(e) => setForm((f) => ({ ...f, vision: e.target.value }))}
              rows={3}
              placeholder="Visi sekolah..."
            />
          </div>
          <div className="space-y-2">
            <Label>Misi</Label>
            <Textarea
              value={form.mission}
              onChange={(e) => setForm((f) => ({ ...f, mission: e.target.value }))}
              rows={4}
              placeholder="Misi sekolah..."
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-foreground">Kontak</h2>
          <div className="space-y-2">
            <Label>Alamat</Label>
            <Textarea
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              rows={2}
              placeholder="Alamat lengkap sekolah..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nomor Telepon</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(0251) 123-4567"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="info@sekolah.sch.id"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>URL Embed Peta Google Maps</Label>
            <Input
              value={form.map_embed_url}
              onChange={(e) => setForm((f) => ({ ...f, map_embed_url: e.target.value }))}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </AdminLayout>
  );
};

export default AdminConfig;
