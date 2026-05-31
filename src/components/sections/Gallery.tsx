import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageOff } from "lucide-react";
import { getGaleri, type Galeri } from "@/services/supabase/queries";
import { Lightbox } from "@/components/ui/lightbox";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Category = "semua" | "kegiatan" | "fasilitas" | "prestasi";

// Map category dari DB ke filter lokal (case-insensitive)
const mapCategory = (title: string, desc: string | null): Category => {
  const text = (title + " " + (desc ?? "")).toLowerCase();
  if (text.includes("prestasi") || text.includes("juara") || text.includes("olimpiade")) return "prestasi";
  if (text.includes("fasilitas") || text.includes("lab") || text.includes("perpustakaan") || text.includes("gedung")) return "fasilitas";
  return "kegiatan";
};

const categories = [
  { id: "semua" as Category, label: "Semua" },
  { id: "kegiatan" as Category, label: "Kegiatan" },
  { id: "fasilitas" as Category, label: "Fasilitas" },
  { id: "prestasi" as Category, label: "Prestasi" },
];

// Grid span pattern untuk layout masonry-like
const spanPattern = [
  "md:col-span-2 md:row-span-2",
  "",
  "",
  "",
  "",
  "md:col-span-2",
];

type GalleryItemType = Galeri & { category: Category; span: string };

function GalleryItem({ item, onClick }: { item: GalleryItemType; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
      {!imgError ? (
        <img
          src={item.media_url}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-secondary to-muted flex flex-col items-center justify-center gap-2 p-3">
          <ImageOff className="h-8 w-8 text-muted-foreground/40" />
          <span className="text-muted-foreground text-xs text-center font-medium leading-tight">{item.title}</span>
        </div>
      )}
      {!imgError && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-primary-foreground font-display font-bold text-xs md:text-sm">
            {item.title}
          </div>
        </>
      )}
      {imgError && (
        <div className="absolute bottom-3 left-3 right-3">
          <span className="text-xs font-semibold text-foreground/70 text-center block">{item.title}</span>
        </div>
      )}
    </div>
  );
}

const Gallery = () => {
  const [galeri, setGaleri] = useState<(Galeri & { category: Category; span: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<Category>("semua");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    getGaleri(12)
      .then((data) => {
        const mapped = data.map((item, i) => ({
          ...item,
          category: mapCategory(item.title, item.description),
          span: spanPattern[i % spanPattern.length],
        }));
        setGaleri(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = activeFilter === "semua"
    ? galeri
    : galeri.filter((item) => item.category === activeFilter);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="galeri" className="section-pad bg-secondary/40">
      <div className="container-eduka">
        <ScrollReveal animation="slide-up">
          <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
            <p className="text-accent font-semibold text-xs md:text-sm uppercase tracking-wider">Galeri Sekolah</p>
            <h2 className="mt-2 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-foreground">
              Momen Berharga Kami
            </h2>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal animation="fade" delay={100}>
          <div className="flex justify-center gap-2 mb-8 md:mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-4 md:px-6 py-2 rounded-full font-semibold text-xs md:text-sm transition-all duration-300 ${
                  activeFilter === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-card text-muted-foreground hover:bg-primary-soft hover:text-primary hover:scale-105"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] gap-3 md:gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl md:rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 auto-rows-[140px] sm:auto-rows-[160px] md:auto-rows-[180px] lg:auto-rows-[200px] gap-3 md:gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((it, i) => (
                  <motion.div
                    key={it.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className={`relative overflow-hidden rounded-xl md:rounded-2xl shadow-soft group cursor-pointer ${it.span}`}
                  >
                    <GalleryItem item={it} onClick={() => handleImageClick(i)} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            <Lightbox
              images={filteredItems.map((item) => item.media_url)}
              initialIndex={lightboxIndex}
              isOpen={lightboxOpen}
              onClose={() => setLightboxOpen(false)}
              alt="Galeri SMP PGRI 8"
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Gallery;
