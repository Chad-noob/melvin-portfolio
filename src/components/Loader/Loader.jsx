import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { hellos } from "./helloData";

export default function Loader({ finishLoading }) {
  const loaderRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => finishLoading(),
      });

      // Animate each hello text with gradually decreasing display time
      hellos.forEach((hello, index) => {
        // First 2 words slower, then 5x faster, last word 1 second
        let visibleTime, fadeInDuration, fadeOutDuration;
        
        if (index === hellos.length - 1) {
          // Last word displays for 0.5 seconds
          visibleTime = 0.5;
          fadeInDuration = 0.4;
          fadeOutDuration = 0.3;
        } else if (index < 2) {
          // First 2 words slower
          visibleTime = 0.6 - (index * 0.1); // 0.6s, 0.5s
          fadeInDuration = 0.4;
          fadeOutDuration = 0.3;
        } else {
          // Rest are 5x faster
          visibleTime = 0.12 - ((index - 2) * 0.02); // Much faster
          visibleTime = Math.max(0.01, visibleTime);
          fadeInDuration = 0.08;
          fadeOutDuration = 0.06;
        }
        
        tl.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: fadeInDuration,
          ease: "power3.out",
          onStart: () => {
            textRef.current.innerText = hello;
          },
        })
          .to(textRef.current, {
            opacity: 0,
            y: -20,
            duration: fadeOutDuration,
            ease: "power3.in",
          }, `+=${visibleTime}`); // This controls how long the text stays visible
      });

      // Slide loader up
      tl.to(loaderRef.current, {
        y: "-100%",
        duration: 1.2,
        ease: "power4.inOut",
      });
    });

    return () => ctx.revert();
  }, [finishLoading]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
    >
      <h1
        ref={textRef}
        className="text-5xl md:text-7xl font-bold tracking-tight opacity-0"
      >
        Hello
      </h1>
    </div>
  );
}
