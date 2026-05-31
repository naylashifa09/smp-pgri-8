import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { adminGetPPDB, adminUpdatePPDBStatus } from "@/services/supabase/adminQueries";
import type { Tables } from "@/services/supabase/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

type PPDB = Tables<"pendaftaran_ppdb">;

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  diterima: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const AdminPPDB = () => {
  const [items, setItems] = useState<PPDB[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminGetPPDB().then(setItems).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatus = async (id: string, status: string) => {
    try {
      await adminUpdatePPDBStatus(id, status);
      toast.success("Status diperbarui");
      load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Gagal memperbarui status");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Pendaftar PPDB</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? "Memuat..." : `${items.length} pendaftar terdaftar.`}
          </p>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-secondary rounded animate-pulse" />)}
          </div>
        ) : (
          <div className="border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>NISN</TableHead>
                    <TableHead>Asal Sekolah</TableHead>
                    <TableHead>No. HP</TableHead>
                    <TableHead>Tgl. Daftar</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Belum ada pendaftar.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nama_lengkap}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.nisn ?? "-"}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{item.asal_sekolah}</TableCell>
                        <TableCell className="text-sm">{item.no_hp}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString("id-ID")}
                        </TableCell>
                        <TableCell>
                          <select
                            value={item.status}
                            onChange={(e) => handleStatus(item.id, e.target.value)}
                            className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer outline-none ${
                              statusColors[item.status] ?? "bg-secondary text-foreground"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="diterima">Diterima</option>
                            <option value="ditolak">Ditolak</option>
                          </select>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPPDB;
