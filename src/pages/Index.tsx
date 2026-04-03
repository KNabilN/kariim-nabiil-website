import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import TrustedBy from "@/components/TrustedBy";
import Courses from "@/components/Courses";
import CourseCTA from "@/components/CourseCTA";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <About />
        <Projects />
        <Experience />
        <TrustedBy />
        <Courses />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
