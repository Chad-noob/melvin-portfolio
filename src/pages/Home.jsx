import { useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Loader from "../components/Loader/Loader";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Work from "../components/Work/Work";
import Projects from "../components/Projects/Projects";
import TechStack from "../components/TechStack/TechStack";
import Contact from "../components/Contact/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const finishLoading = () => {
    setLoading(false);
  };

  // Optimized smooth scroll configuration after loading
  useEffect(() => {
    if (!loading) {
      const lenis = new Lenis({
        duration: 1.0,  // Reduced from 1.2 for faster response
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        lerp: 0.1,  // Added explicit lerp value for smoother interpolation
        touchMultiplier: 2,  // Better touch sensitivity
      });

      let rafId;
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
      };
    }
  }, [loading]);

  return (
    <>
      {loading && <Loader finishLoading={finishLoading} />}
      {!loading && (
        <>
          <Navbar />
          <Hero />
          {/* Add content sections for scrolling */}
          <About />
          <Work />
          <Projects />
          <TechStack />
          <Contact />
        </>
      )}
    </>
  );
}
