import { supabase } from "./client";
import type { Tables } from "./types";

export type Berita = Tables<"berita">;
export type Fasilitas = Tables<"fasilitas">;
export type Galeri = Tables<"galeri">;
export type GuruStaff = Tables<"guru_staff">;
export type WebsiteConfig = Tables<"website_config">;

// ── Berita ────────────────────────────────────────────────────────────────────
export async function getBerita(limit = 6) {
  const { data, error } = await supabase
    .from("berita")
    .select("id, title, slug, excerpt, category, thumbnail_url, published_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Berita[];
}

// ── Fasilitas ─────────────────────────────────────────────────────────────────
export async function getFasilitas() {
  const { data, error } = await supabase
    .from("fasilitas")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Fasilitas[];
}

// ── Galeri ────────────────────────────────────────────────────────────────────
export async function getGaleri(limit = 12) {
  const { data, error } = await supabase
    .from("galeri")
    .select("*")
    .order("event_date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Galeri[];
}

// ── Guru & Staff ──────────────────────────────────────────────────────────────
export async function getGuruStaff() {
  const { data, error } = await supabase
    .from("guru_staff")
    .select("*")
    .order("type", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as GuruStaff[];
}

// ── Berita by slug ────────────────────────────────────────────────────────────
export async function getBeritaBySlug(slug: string) {
  const { data, error } = await supabase
    .from("berita")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data as Berita;
}

// ── Related berita ────────────────────────────────────────────────────────────
export async function getRelatedBerita(excludeSlug: string, limit = 3) {
  const { data, error } = await supabase
    .from("berita")
    .select("id, title, slug, excerpt, category, thumbnail_url, published_at")
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as Berita[];
}

// ── Website Config ────────────────────────────────────────────────────────────
export async function getWebsiteConfig() {
  const { data, error } = await supabase
    .from("website_config")
    .select("*")
    .limit(1)
    .single();
  if (error) throw error;
  return data as WebsiteConfig;
}
