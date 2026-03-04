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

    lines.forEach((line, index) => {
      const arrow = arrows[index];
      const animation = animations[index];
      const container = line.parentElement;
      activeStates.current[index] = false;

      // Combined blur animation for text and arrow
      gsap.to(
        [line, arrow],
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "top 50%",
            scrub: true,
            immediateRender: false,
          },
        }
      );

      // Blur back when scrolling past
      gsap.to(
        [line, arrow],
        {
          filter: "blur(10px)",
          opacity: 0.3,
          scrollTrigger: {
            trigger: container,
            start: "top 50%",
            end: "top 30%",
            scrub: true,
            immediateRender: false,
          },
        }
      );

      // Trigger animation when line is in focus
      if (animation) {
        ScrollTrigger.create({
          trigger: container,
          start: "top 60%",
          end: "top 40%",
          onEnter: () => {
            activeStates.current[index] = true;
            playAnimation(index, animation);
          },
          onLeave: () => {
            activeStates.current[index] = false;
          },
          onEnterBack: () => {
            activeStates.current[index] = true;
            playAnimation(index, animation);
          },
          onLeaveBack: () => {
            activeStates.current[index] = false;
          },
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
      gsap.to(arrow, {
        x: isHovering ? 20 : 0,
        scale: isHovering ? 1.2 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const textLines = [
    "a developer passionate about building interactive digital experiences.",
    "I enjoy combining design, motion, and technology to create modern web applications.",
    "Outside of coding, I'm deeply interested in automobiles and automotive engineering.",
    "Music is also a big part of my life, and I enjoy playing the guitar.",
    "I'm always exploring new technologies and pushing myself to build better digital experiences.",
  ];

  return (
    <section id="about" className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-8 py-20">
      <div className="max-w-6xl w-full">
        {textLines.map((text, index) => (
          <div key={index} className="flex items-start justify-between gap-8 mb-16 group">
            {/* Arrow for each point */}
            <div 
              ref={(el) => (arrowsRef.current[index] = el)}
              className="flex-shrink-0 mt-2 cursor-pointer"
              style={{ filter: "blur(10px)", opacity: 0.3 }}
              onMouseEnter={() => handleArrowHover(index, true)}
              onMouseLeave={() => handleArrowHover(index, false)}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-800"
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
              style={{ filter: "blur(10px)", opacity: 0.3 }}
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
