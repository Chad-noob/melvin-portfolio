import { useState, useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import Loader from "../components/Loader/Loader";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";

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
          <section className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center">
            <h2 className="text-6xl font-bold">Work Section</h2>
          </section>
        </>
      )}
    </>
  );
}
