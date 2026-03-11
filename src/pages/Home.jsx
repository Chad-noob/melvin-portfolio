import { useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Loader from "../components/Loader/Loader";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Work from "../components/Work/Work";
import TechStack from "../components/TechStack/TechStack";
import Contact from "../components/Contact/Contact";

export default function Home() {
  const [loading, setLoading] = useState(true);

  const finishLoading = () => {
    setLoading(false);
  };

  // Only enable smooth scroll after loading
  useEffect(() => {
    if (!loading) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
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
          <TechStack />
          <Contact />
        </>
      )}
    </>
  );
}
