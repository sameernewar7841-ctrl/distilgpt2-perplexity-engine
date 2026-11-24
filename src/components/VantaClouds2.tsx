'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface VantaClouds2Props {
  enabled?: boolean;
}

function generateProceduralNoiseDataUrl(): string {
  if (typeof document === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    const imgData = ctx.createImageData(256, 256);
    const data = imgData.data;

    function pseudoNoise(x: number, y: number) {
      const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      return n - Math.floor(n);
    }

    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const idx = (y * 256 + x) * 4;
        const v1 = pseudoNoise(x * 0.05, y * 0.05);
        const v2 = pseudoNoise(x * 0.1 + 10, y * 0.1 + 10) * 0.5;
        const v3 = pseudoNoise(x * 0.2 + 20, y * 0.2 + 20) * 0.25;
        const combined = Math.min(255, Math.floor(((v1 + v2 + v3) / 1.75) * 255));

        data[idx] = combined;     // R
        data[idx + 1] = combined; // G (used by shader .y)
        data[idx + 2] = combined; // B
        data[idx + 3] = 255;      // Alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL('image/png');
  } catch (e) {
    return '';
  }
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
        const CLOUDS2 = (await import('vanta/dist/vanta.clouds2.min.js' as any)).default;

        if (destroyed || !vantaRef.current) return;

        if (effectRef.current) {
          effectRef.current.destroy();
          effectRef.current = null;
        }

        const proceduralNoiseUrl = generateProceduralNoiseDataUrl();

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
          backgroundColor: 0x030712,
          skyColor: 0x0a192f,
          cloudColor: 0x172a45,
          lightColor: 0x38bdf8,
          speed: 0.75,
          texturePath: proceduralNoiseUrl || '/gallery/noise.png',
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
      <div
        ref={vantaRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          enabled && isLoaded ? 'opacity-85' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/75 to-zinc-950" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-900/15 via-transparent to-transparent" />
    </div>
  );
}
