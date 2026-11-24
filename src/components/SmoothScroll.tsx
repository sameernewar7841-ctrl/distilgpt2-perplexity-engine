'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';

interface LenisContextValue {
  lenis: Lenis | null;
  resize: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  resize: () => {},
});

export function useLenisScroll() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on('scroll', (e: any) => {
      if (typeof e.progress === 'number') {
        setScrollProgress(Math.min(100, Math.max(0, e.progress * 100)));
      }
    });

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    const timeoutId = setTimeout(() => {
      lenis.resize();
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const resize = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, resize }}>
      {/* Lenis Top Scroll Progress Bar */}
      <div
        className="lenis-scroll-indicator"
        style={{ width: `${scrollProgress}%` }}
      />
      {children}
    </LenisContext.Provider>
  );
}
