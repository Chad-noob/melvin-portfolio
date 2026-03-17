import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function TextSlider({
  items,
  className = "",
  slideClassName = "",
  pause = 1.8,
  duration = 0.9,
}) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const timelineRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;

    if (!wrapper || !content || items.length <= 1) return;

    const slides = Array.from(content.children);
    if (!slides.length) return;

    const getStep = () => slides[0].offsetHeight;

    const buildTimeline = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      gsap.set(content, { y: 0 });

      const step = getStep();
      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: "power4.inOut" },
      });

      for (let i = 1; i < slides.length; i++) {
        tl.to(content, {
          y: -i * step,
          duration,
          delay: pause,
        });
      }

      tl.to(content, {
        y: 0,
        duration,
        delay: pause,
      });

      timelineRef.current = tl;
    };

    buildTimeline();

    const handleResize = () => {
      buildTimeline();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (timelineRef.current) timelineRef.current.kill();
    };
  }, [items, pause, duration]);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
      <div ref={contentRef} className="flex flex-col will-change-transform">
        {items.map((item, index) => (
          <div key={index} className={`shrink-0 ${slideClassName}`}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
} 