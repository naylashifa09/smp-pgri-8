import { supabase } from "./client";
import type { Database } from "./types";

type BeritaInsert = Database["public"]["Tables"]["berita"]["Insert"];
type BeritaUpdate = Database["public"]["Tables"]["berita"]["Update"];
type FasilitasInsert = Database["public"]["Tables"]["fasilitas"]["Insert"];
type FasilitasUpdate = Database["public"]["Tables"]["fasilitas"]["Update"];
type GaleriInsert = Database["public"]["Tables"]["galeri"]["Insert"];
type GaleriUpdate = Database["public"]["Tables"]["galeri"]["Update"];
type GuruStaffInsert = Database["public"]["Tables"]["guru_staff"]["Insert"];
type GuruStaffUpdate = Database["public"]["Tables"]["guru_staff"]["Update"];
type WebsiteConfigUpdate = Database["public"]["Tables"]["website_config"]["Update"];

// ── Berita ─────────────────────────────────────────────────────────────────────
export async function adminGetBerita() {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminInsertBerita(payload: BeritaInsert) {
  const { data, error } = await supabase.from("berita").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateBerita(id: string, payload: BeritaUpdate) {
  const { data, error } = await supabase
    .from("berita")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adminDeleteBerita(id: string) {
  const { error } = await supabase.from("berita").delete().eq("id", id);
  if (error) throw error;
}

// ── Fasilitas ─────────────────────────────────────────────────────────────────
export async function adminGetFasilitas() {
  const { data, error } = await supabase
    .from("fasilitas")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function adminInsertFasilitas(payload: FasilitasInsert) {
  const { data, error } = await supabase.from("fasilitas").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateFasilitas(id: string, payload: FasilitasUpdate) {
  const { data, error } = await supabase.from("fasilitas").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteFasilitas(id: string) {
  const { error } = await supabase.from("fasilitas").delete().eq("id", id);
  if (error) throw error;
}

// ── Galeri ────────────────────────────────────────────────────────────────────
export async function adminGetGaleri() {
  const { data, error } = await supabase
    .from("galeri")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminInsertGaleri(payload: GaleriInsert) {
  const { data, error } = await supabase.from("galeri").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateGaleri(id: string, payload: GaleriUpdate) {
  const { data, error } = await supabase.from("galeri").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteGaleri(id: string) {
  const { error } = await supabase.from("galeri").delete().eq("id", id);
  if (error) throw error;
}

// ── Guru & Staff ──────────────────────────────────────────────────────────────
export async function adminGetGuruStaff() {
  const { data, error } = await supabase
    .from("guru_staff")
    .select("*")
    .order("type", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function adminInsertGuruStaff(payload: GuruStaffInsert) {
  const { data, error } = await supabase.from("guru_staff").insert(payload).select().single();
  if (error) throw error;
  return data;
}

export async function adminUpdateGuruStaff(id: string, payload: GuruStaffUpdate) {
  const { data, error } = await supabase.from("guru_staff").update(payload).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function adminDeleteGuruStaff(id: string) {
  const { error } = await supabase.from("guru_staff").delete().eq("id", id);
  if (error) throw error;
}

// ── Website Config ────────────────────────────────────────────────────────────
export async function adminGetWebsiteConfig() {
  const { data, error } = await supabase.from("website_config").select("*").limit(1).single();
  if (error) throw error;
  return data;
}

export async function adminUpdateWebsiteConfig(id: string, payload: WebsiteConfigUpdate) {
  const { data, error } = await supabase
    .from("website_config")
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── PPDB ──────────────────────────────────────────────────────────────────────
export async function adminGetPPDB() {
  const { data, error } = await supabase
    .from("pendaftaran_ppdb")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function adminUpdatePPDBStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("pendaftaran_ppdb")
    .update({ status })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export async function adminGetStats() {
  const [berita, fasilitas, galeri, guruStaff, ppdb] = await Promise.all([
    supabase.from("berita").select("id", { count: "exact", head: true }),
    supabase.from("fasilitas").select("id", { count: "exact", head: true }),
    supabase.from("galeri").select("id", { count: "exact", head: true }),
    supabase.from("guru_staff").select("id", { count: "exact", head: true }),
    supabase.from("pendaftaran_ppdb").select("id", { count: "exact", head: true }),
  ]);
  return {
    berita: berita.count ?? 0,
    fasilitas: fasilitas.count ?? 0,
    galeri: galeri.count ?? 0,
    guruStaff: guruStaff.count ?? 0,
    ppdb: ppdb.count ?? 0,
  };
}
