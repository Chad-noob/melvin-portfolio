import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const linesRef = useRef([]);
  const arrowsRef = useRef([]);
  const animationRefs = useRef([]);
  const activeStates = useRef([]);

  const playAnimation = (index, element) => {
    const children = element.children;
    
    // Different animation for each point
    switch(index) {
      case 0: // Interactive digital experiences - cursor ripple
        gsap.fromTo(children[0], { scale: 0 }, { scale: 1.3, duration: 0.4, ease: "back.out(2)" });
        gsap.fromTo(children[1], { scale: 0.5, opacity: 0.9 }, { scale: 3.5, opacity: 0, duration: 1, ease: "power2.out" });
        gsap.fromTo(children[2], { scale: 0.3, opacity: 0.7 }, { scale: 2.5, opacity: 0, duration: 0.9, delay: 0.15, ease: "power2.out" });
        break;
      
      case 1: // Design, motion, technology - orbiting circles
        Array.from(children).forEach((circle, i) => {
          gsap.fromTo(
            circle,
            { rotation: i * 120, scale: 0, x: 0, y: 0 },
            { rotation: i * 120 + 360, scale: 1.5, duration: 1.2, ease: "power2.inOut", repeat: 1, yoyo: true }
          );
        });
        break;
      
      case 2: // Automobiles - speed gauge
        gsap.fromTo(children[0], { rotation: -90 }, { rotation: 90, duration: 0.8, ease: "elastic.out(1, 0.5)" });
        gsap.fromTo(children[1], { scaleX: 0 }, { scaleX: 1.2, duration: 0.6, ease: "power3.out" });
        gsap.fromTo(children[1], { opacity: 1 }, { opacity: 0.3, duration: 0.3, delay: 0.5 });
        break;
      
      case 3: // Guitar - sound waves
        gsap.fromTo(children[0], { scaleY: 1 }, { scaleY: 1.8, duration: 0.08, repeat: 8, yoyo: true, ease: "sine.inOut" });
        Array.from(children).slice(1).forEach((wave, i) => {
          gsap.fromTo(
            wave,
            { scaleX: 0, scaleY: 0, opacity: 0.9 },
            { scaleX: 1.5, scaleY: 1.5, opacity: 0, duration: 0.8, delay: i * 0.12, ease: "power2.out" }
          );
        });
        break;
      
      case 4: // Exploring technologies - particle burst
        Array.from(children).forEach((particle, i) => {
          const angle = (i / children.length) * Math.PI * 2;
          const distance = 50;
          gsap.fromTo(
            particle,
            { x: 0, y: 0, scale: 1.5, opacity: 1 },
            {
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: 0,
              opacity: 0,
              duration: 1,
              ease: "power3.out"
            }
          );
        });
        break;
    }
  };

  useEffect(() => {
    const lines = linesRef.current;
    const arrows = arrowsRef.current;
    const animations = animationRefs.current;

    // Set initial blurred state immediately
    lines.forEach((line, index) => {
      if (line) {
        gsap.set(line, { filter: "blur(10px)", opacity: 0.3 });
      }
      if (arrows[index]) {
        gsap.set(arrows[index], { filter: "blur(10px)", opacity: 0.3 });
      }
    });

    lines.forEach((line, index) => {
      const arrow = arrows[index];
      const animation = animations[index];
      const container = line.parentElement;
      activeStates.current[index] = false;

      // Optimized ScrollTrigger with simple opacity-only animation
      gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top 85%",
          end: "top 15%",
          scrub: 1,
          onUpdate: (self) => {
            // Simple opacity transition without expensive blur calculations
            const progress = self.progress;
            const opacity = progress < 0.5 ? 0.3 + (progress * 1.4) : 1 - ((progress - 0.5) * 1.4);
            line.style.opacity = Math.max(0.3, Math.min(1, opacity));
            arrow.style.opacity = Math.max(0.3, Math.min(1, opacity));
            
            // Apply blur only at extremes to reduce calculations
            if (progress < 0.15 || progress > 0.85) {
              line.style.filter = "blur(10px)";
              arrow.style.filter = "blur(10px)";
            } else {
              line.style.filter = "none";
              arrow.style.filter = "none";
            }
          }
        }
      });

      // Simple trigger for animation state
      if (animation) {
        ScrollTrigger.create({
          trigger: container,
          start: "top 65%",
          end: "top 35%",
          onToggle: (self) => {
            activeStates.current[index] = self.isActive;
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const handleArrowHover = (index, isHovering) => {
    const arrow = arrowsRef.current[index];
    if (arrow) {
      // Simplified hover animation without GSAP for better performance
      arrow.style.transform = isHovering ? 'translateX(15px) scale(1.1)' : 'translateX(0) scale(1)';
      arrow.style.transition = 'transform 0.3s ease';
    }
  };

  const textLines = [
    "A developer passionate about building interactive digital experiences.",
    "I enjoy combining design, motion, and technology to create modern web applications.",
    "Outside of coding, I'm deeply interested in automobiles and automotive engineering.",
    "Music is also a big part of my life, and I enjoy playing the guitar.",
    "I'm always exploring new technologies and pushing myself to build better digital experiences.",
  ];

  return (
    <section id="about" className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 relative" style={{ transform: "translateZ(0)" }}>
      {/* Download Resume Button - Top Right */}
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 z-20 group cursor-pointer"
      >
        <div className="relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 bg-black text-white font-medium text-xs sm:text-sm rounded-full overflow-hidden transition-all duration-300 hover:scale-110 hover:shadow-xl">
          {/* Animated background - subtle dark gray */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Sliding underline effect */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 transition-all duration-300"></div>
          
          {/* Button text */}
          <span className="relative z-10 flex items-center gap-1.5">
            Resume
            <svg 
              className="w-4 h-4 transform group-hover:translate-y-0.5 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </span>
        </div>
      </a>

      <div className="max-w-6xl w-full relative z-10">
        {textLines.map((text, index) => (
          <div key={index} className="flex items-start justify-between gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12 md:mb-16 group">
            {/* Arrow for each point */}
            <div 
              ref={(el) => (arrowsRef.current[index] = el)}
              className="flex-shrink-0 mt-1 sm:mt-2 cursor-pointer"
              style={{ filter: "blur(10px)", opacity: 0.3, willChange: "filter, opacity" }}
              onMouseEnter={() => handleArrowHover(index, true)}
              onMouseLeave={() => handleArrowHover(index, false)}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                className="sm:w-9 sm:h-9 md:w-10 md:h-10 text-gray-800"
              >
                <path
                  d="M5 12H19M19 12L12 5M19 12L12 19"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <p
              ref={(el) => (linesRef.current[index] = el)}
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-relaxed text-gray-800 flex-1"
              style={{ filter: "blur(10px)", opacity: 0.3, willChange: "filter, opacity" }}
              onMouseEnter={() => {
                if (activeStates.current[index]) {
                  const animation = animationRefs.current[index];
                  if (animation) {
                    gsap.to(animation, { opacity: 1, duration: 0.3 });
                    playAnimation(index, animation);
                  }
                }
              }}
              onMouseLeave={() => {
                if (activeStates.current[index]) {
                  const animation = animationRefs.current[index];
                  if (animation) {
                    gsap.to(animation, { opacity: 0, duration: 0.3 });
                  }
                }
              }}
            >
              {text}
            </p>

            {/* Animation container on the right */}
            <div 
              ref={(el) => (animationRefs.current[index] = el)}
              className="flex-shrink-0 w-32 h-32 relative flex items-center justify-center pointer-events-none"
              style={{ opacity: 0 }}
            >
              {index === 0 && (
                <>
                  <div className="w-5 h-5 bg-blue-500 rounded-full absolute" />
                  <div className="w-5 h-5 bg-blue-400 rounded-full absolute border-3 border-blue-500" />
                  <div className="w-5 h-5 bg-blue-300 rounded-full absolute border-2 border-blue-400" />
                </>
              )}
              {index === 1 && (
                <>
                  <div className="w-4 h-4 bg-purple-500 rounded-full absolute" style={{ transformOrigin: "0 30px" }} />
                  <div className="w-4 h-4 bg-pink-500 rounded-full absolute" style={{ transformOrigin: "0 30px" }} />
                  <div className="w-4 h-4 bg-blue-500 rounded-full absolute" style={{ transformOrigin: "0 30px" }} />
                </>
              )}
              {index === 2 && (
                <>
                  <div className="w-1.5 h-14 bg-red-500 rounded-full absolute" style={{ transformOrigin: "bottom center" }} />
                  <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 absolute rounded-full" style={{ transformOrigin: "left" }} />
                </>
              )}
              {index === 3 && (
                <>
                  <div className="w-1 h-16 bg-amber-600 absolute rounded-full" />
                  <div className="w-14 h-8 border-2 border-amber-500 rounded-full absolute" />
                  <div className="w-20 h-12 border-2 border-amber-400 rounded-full absolute" />
                  <div className="w-24 h-16 border-2 border-amber-300 rounded-full absolute" />
                </>
              )}
              {index === 4 && (
                <>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full absolute" />
                  <div className="w-4 h-4 bg-orange-400 rounded-full absolute" />
                  <div className="w-4 h-4 bg-red-400 rounded-full absolute" />
                  <div className="w-4 h-4 bg-pink-400 rounded-full absolute" />
                  <div className="w-4 h-4 bg-purple-400 rounded-full absolute" />
                  <div className="w-4 h-4 bg-blue-400 rounded-full absolute" />
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute" />
                  <div className="w-3 h-3 bg-cyan-400 rounded-full absolute" />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
