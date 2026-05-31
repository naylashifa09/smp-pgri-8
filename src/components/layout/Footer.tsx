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
        <div className="container-eduka py-10 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 md:gap-2.5 mb-4 md:mb-5">
                <img src="/logo-smp-pgri8.svg" alt="Logo SMP PGRI 8" className="h-8 w-auto md:h-12" />
                <div className="leading-tight hidden sm:block">
                  <div className="font-display font-extrabold text-sm md:text-lg">SMP PGRI 8</div>
                  <div className="text-[10px] md:text-xs opacity-75">Kota Bogor</div>
                </div>
              </div>
              <p className="text-xs md:text-sm opacity-80 leading-relaxed">
                Sekolah modern berbasis karakter & teknologi yang mencetak generasi
                unggul, berakhlak mulia, dan siap menghadapi masa depan.
              </p>
              <div className="mt-4 md:mt-5 flex items-center gap-2 md:gap-3">
                {[Facebook, Instagram, Youtube].map((I, i) => (
                  <a key={i} href="#" className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-white/10 hover:bg-accent hover:scale-110 grid place-items-center transition-all duration-300" aria-label="Social">
                    <I className="h-3 w-3 md:h-4 md:w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="font-display font-bold text-base md:text-lg mb-4 md:mb-5">Tautan Cepat</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm opacity-85">
                {[
                  ["Beranda", "#beranda"], ["Profil Sekolah", "#profil"], ["Fasilitas", "#fasilitas"],
                  ["Berita", "#berita"], ["Galeri", "#galeri"],
                ].map(([l, h]) => (
                  <li key={l}><a href={h} className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="col-span-1">
              <h4 className="font-display font-bold text-base md:text-lg mb-4 md:mb-5">Informasi PPDB</h4>
              <ul className="space-y-2 md:space-y-3 text-xs md:text-sm opacity-85">
                {["Pendaftaran Online", "Syarat & Ketentuan", "Jadwal Seleksi", "Biaya Pendidikan", "FAQ"].map((l) => (
                  <li key={l}><a href="/ppdb" className="hover:text-accent hover:translate-x-1 inline-block transition-all duration-300">{l}</a></li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="font-display font-bold text-base md:text-lg mb-4 md:mb-5">Kontak</h4>
              <ul className="space-y-3 md:space-y-4 text-xs md:text-sm opacity-85">
                <li className="flex gap-2 md:gap-3"><MapPin className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-accent" /> Jl. Raya Semplak Jl. Cemplang Utara No.276, Cilendek Bar., Bogor Barat</li>
                <li className="flex gap-2 md:gap-3"><Phone className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-accent" /> (0251) 123-4567</li>
                <li className="flex gap-2 md:gap-3"><Mail className="h-4 w-4 md:h-5 md:w-5 shrink-0 text-accent" /> info@smppgri8bogor.sch.id</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-eduka py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs md:text-sm opacity-80">
            <p>&copy; 2026 SMP PGRI 8 Kota Bogor. Hak Cipta Dilindungi.</p>
            <a href="/admin/login" className="hover:text-accent hover:opacity-100 transition-all duration-300">
              Admin
            </a>
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
            className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 h-10 w-10 md:h-14 md:w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 grid place-items-center transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-4 w-4 md:h-6 md:w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
