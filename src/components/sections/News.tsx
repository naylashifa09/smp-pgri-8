import { useState, useCallback, useEffect } from "react";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getBerita, type Berita } from "@/services/supabase/queries";
import news1 from "@/assets/images/news/news-1.jpg";
import news2 from "@/assets/images/news/news-2.jpg";
import news3 from "@/assets/images/news/news-3.jpg";

// Fallback images cycling untuk berita tanpa thumbnail
const fallbackImages = [news1, news2, news3];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const News = () => {
  const [berita, setBerita] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    getBerita(6)
      .then(setBerita)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setActiveSlide(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      setActiveSlide(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
      setActiveSlide(emblaApi.selectedScrollSnap());
    }
  }, [emblaApi]);

  const totalSlides = Math.ceil(berita.length / 3);

  return (
    <section id="berita" className="section-pad bg-secondary/30">
      <div className="container-eduka">
        <ScrollReveal animation="slide-up">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 md:gap-4 mb-8 md:mb-10">
            <div>
              <p className="text-accent font-semibold text-xs md:text-sm uppercase tracking-wider">Berita & Pengumuman</p>
              <h2 className="mt-2 text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-foreground">
                Kabar Terbaru dari Sekolah
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={scrollPrev}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground grid place-items-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
              </button>
              <button
                onClick={scrollNext}
                className="h-8 w-8 md:h-10 md:w-10 rounded-full border border-border bg-card hover:bg-primary hover:text-primary-foreground grid place-items-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl md:rounded-2xl border border-border h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4 md:gap-6">
                {berita.map((n, i) => (
                  <article key={n.id} className="flex-[0_0_100%] sm:flex-[0_0_calc(50%-8px)] md:flex-[0_0_calc(50%-10px)] lg:flex-[0_0_calc(33.333%-12px)] min-w-0">
                    <div className="bg-card rounded-xl md:rounded-2xl overflow-hidden border border-border shadow-card hover:shadow-elevated transition-shadow h-full flex flex-col">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={n.thumbnail_url ?? fallbackImages[i % fallbackImages.length]}
                          alt={n.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImages[i % fallbackImages.length]; }}
                        />
                        {n.category && (
                          <span className="absolute top-3 md:top-4 left-3 md:left-4 px-2 md:px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-xs font-bold text-foreground">
                            {n.category}
                          </span>
                        )}
                      </div>
                      <div className="p-4 md:p-5 flex flex-col flex-1">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 md:mb-3">
                          <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5" />
                          {formatDate(n.published_at)}
                        </div>
                        <h3 className="font-display font-bold text-sm md:text-base text-foreground leading-snug mb-2 md:mb-3 line-clamp-2">
                          {n.title}
                        </h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 mb-3 md:mb-4 flex-1">
                          {n.excerpt}
                        </p>
                        <a href={`/berita/${n.slug}`} className="inline-flex items-center gap-1.5 md:gap-2 text-primary font-semibold text-xs md:text-sm cursor-pointer hover:gap-2 md:hover:gap-3 transition-all">
                          Selengkapnya <ChevronRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6 md:mt-8">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    activeSlide === i ? "w-6 md:w-8 bg-primary" : "w-2 md:w-2.5 bg-border"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => emblaApi?.scrollTo(i * 3)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default News;
