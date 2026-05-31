import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBeritaBySlug, getRelatedBerita, type Berita } from "@/services/supabase/queries";
import news1 from "@/assets/images/news/news-1.jpg";
import news2 from "@/assets/images/news/news-2.jpg";
import news3 from "@/assets/images/news/news-3.jpg";

const fallbackImages = [news1, news2, news3];

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const BeritaDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Berita | null>(null);
  const [related, setRelated] = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    getBeritaBySlug(slug)
      .then((data) => {
        setArticle(data);
        return getRelatedBerita(slug);
      })
      .then(setRelated)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  return (
    <main className="min-h-screen bg-background">
      <TopBar />
      <Navbar />

      <div className="container-eduka py-8 md:py-12 lg:py-16 max-w-4xl">
        {/* Back link */}
        <Link
          to="/#berita"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 md:mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Berita
        </Link>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-secondary rounded w-3/4" />
            <div className="h-4 bg-secondary rounded w-1/4" />
            <div className="aspect-[16/9] bg-secondary rounded-2xl" />
            <div className="space-y-2">
              {[1,2,3,4,5].map(i => <div key={i} className="h-4 bg-secondary rounded" />)}
            </div>
          </div>
        ) : notFound || !article ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📰</p>
            <h1 className="text-2xl font-bold text-foreground mb-2">Berita tidak ditemukan</h1>
            <p className="text-muted-foreground mb-6">Berita yang kamu cari tidak ada atau sudah dihapus.</p>
            <Link to="/" className="text-primary hover:underline font-medium">Kembali ke Beranda</Link>
          </div>
        ) : (
          <>
            {/* Article header */}
            <article>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {article.category && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                    <Tag className="h-3 w-3" />
                    {article.category}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(article.published_at)}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight mb-6">
                {article.title}
              </h1>

              {/* Thumbnail */}
              <div className="aspect-[16/9] overflow-hidden rounded-xl md:rounded-2xl mb-8 bg-secondary">
                <img
                  src={article.thumbnail_url ?? fallbackImages[0]}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImages[0]; }}
                />
              </div>

              {/* Excerpt */}
              {article.excerpt && (
                <p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed border-l-4 border-primary pl-4 mb-8">
                  {article.excerpt}
                </p>
              )}

              {/* Content */}
              <div className="prose prose-sm md:prose-base max-w-none text-foreground leading-relaxed">
                {article.content.split("\n").map((paragraph, i) =>
                  paragraph.trim() ? (
                    <p key={i} className="mb-4 text-foreground/90">
                      {paragraph}
                    </p>
                  ) : (
                    <br key={i} />
                  )
                )}
              </div>
            </article>

            {/* Related articles */}
            {related.length > 0 && (
              <div className="mt-12 md:mt-16 pt-8 border-t border-border">
                <h2 className="text-xl font-bold text-foreground mb-6">Berita Lainnya</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {related.map((item, i) => (
                    <Link
                      key={item.id}
                      to={`/berita/${item.slug}`}
                      className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-secondary">
                        <img
                          src={item.thumbnail_url ?? fallbackImages[i % fallbackImages.length]}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallbackImages[i % fallbackImages.length]; }}
                        />
                      </div>
                      <div className="p-4">
                        {item.category && (
                          <span className="text-xs font-semibold text-primary">{item.category}</span>
                        )}
                        <h3 className="font-bold text-sm text-foreground leading-snug mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-primary font-medium">
                          Baca selengkapnya <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default BeritaDetail;
