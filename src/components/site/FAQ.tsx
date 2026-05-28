import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const faqs = [
  {
    q: "Bagaimana cara mendaftar di SMP PGRI 8 Bogor?",
    a: "Pendaftaran dapat dilakukan secara online melalui halaman PPDB di website kami. Isi formulir pendaftaran dengan lengkap, kemudian tim PPDB akan menghubungi Anda dalam 1x24 jam untuk konfirmasi.",
  },
  {
    q: "Berapa biaya pendidikan di SMP PGRI 8?",
    a: "SMP PGRI 8 menawarkan biaya pendidikan yang terjangkau dan ramah keluarga. Untuk informasi detail mengenai biaya SPP, uang pangkal, dan biaya lainnya, silakan hubungi bagian administrasi atau kunjungi halaman PPDB.",
  },
  {
    q: "Apa saja ekstrakurikuler yang tersedia?",
    a: "Kami menyediakan berbagai ekstrakurikuler meliputi: Basket, Futsal, Voli, Pramuka, PMR, Seni Musik, Seni Tari, Robotik, English Club, dan Jurnalistik. Siswa bebas memilih sesuai minat dan bakat.",
  },
  {
    q: "Apakah tersedia program beasiswa?",
    a: "Ya, kami menyediakan beasiswa prestasi untuk siswa berprestasi di bidang akademik maupun non-akademik. Beasiswa mencakup potongan biaya SPP hingga beasiswa penuh tergantung pencapaian siswa.",
  },
  {
    q: "Bagaimana jam operasional sekolah?",
    a: "Kegiatan belajar mengajar berlangsung Senin-Jumat pukul 07.00-15.00 WIB dan Sabtu pukul 07.00-12.00 WIB. Kegiatan ekstrakurikuler dilaksanakan setelah jam pelajaran berakhir.",
  },
  {
    q: "Apakah sekolah menyediakan fasilitas antar-jemput?",
    a: "Saat ini SMP PGRI 8 belum menyediakan layanan antar-jemput resmi. Namun lokasi sekolah mudah dijangkau dengan transportasi umum dan tersedia area parkir yang memadai untuk orang tua.",
  },
];

const FAQ = () => (
  <section id="faq" className="section-pad">
    <div className="container-eduka">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left - Header */}
        <ScrollReveal animation="slide-up">
          <div className="lg:sticky lg:top-32">
            <p className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-foreground">
              Pertanyaan yang<br />
              <span className="text-primary">Sering Ditanyakan</span>
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Temukan jawaban atas pertanyaan umum seputar pendaftaran, biaya, fasilitas, dan kegiatan di SMP PGRI 8 Kota Bogor.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Masih punya pertanyaan?{" "}
              <a href="#kontak" className="text-primary font-semibold hover:underline cursor-pointer">
                Hubungi kami
              </a>
            </p>
          </div>
        </ScrollReveal>

        {/* Right - Accordion */}
        <ScrollReveal animation="slide-left" delay={100}>
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`faq-${idx}`}
                className="bg-card rounded-2xl border border-border px-6 shadow-card data-[state=open]:shadow-elevated transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default FAQ;
