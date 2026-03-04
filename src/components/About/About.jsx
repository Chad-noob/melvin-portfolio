import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const linesRef = useRef([]);

  useEffect(() => {
    const lines = linesRef.current;

    lines.forEach((line, index) => {
      gsap.fromTo(
        line,
        {
          filter: "blur(10px)",
          opacity: 0.3,
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          scrollTrigger: {
            trigger: line,
            start: "top 60%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // Blur back when scrolling past
      gsap.to(line, {
        filter: "blur(10px)",
        opacity: 0.3,
        scrollTrigger: {
          trigger: line,
          start: "top 30%",
          end: "top 10%",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const textLines = [
    "a developer passionate about building interactive digital experiences.",
    "I enjoy combining design, motion, and technology to create modern web applications.",
    "Outside of coding, I'm deeply interested in automobiles and automotive engineering.",
    "Music is also a big part of my life, and I enjoy playing the guitar.",
    "I'm always exploring new technologies and pushing myself to build better digital experiences.",
  ];

  return (
    <section id="about" className="min-h-screen bg-white text-black flex flex-col items-center justify-center px-8 py-20">
      <div className="max-w-4xl w-full space-y-16">
        {textLines.map((text, index) => (
          <p
            key={index}
            ref={(el) => (linesRef.current[index] = el)}
            className="text-4xl md:text-5xl lg:text-6xl font-light leading-relaxed text-gray-800"
            style={{ filter: "blur(10px)", opacity: 0.3 }}
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
