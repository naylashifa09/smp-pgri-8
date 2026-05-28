import { Users, GraduationCap, UserCheck, Briefcase } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const stats = [
  { value: 850, label: "Total Siswa", icon: Users, highlighted: true },
  { value: 280, label: "Kelas VII", icon: GraduationCap, highlighted: false },
  { value: 290, label: "Kelas VIII", icon: GraduationCap, highlighted: false },
  { value: 280, label: "Kelas IX", icon: GraduationCap, highlighted: false },
  { value: 45, label: "Guru", icon: UserCheck, highlighted: false },
  { value: 12, label: "Staff", icon: Briefcase, highlighted: false },
];

const chartData = [
  { name: "Siswa", value: 850, color: "hsl(var(--primary))" },
  { name: "Kls VII", value: 280, color: "hsl(var(--primary))" },
  { name: "Kls VIII", value: 290, color: "hsl(var(--primary-soft))" },
  { name: "Kls IX", value: 280, color: "hsl(var(--primary-soft))" },
  { name: "Guru", value: 45, color: "hsl(var(--accent))" },
  { name: "Staff", value: 12, color: "hsl(var(--accent-soft))" },
];

const Stats = () => (
  <section className="section-pad bg-secondary/30">
    <div className="container-eduka">
      <ScrollReveal animation="slide-up">
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground mb-4">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Update Data Otomatis
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
            STATISTIK <span className="text-primary">SMP PGRI 8</span><br />
            <span className="text-primary">BOGOR</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg">
            Informasi jumlah siswa dan tenaga pendidik yang diperbarui secara sistematis untuk transparansi publik.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Stat Cards */}
        <div>
          {/* Highlighted card */}
          <ScrollReveal animation="scale">
            <div className="bg-primary text-primary-foreground rounded-2xl p-6 mb-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/20 grid place-items-center">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80">{stats[0].label}</p>
                  <div className="font-display font-extrabold text-4xl">
                    <AnimatedCounter end={stats[0].value} suffix="" duration={2000} />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Grid cards */}
          <div className="grid grid-cols-2 gap-4">
            {stats.slice(1).map((s, idx) => (
              <ScrollReveal key={s.label} animation="slide-up" delay={idx * 50}>
                <div className="bg-card rounded-2xl p-5 border border-border shadow-card">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-xl bg-primary-soft text-primary grid place-items-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <div className="font-display font-extrabold text-3xl text-foreground">
                    <AnimatedCounter end={s.value} suffix="" duration={2000} />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Right: Bar Chart */}
        <ScrollReveal animation="slide-left">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-card h-full">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-foreground">Distribusi Warga Sekolah</h3>
                <p className="text-sm text-muted-foreground mt-1">Komposisi berdasarkan tingkatan dan divisi</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/20 bg-primary-soft text-primary text-xs font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Sinkron
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 10 }}>
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={50} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default Stats;
