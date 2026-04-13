import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const TracingBeam = ({ children }) => {
  const containerRef = useRef(null);
  const beamRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",   // when section enters viewport
          end: "bottom 20%",  // when it leaves
          scrub: true,        // smooth linking to scroll
        },
      });

      // Animate beam height
      tl.fromTo(
        beamRef.current,
        { height: "0%" },
        { height: "100%", ease: "none" },
        0
      );

      // Animate dot position
      tl.fromTo(
        dotRef.current,
        { top: "0%" },
        { top: "100%", ease: "none" },
        0
      );

      // Optional opacity fade-in
      tl.fromTo(
        [beamRef.current, dotRef.current],
        { opacity: 0 },
        { opacity: 1, duration: 0.1 },
        0
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-6">
      
      {/* Track */}
      <div className="absolute -left-4 md:-left-12 top-0 h-full w-[2px] bg-slate-200/20 pointer-events-none">
        
        {/* Beam */}
        <div
          ref={beamRef}
          className="absolute top-0 w-full h-0 bg-gradient-to-b from-indigo-500 via-purple-500 to-transparent shadow-[0_0_10px_rgba(99,102,241,0.5)]"
        />

        {/* Dot */}
        <div
          ref={dotRef}
          className="absolute -left-[5px] top-0 h-3 w-3 rounded-full bg-white border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] z-10"
        />
      </div>

      {/* Content */}
      <div className="w-full">{children}</div>
    </div>
  );
};