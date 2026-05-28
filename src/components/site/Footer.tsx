import { useState, useEffect } from "react";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer className="bg-surface-dark text-surface-dark-foreground">
        <div className="container-eduka py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <img src="/logo-smp-pgri8.svg" alt="Logo SMP PGRI 8" className="h-12 w-auto" />
                <div className="leading-tight">
                  <div className="font-display font-extrabold text-lg">SMP PGRI 8</div>
                  <div className="text-xs opacity-75">Kota Bogor</div>
                </div>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">
                Sekolah modern berbasis karakter & teknologi yang mencetak generasi
                unggul, berakhlak mulia, dan siap menghadapi masa depan.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {[Facebook, Instagram, Youtube].map((I, i) => (
                  <a key={i} href="#" className="h-10 w-10 rounded-full bg-white/10 hover:bg-accent hover:scale-110 grid place-items-center transition-all duration-300" aria-label="Social">
                    <I className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg mb-5">Tautan Cepat</h4>
              <ul className="space-y-3 text-sm opacity-85">
                {[
                  ["Beranda", "#beranda"], ["Profil Sekolah", "#profil"], ["Fasilitas", "#fasilitas"],
                  ["Berita", "#berita"], ["Galeri", "#galeri"],
                ].map(([l, h]) => (
                  <li key={l}><a href={h} className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg mb-5">Informasi PPDB</h4>
              <ul className="space-y-3 text-sm opacity-85">
                {["Pendaftaran Online", "Syarat & Ketentuan", "Jadwal Seleksi", "Biaya Pendidikan", "FAQ"].map((l) => (
                  <li key={l}><a href="/ppdb" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">{l}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-bold text-lg mb-5">Kontak</h4>
              <ul className="space-y-4 text-sm opacity-85">
                <li className="flex gap-3"><MapPin className="h-5 w-5 shrink-0 text-accent" /> Jl. Raya Semplak Jl. Cemplang Utara No.276, Cilendek Bar., Bogor Barat</li>
                <li className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-accent" /> (0251) 123-4567</li>
                <li className="flex gap-3"><Mail className="h-5 w-5 shrink-0 text-accent" /> info@smppgri8bogor.sch.id</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-eduka py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-sm opacity-80">
            <p>&copy; 2026 SMP PGRI 8 Kota Bogor. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 grid place-items-center transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
