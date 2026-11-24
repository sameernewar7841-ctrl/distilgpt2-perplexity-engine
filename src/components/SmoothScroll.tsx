'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

interface LenisContextValue {
  lenis: Lenis | null;
  resize: () => void;
  scrollProgress: number;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  resize: () => {},
  scrollProgress: 0,
});

export function useLenisScroll() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    let currentLenis: Lenis | null = null;
    let isDesktopState = typeof window !== 'undefined' && window.innerWidth >= 1024;

    function initLenis(isDesktop: boolean) {
      if (currentLenis) {
        currentLenis.destroy();
        currentLenis = null;
      }

      const instance = new Lenis({
        orientation: isDesktop ? 'horizontal' : 'vertical',
        gestureOrientation: isDesktop ? 'both' : 'vertical',
        smoothWheel: true,
        autoRaf: true,
        autoResize: true,
        lerp: 0.085,
        wheelMultiplier: 1,
        anchors: true,
        respectReducedMotion: true,
      });

      instance.on('scroll', (e: any) => {
        if (typeof e.progress === 'number') {
          setScrollProgress(Math.min(100, Math.max(0, e.progress * 100)));
        }
      });

      currentLenis = instance;
      lenisRef.current = instance;
      setLenisInstance(instance);
    }

    initLenis(isDesktopState);

    const handleWindowResize = () => {
      const isDesktopNow = window.innerWidth >= 1024;
      if (isDesktopNow !== isDesktopState) {
        isDesktopState = isDesktopNow;
        initLenis(isDesktopNow);
      } else if (currentLenis) {
        currentLenis.resize();
      }
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      if (currentLenis) {
        currentLenis.destroy();
        currentLenis = null;
      }
      lenisRef.current = null;
    };
  }, []);

  const resize = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
    }
  }, []);

  return (
    <LenisContext.Provider value={{ lenis: lenisInstance, resize, scrollProgress }}>
      {children}
    </LenisContext.Provider>
  );
}
