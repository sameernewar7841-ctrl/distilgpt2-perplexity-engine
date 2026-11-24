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

        data[idx] = combined;
        data[idx + 1] = combined; // green channel sampled by shader .y
        data[idx + 2] = combined;
        data[idx + 3] = 255;
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

        // Tuned to deep obsidian dusk with warm amber highlights
        effectRef.current = CLOUDS2({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.5,
          backgroundColor: 0x09090b, // #09090B dominant canvas
          skyColor: 0x111015,        // #111015 deep dusk
          cloudColor: 0x221f26,      // #221F26 soft volumetric clouds
          lightColor: 0x5a4638,      // #5A4638 warm amber/orange mist highlight
          speed: 0.55,
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
    <div className="absolute top-0 left-0 right-0 h-[600px] -z-10 pointer-events-none overflow-hidden select-none">
      {/* Vanta Canvas Container */}
      <div
        ref={vantaRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${
          enabled && isLoaded ? 'opacity-75' : 'opacity-0'
        }`}
      />

      {/* Seamless bottom fade mask into #09090B canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B]/30 to-[#09090B]" />
    </div>
  );
}
