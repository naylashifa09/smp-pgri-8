import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { InteractiveMap } from "@/components/ui/interactive-map";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const Contact = () => (
  <section id="kontak" className="section-pad">
    <div className="container-eduka">
      <ScrollReveal animation="slide-up">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-accent font-semibold text-sm uppercase tracking-wider">Hubungi Kami</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-foreground">
            Kunjungi <span className="text-primary">Sekolah Kami</span>
          </h2>
        </div>
      </ScrollReveal>

      {/* Contact info bar */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: MapPin, t: "Alamat", d: "Jl. Raya Semplak Jl. Cemplang Utara No.276\nCilendek Bar., Bogor Barat, Jawa Barat 16114" },
          { icon: Phone, t: "Telepon", d: "(0251) 123-4567\n+62 812-3456-7890" },
          { icon: Mail, t: "Email", d: "info@smppgri8bogor.sch.id\nppdb@smppgri8bogor.sch.id" },
        ].map((c, idx) => (
          <ScrollReveal key={c.t} animation="slide-up" delay={idx * 100}>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-card hover:shadow-elevated hover:scale-105 transition-all duration-300 h-full">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-soft text-primary grid place-items-center shrink-0">
                  <c.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{c.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{c.d}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <ScrollReveal animation="slide-right" className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden shadow-card border border-border h-80 lg:h-[420px]">
            <InteractiveMap center={[-6.549, 106.762]} zoom={16} />
          </div>
        </ScrollReveal>
        <ScrollReveal animation="slide-left">
          <div className="bg-primary text-primary-foreground rounded-2xl p-8 shadow-card flex flex-col justify-center hover:scale-105 transition-transform duration-300">
            <Clock className="h-10 w-10 text-accent mb-4" />
            <h3 className="font-display font-bold text-2xl">Jam Operasional</h3>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ["Senin – Jumat", "07.00 – 15.00 WIB"],
                ["Sabtu", "07.00 – 12.00 WIB"],
                ["Minggu & Libur", "Tutup"],
              ].map(([d, h]) => (
                <div key={d} className="flex justify-between border-b border-white/15 pb-2">
                  <span className="text-white/80">{d}</span>
                  <span className="font-semibold">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default Contact;
