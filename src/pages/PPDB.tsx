import TopBar from "@/components/site/TopBar";
import Navbar from "@/components/site/Navbar";
import PPDBForm from "@/components/site/PPDBForm";
import Footer from "@/components/site/Footer";

const PPDB = () => {
  return (
    <main className="min-h-screen bg-background">
      <TopBar />
      <Navbar />
      <PPDBForm />
      <Footer />
    </main>
  );
};

export default PPDB;
