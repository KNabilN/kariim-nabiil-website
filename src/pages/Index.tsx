import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Courses from "@/components/Courses";
import TrustedBy from "@/components/TrustedBy";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <TrustedBy />
        <Courses />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
