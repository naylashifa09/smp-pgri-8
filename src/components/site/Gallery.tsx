import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import lib from "@/assets/facility-library.jpg";
import lab from "@/assets/facility-lab.jpg";
import building from "@/assets/facility-building.jpg";
import { Lightbox } from "@/components/ui/lightbox";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

type Category = "semua" | "kegiatan" | "fasilitas" | "prestasi";

const items = [
  { src: building, span: "md:col-span-2 md:row-span-2", label: "Gedung Sekolah", category: "fasilitas" as Category },
  { src: news1, span: "", label: "Kegiatan Olahraga", category: "kegiatan" as Category },
  { src: lib, span: "", label: "Perpustakaan", category: "fasilitas" as Category },
  { src: news2, span: "", label: "Prestasi Akademik", category: "prestasi" as Category },
  { src: lab, span: "", label: "Lab Komputer", category: "fasilitas" as Category },
  { src: news3, span: "md:col-span-2", label: "Upacara Bendera", category: "kegiatan" as Category },
];

const categories = [
  { id: "semua" as Category, label: "Semua" },
  { id: "kegiatan" as Category, label: "Kegiatan" },
  { id: "fasilitas" as Category, label: "Fasilitas" },
  { id: "prestasi" as Category, label: "Prestasi" },
];

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState<Category>("semua");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredItems = activeFilter === "semua" 
    ? items 
    : items.filter(item => item.category === activeFilter);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section id="galeri" className="section-pad bg-secondary/40">
      <div className="container-eduka">
        <ScrollReveal animation="slide-up">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">Galeri Sekolah</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-foreground">
              Momen <span className="text-primary">Berharga</span> Kami
            </h2>
          </div>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal animation="fade" delay={100}>
          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
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

        {/* Gallery Grid */}
        <motion.div 
          layout
          className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[200px] gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((it, i) => (
              <motion.div
                key={it.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-2xl shadow-soft group cursor-pointer ${it.span}`}
                onClick={() => handleImageClick(i)}
              >
                <img 
                  src={it.src} 
                  alt={it.label} 
                  loading="lazy" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-primary-foreground font-display font-bold text-sm md:text-base">
                  {it.label}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox */}
        <Lightbox
          images={filteredItems.map(item => item.src)}
          initialIndex={lightboxIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          alt="Galeri SMP PGRI 8"
        />
      </div>
    </section>
  );
};

export default Gallery;
