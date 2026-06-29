import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Facilities from "@/components/sections/Facilities";
import News from "@/components/sections/News";
import Gallery from "@/components/sections/Gallery";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/Chatbot";   // ← tambah ini

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
      <Chatbot />   // ← tambah ini
    </main>
  );
};

export default Index;
