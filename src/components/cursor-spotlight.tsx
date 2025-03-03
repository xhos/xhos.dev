"use client";

import { useEffect, useState, useRef } from "react";

export default function CursorSpotlight() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorPosition = useRef({ x: 0, y: 0 });
  const spotlightPosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const easeAmount = 0.01; // lower = more inertia, higher = more responsive

    const animate = () => {
      if (!isVisible) {
        rafId.current = requestAnimationFrame(animate);
        return;
      }

      const distX = cursorPosition.current.x - spotlightPosition.current.x;
      const distY = cursorPosition.current.y - spotlightPosition.current.y;

      spotlightPosition.current.x += distX * easeAmount;
      spotlightPosition.current.y += distY * easeAmount;

      if (divRef.current) {
        divRef.current.innerHTML = `<div class="spotlight-blur" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(300px circle at ${spotlightPosition.current.x}px ${spotlightPosition.current.y}px, 
            hsla(275, 84.00%, 59.80%, 0.5), 
            transparent 60%);
          filter: blur(25px);
          pointer-events: none;
        "></div>`;
      }

      rafId.current = requestAnimationFrame(animate);
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible]);

  return (
    <div
      ref={divRef}
      className="pointer-events-none fixed inset-0 z-30"
    />
  );
}