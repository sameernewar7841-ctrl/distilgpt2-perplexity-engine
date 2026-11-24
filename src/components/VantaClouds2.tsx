'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface VantaClouds2Props {
  enabled?: boolean;
}

export function VantaClouds2({ enabled = true }: VantaClouds2Props) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || !vantaRef.current) return;

    let destroyed = false;

    // Attach THREE to window for Vanta
    if (typeof window !== 'undefined') {
      (window as any).THREE = THREE;
    }

    async function initVanta() {
      try {
        // Dynamically import Vanta Clouds2 effect
        const CLOUDS2 = (await import('vanta/dist/vanta.clouds2.min.js' as any)).default;

        if (destroyed || !vantaRef.current) return;

        // Destroy previous instance if any
        if (effectRef.current) {
          effectRef.current.destroy();
          effectRef.current = null;
        }

        effectRef.current = CLOUDS2({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 2.0,
          backgroundColor: 0x030712, // deep slate black
          skyColor: 0x0a192f,        // deep navy sky
          cloudColor: 0x172a45,      // midnight cloud body
          lightColor: 0x38bdf8,      // glowing cyan light
          speed: 0.75,
          texturePath: '/gallery/noise.png',
        });

        setIsLoaded(true);
      } catch (err) {
        console.warn('Vanta Clouds2 initialization fallback:', err);
      }
    }

    initVanta();

    return () => {
      destroyed = true;
      if (effectRef.current) {
        try {
          effectRef.current.destroy();
        } catch (e) {
          // ignore
        }
        effectRef.current = null;
      }
    };
  }, [enabled]);

  return (
    <div className="fixed inset-0 -z-20 pointer-events-none overflow-hidden select-none">
      {/* Vanta Canvas Host */}
      <div
        ref={vantaRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          enabled && isLoaded ? 'opacity-85' : 'opacity-0'
        }`}
      />

      {/* Fallback & Ambient Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/75 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/15 via-transparent to-transparent" />
    </div>
  );
}
