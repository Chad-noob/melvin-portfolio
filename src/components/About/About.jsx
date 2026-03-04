import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const linesRef = useRef([]);
  const arrowsRef = useRef([]);

  useEffect(() => {
    const lines = linesRef.current;
    const arrows = arrowsRef.current;

    lines.forEach((line, index) => {
      const arrow = arrows[index];

      // Create a container div to animate both text and arrow together
      const container = line.parentElement;

      // Combined blur animation for both text and arrow
      gsap.fromTo(
        [line, arrow],
        {
          filter: "blur(10px)",
          opacity: 0.3,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: container,
            start: "top 70%",
            end: "top 50%",
            scrub: true,
          },
        }
      );

      // Blur back when scrolling past - both elements together
      gsap.fromTo(
        [line, arrow],
        {
          filter: "blur(0px)",
          opacity: 1,
        },
        {
          filter: "blur(10px)",
          opacity: 0.3,
          scrollTrigger: {
            trigger: container,
            start: "top 50%",
            end: "top 30%",
            scrub: true,
          },
        }
      );
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
          <div key={index} className="flex items-start gap-6 mb-16 group">
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
            >
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
