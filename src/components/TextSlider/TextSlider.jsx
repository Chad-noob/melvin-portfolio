import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function TextSlider({ items, className = "" }) {
  const sliderRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    const content = contentRef.current;
    
    if (!slider || !content || items.length <= 1) return;

    const lineHeight = slider.offsetHeight;
    const totalItems = items.length;

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0,
    });

    // Animate through each item
    items.forEach((_, index) => {
      if (index < totalItems - 1) {
        tl.to(content, {
          y: -(index + 1) * lineHeight,
          duration: 1.2,
          ease: "power4.inOut",
          delay: 2,
        });
      }
    });

    // Reset to first item
    tl.to(content, {
      y: 0,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 2,
    });

    return () => tl.kill();
  }, [items]);

  return (
    <div ref={sliderRef} className={`overflow-hidden ${className}`}>
      <div ref={contentRef} className="flex flex-col">
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
