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
      // Initial load animations - Name with slide up effect
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

      // Scroll-based animations with ScrollTrigger
      // Image stays static - no scroll animation

      // Name slides up and scales down (bundles up) on scroll
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

      // Location, role, and arrow stay visible - no scroll animation
      // They only animate on initial load
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroSectionRef} className="relative h-screen bg-[#c5c5c5] overflow-hidden">
      {/* Location Badge */}
      <div
        ref={locationRef}
        className="absolute top-[18%] left-0 bg-[#1a1a1a] text-white rounded-r-full px-8 py-4 flex items-center gap-4 z-10"
      >
        <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 animate-spin"
            style={{ animationDuration: '3s' }}
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
        <div className="text-left">
          <p className="text-xs opacity-80">Located</p>
          <p className="text-xs opacity-80">in</p>
          <p className="text-sm font-medium">India</p>
        </div>
      </div>

      {/* Role Text with Vertical Slider */}
      <div
        ref={roleRef}
        className="absolute top-[18%] right-[5%] text-right z-10"
      >
        <TextSlider
          items={[
            <p className="text-gray-800 text-5xl font-light leading-tight">
              Freelance<br />Developer
            </p>,
            <p className="text-gray-800 text-5xl font-light leading-tight">
              Creative<br />Designer
            </p>,
            <p className="text-gray-800 text-5xl font-light leading-tight">
              Full Stack<br />Developer
            </p>,
          ]}
          className="h-[120px]"
        />
      </div>

      {/* Arrow */} 
      <div
        ref={arrowRef}
        className="absolute top-[12%] right-[5%] z-10"
      >
        <svg
          className="w-8 h-8 text-white"
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

      {/* Photo with scroll effect */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full"
      >
        <img
          src={profileImg}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Large Name Text with scroll reveal and stagger */}
      <div 
        ref={nameContainerRef}
        className="absolute bottom-0 left-0 right-0 pointer-events-none px-4 z-10"
      >
        <div className="flex gap-[2vw]">
          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[0] = el)}
              className="text-[13vw] font-bold text-white uppercase leading-[0.85] tracking-tight"
            >
              MELVIN
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1
              ref={(el) => (nameWordsRef.current[1] = el)}
              className="text-[13vw] font-bold text-white uppercase leading-[0.85] tracking-tight"
            >
              GEORGE
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
