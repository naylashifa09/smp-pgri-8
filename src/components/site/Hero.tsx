import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/gambar-sekolah.jpg";

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);

  const titleWords = ["Bangun", "Masa Depan", "Bersama Kami"];

  return (
    <section id="beranda" className="relative overflow-hidden" style={{ minHeight: "620px", maxHeight: "780px", height: "80vh" }}>
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={heroImg}
          alt="Gedung SMP PGRI 8 Bogor"
          className="w-full h-full object-cover object-center"
          width={1440}
          height={810}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </motion.div>

      <div className="relative container-eduka h-full flex items-center py-16 md:py-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-6"
          >
            SMP PGRI 8 — Kota Bogor
          </motion.p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
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
            className="mt-6 text-white/70 text-base md:text-lg max-w-md leading-relaxed"
          >
            Sekolah menengah pertama modern di Kota Bogor yang mencetak generasi
            cerdas, berkarakter, dan siap menghadapi era digital.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-8 flex flex-wrap gap-3"
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

      {/* Wave transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg
          viewBox="0 0 1440 70"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full block"
          style={{ height: "70px" }}
        >
          <path
            d="M0,35 C240,70 480,0 720,35 C960,70 1200,0 1440,35 L1440,70 L0,70 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
