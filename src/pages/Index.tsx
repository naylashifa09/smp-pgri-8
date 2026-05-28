import TopBar from "@/components/site/TopBar";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import About from "@/components/site/About";
import Stats from "@/components/site/Stats";
import Facilities from "@/components/site/Facilities";
import News from "@/components/site/News";
import Gallery from "@/components/site/Gallery";
import FAQ from "@/components/site/FAQ";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <Hero />
      <About />
      <Stats />
      <Facilities />
      <News />
      <Gallery />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
