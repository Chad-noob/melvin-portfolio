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
        { y: 100, opacity: 0 },
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
        x: -60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.4,
      });

      gsap.from(roleRef.current, {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.5,
      });

      gsap.from(arrowRef.current, {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        delay: 0.6,
      });

      gsap.from(imageRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      gsap.to(nameContainerRef.current, {
        y: -120,
        scale: 0.45,
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
      {/* Background image */}
      <div ref={imageRef} className="absolute inset-0 h-full w-full">
        <img
          src={profileImg}
          alt="Profile"
          className="h-full w-full object-cover object-[58%_center] sm:object-center"
        />
        <div className="absolute inset-0 bg-black/10 sm:bg-black/15" />
      </div>

      {/* Location badge */}
      <div
        ref={locationRef}
        className="absolute left-0 top-[30%] z-20 flex items-center gap-2 rounded-r-full bg-[#111111] px-3 py-2 text-white shadow-lg sm:top-[18%] sm:gap-3 sm:px-6 sm:py-3 md:px-8 md:py-4"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 sm:h-10 sm:w-10 md:h-12 md:w-12">
          <svg
            className="h-3.5 w-3.5 sm:h-5 sm:w-5 md:h-6 md:w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.7}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <div className="leading-tight text-left">
          <p className="text-[9px] opacity-75 sm:text-xs">Located</p>
          <p className="text-[9px] opacity-75 sm:text-xs">in</p>
          <p className="text-[13px] font-semibold sm:text-sm">India</p>
        </div>
      </div>

      {/* Arrow */}
      <div
        ref={arrowRef}
        className="absolute right-4 top-[24%] z-20 sm:right-[6%] sm:top-[12%]"
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

      {/* Role text */}
      <div
        ref={roleRef}
        className="absolute right-4 top-[34%] z-20 sm:right-[6%] sm:top-[18%]"
      >
        <div className="w-[130px] sm:w-[260px] md:w-[320px] lg:w-[360px]">
          <TextSlider
            items={roleSlides.map((slide, index) => (
              <div
                key={index}
                className="flex h-[90px] w-full items-center justify-end sm:h-[140px] md:h-[160px] lg:h-[180px]"
              >
                <div className="text-right font-light leading-[0.9] tracking-[-0.04em] text-[#1f1f1f] text-[18px] sm:text-4xl md:text-5xl lg:text-6xl">
                  {slide}
                </div>
              </div>
            ))}
            className="h-[90px] overflow-hidden sm:h-[140px] md:h-[160px] lg:h-[180px]"
          />
        </div>
      </div>

      {/* Name */}
      <div
        ref={nameContainerRef}
        className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 px-3 sm:bottom-0 sm:px-4"
      >
        <div className="flex flex-col gap-0 sm:flex-row sm:gap-[2vw]">
          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[0] = el)}
              className="text-[16vw] font-bold uppercase leading-[0.85] tracking-tight text-white sm:text-[13vw]"
            >
              MELVIN
            </h1>
          </div>

          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[1] = el)}
              className="text-[16vw] font-bold uppercase leading-[0.85] tracking-tight text-white sm:text-[13vw]"
            >
              GEORGE
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}