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
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Lenis instance with Swiss-smooth native feel
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

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Initial resize after DOM settles
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
      {children}
    </LenisContext.Provider>
  );
}
