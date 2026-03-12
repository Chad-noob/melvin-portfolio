import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import profileImg from "../../assets/potfolio.jpeg";
import TextSlider from "../TextSlider/TextSlider";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const nameWordsRef = useRef([]);
  const locationRef = useRef(null);
  const roleRef = useRef(null);
  const arrowRef = useRef(null);
  const imageRef = useRef(null);
  const heroSectionRef = useRef(null);
  const nameContainerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        nameWordsRef.current,
        {
          y: 100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.15,
          delay: 0.5,
        }
      );

      gsap.from(locationRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.5,
      });

      gsap.from(roleRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.6,
      });

      gsap.from(arrowRef.current, {
        y: -50,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.7,
      });

      gsap.from(imageRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.3,
      });

      gsap.to(nameContainerRef.current, {
        y: -200,
        scale: 0.3,
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: "80% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, heroSectionRef);

    return () => ctx.revert();
  }, []);

  const roleSlides = [
    <>
      <span className="block">Freelance</span>
      <span className="block">Developer</span>
    </>,
    <>
      <span className="block">Creative</span>
      <span className="block">Designer</span>
    </>,
    <>
      <span className="block">Full Stack</span>
      <span className="block">Developer</span>
    </>,
  ];

  return (
    <section
      ref={heroSectionRef}
      className="relative h-screen overflow-hidden bg-[#c5c5c5]"
    >
      {/* Location Badge */}
      <div
        ref={locationRef}
        className="absolute top-[18%] left-0 z-20 flex items-center gap-2 rounded-r-full bg-[#1a1a1a] px-4 py-2 text-white sm:gap-3 sm:px-6 sm:py-3 md:gap-4 md:px-8 md:py-4"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <svg
            className="h-4 w-4 animate-spin sm:h-5 sm:w-5 md:h-6 md:w-6"
            style={{ animationDuration: "3s" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="text-left leading-tight">
          <p className="text-[10px] opacity-80 sm:text-xs">Located</p>
          <p className="text-[10px] opacity-80 sm:text-xs">in</p>
          <p className="text-xs font-medium sm:text-sm">India</p>
        </div>
      </div>

      {/* Arrow */}
      <div
        ref={arrowRef}
        className="absolute top-[12%] right-[6%] z-20 scale-75 sm:scale-100"
      >
        <svg
          className="h-6 w-6 text-white sm:h-8 sm:w-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>

      {/* Role Text */}
      <div
        ref={roleRef}
        className="absolute top-[18%] right-[6%] z-20 flex justify-end"
      >
        <div className="w-[220px] sm:w-[260px] md:w-[320px] lg:w-[360px]">
          <TextSlider
            items={roleSlides.map((slide, index) => (
              <div
                key={index}
                className="flex h-[120px] sm:h-[140px] md:h-[160px] lg:h-[180px] w-full items-center justify-end"
              >
                <div className="text-right text-[#1f1f1f] font-light leading-[0.9] tracking-[-0.03em] text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  {slide}
                </div>
              </div>
            ))}
            className="h-[120px] overflow-hidden sm:h-[140px] md:h-[160px] lg:h-[180px]"
          />
        </div>
      </div>

      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 h-full w-full"
      >
        <img
          src={profileImg}
          alt="Profile"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/15" />
      </div>

      {/* Large Name */}
      <div
        ref={nameContainerRef}
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 px-2 sm:px-4"
      >
        <div className="flex gap-[2vw]">
          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[0] = el)}
              className="leading-[0.85] tracking-tight text-[13vw] font-bold uppercase text-white"
            >
              MELVIN
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[1] = el)}
              className="leading-[0.85] tracking-tight text-[13vw] font-bold uppercase text-white"
            >
              GEORGE
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}