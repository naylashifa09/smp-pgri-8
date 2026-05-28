import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-students.jpg";

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  const titleWords = ["Bangun", "Masa Depan", "Bersama Kami"];

  return (
    <section id="beranda" className="relative overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={heroImg}
          alt="Siswa SMP PGRI 8 Bogor"
          className="w-full h-full object-cover"
          width={1600}
          height={1100}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </motion.div>

      <div className="relative container-eduka py-28 md:py-40 lg:py-48">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-6"
          >
            SMP PGRI 8 — Kota Bogor
          </motion.p>

          <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-extrabold text-white leading-[1.0] tracking-tight">
            {titleWords.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                className={`block ${i === 2 ? "text-accent" : ""}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-7 text-white/70 text-base md:text-lg max-w-md leading-relaxed"
          >
            Sekolah menengah pertama modern di Kota Bogor yang mencetak generasi
            cerdas, berkarakter, dan siap menghadapi era digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <Button variant="hero" size="xl" asChild className="hover:scale-105 transition-transform">
              <a href="/ppdb">
                Daftar PPDB Online <ArrowRight className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="heroOutline" size="xl" asChild className="hover:scale-105 transition-transform">
              <a href="#profil">Tentang Kami</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
