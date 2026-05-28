import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Beranda", href: "#beranda" },
  { label: "Profil", href: "#profil" },
  { label: "Fasilitas", href: "#fasilitas" },
  { label: "Berita", href: "#berita" },
  { label: "Galeri", href: "#galeri" },
  { label: "Kontak", href: "#kontak" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-soft">
      <div className="container-eduka flex items-center justify-between h-20">
        <a href="#beranda" className="flex items-center gap-2.5">
          <img src="/logo-smp-pgri8.svg" alt="Logo SMP PGRI 8" className="h-12 w-auto" />
          <div className="leading-tight">
            <div className="font-display font-extrabold text-lg text-primary-deep">SMP PGRI 8</div>
            <div className="text-xs text-muted-foreground">Kota Bogor</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href}
              className="px-4 py-2 rounded-md text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="cta" size="lg" asChild>
            <a href="/ppdb">Daftar PPDB</a>
          </Button>
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn(
        "lg:hidden overflow-hidden transition-all duration-300 border-t border-border",
        open ? "max-h-96" : "max-h-0"
      )}>
        <nav className="container-eduka flex flex-col py-4 gap-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-md text-sm font-medium hover:text-primary transition-colors">
              {l.label}
            </a>
          ))}
          <Button variant="cta" size="lg" className="mt-2" asChild>
            <a href="/ppdb" onClick={() => setOpen(false)}>Daftar PPDB</a>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
