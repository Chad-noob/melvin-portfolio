import { startTransition, useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import Loader from "../components/Loader/Loader";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Work from "../components/Work/Work";
import Projects from "../components/Projects/Projects";
import TechStack from "../components/TechStack/TechStack";
import Contact from "../components/Contact/Contact";
import profileImg from "../assets/potfolio.jpeg";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [showDeferredSections, setShowDeferredSections] = useState(false);

  const finishLoading = () => {
    setLoaderComplete(true);
  };

  useEffect(() => {
    let isMounted = true;
    const image = new window.Image();

    const markReady = () => {
      if (isMounted) {
        setHeroReady(true);
      }
    };

    image.src = profileImg;

    if (image.complete) {
      if (typeof image.decode === "function") {
        image.decode().then(markReady).catch(markReady);
      } else {
        markReady();
      }
    } else {
      image.onload = () => {
        if (typeof image.decode === "function") {
          image.decode().then(markReady).catch(markReady);
        } else {
          markReady();
        }
      };
      image.onerror = markReady;
    }

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (loaderComplete && heroReady) {
      setLoading(false);
    }
  }, [heroReady, loaderComplete]);

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

      window.lenis = lenis;

      let rafId;
      let deferredMountTimer;
      function raf(time) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);

      deferredMountTimer = window.setTimeout(() => {
        startTransition(() => {
          setShowDeferredSections(true);
        });
      }, 120);

      return () => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(deferredMountTimer);
        window.lenis = null;
        lenis.destroy();
      };
    }

    setShowDeferredSections(false);
  }, [loading]);

  return (
    <>
      {loading && <Loader finishLoading={finishLoading} />}
      {!loading && (
        <>
          <Navbar />
          <Hero />
          <About />
          {showDeferredSections && (
            <>
              <Work />
              <Projects />
              <TechStack />
              <Contact />
            </>
          )}
        </>
      )}
    </>
  );
}
