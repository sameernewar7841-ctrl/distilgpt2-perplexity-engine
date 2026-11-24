'use client';

import React, { useState, useEffect } from 'react';
import { useLmRunner } from '@/hooks/use-lm-runner';
import { useLenisScroll } from '@/components/SmoothScroll';
import { SentenceEvaluator } from '@/components/SentenceEvaluator';
import { TokenEvaluationTable } from '@/components/TokenEvaluationTable';
import { NextTokenPredictions } from '@/components/NextTokenPredictions';
import { ManualSimulator } from '@/components/ManualSimulator';
import { MathTheoryExplorer } from '@/components/MathTheoryExplorer';
import ShapeWaves from '@/components/react-bits/ShapeWaves';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { ShinyText } from '@/components/react-bits/ShinyText';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard';

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<'runner' | 'simulator' | 'math'>('runner');
  const [wavesEnabled, setWavesEnabled] = useState<boolean>(true);
  const { lenis } = useLenisScroll();

  const {
    status,
    isBusy,
    isModelLoaded,
    progress,
    result,
    error,
    currentText,
    setCurrentText,
    evaluateSentence,
  } = useLmRunner();

  const scrollToSection = (id: string, sectionKey: 'runner' | 'simulator' | 'math') => {
    setActiveSection(sectionKey);
    const element = document.getElementById(id);
    if (!element) return;
    if (lenis) {
      lenis.scrollTo(element, { offset: -75, duration: 0.9 });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY + 200;
      const runnerEl = document.getElementById('model-runner');
      const simulatorEl = document.getElementById('offline-simulator');
      const mathEl = document.getElementById('math-proofs');

      if (mathEl && scrollY >= mathEl.offsetTop) {
        setActiveSection('math');
      } else if (simulatorEl && scrollY >= simulatorEl.offsetTop) {
        setActiveSection('simulator');
      } else {
        setActiveSection('runner');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAppendToken = (rawTokenText: string) => {
    const updated = currentText + rawTokenText;
    setCurrentText(updated);
    evaluateSentence(updated);
  };

  return (
    <main className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col justify-between selection:bg-[#FFAE52]/20 selection:text-[#FFFFFF]">
      {/* React Bits ShapeWaves Background (https://reactbits.dev/tools/background-studio?bg=shape-waves) */}
      <div className="absolute top-0 left-0 right-0 h-[720px] -z-10 pointer-events-none overflow-hidden select-none">
        <ShapeWaves
          shapes="mixed"
          cellSize={15}
          dotSize={0.72}
          color="#1e1e24"
          hoverColor="#FFAE52"
          backgroundColor="#09090B"
          glow={0.38}
          speed={0.9}
          interactive={true}
          splashRadius={45}
          splashStrength={0.45}
          className={`transition-opacity duration-700 ${wavesEnabled ? 'opacity-90' : 'opacity-0'}`}
        />
        {/* Seamless bottom fade mask into #09090B canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B]/30 to-[#09090B]" />
      </div>

      {/* 1. Sticky Header with Unified Anchor Navigation */}
      <header className="sticky top-0 z-50 border-b border-[#26262B] bg-[#09090B]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Minimal Monochrome Geometric Mark + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-[#26262B] bg-[#141417] flex items-center justify-center font-mono font-bold text-xs text-[#FFAE52]">
              P
            </div>
            <div className="font-mono text-xs tracking-tight flex items-center gap-2">
              <span className="text-[#F4F4F5] font-semibold">
                <DecryptedText text="PERPLEXITY" speed={30} />
              </span>
              <span className="text-[#9A9AA3]">/</span>
              <span className="text-[#9A9AA3]">DISTILGPT-2</span>
            </div>
          </div>

          {/* Unified Navigation Links (Merged into single page with smooth scroll) */}
          <nav className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-[#26262B] bg-[#141417]">
            <button
              type="button"
              onClick={() => scrollToSection('model-runner', 'runner')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeSection === 'runner'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              01. Model Runner
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('offline-simulator', 'simulator')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeSection === 'simulator'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              02. Offline Simulator
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('math-proofs', 'math')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeSection === 'math'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              03. Math &amp; Proofs
            </button>
          </nav>

          {/* Waves Background Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setWavesEnabled((prev) => !prev)}
              className="px-2.5 py-1 rounded border border-[#26262B] bg-[#141417] hover:border-[#383840] text-xs font-mono text-[#9A9AA3] hover:text-[#F4F4F5] transition-all cursor-pointer active:scale-95"
            >
              Waves: <span className={wavesEnabled ? 'text-[#FFAE52] font-bold' : 'text-[#9A9AA3]'}>{wavesEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Unified Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 space-y-16">
        {/* Hero Section */}
        <section className="pt-4 pb-4 space-y-6">
          {/* Lenis Swiss Live Coordinate & Ticker Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 font-mono text-[11px] text-[#9A9AA3] pb-3 border-b border-[#26262B]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52] animate-pulse" />
              <span className="text-[#F4F4F5] font-semibold">DISTILGPT-2 (Q8)</span>
            </div>
            <span className="text-[#26262B]">•</span>
            <div className="flex items-center gap-1">
              <span className="text-[#9A9AA3]">ENGINE:</span>
              <span className="text-[#F4F4F5]">ONNX-RUNTIME WEB</span>
            </div>
            <span className="text-[#26262B]">•</span>
            <div className="flex items-center gap-1">
              <span className="text-[#9A9AA3]">BG:</span>
              <span className="text-[#FFAE52]">REACT BITS SHAPE-WAVES</span>
            </div>
            <span className="text-[#26262B]">•</span>
            <div className="flex items-center gap-1">
              <span className="text-[#9A9AA3]">SCROLL:</span>
              <span className="text-[#FFAE52]">LENIS SMOOTH</span>
            </div>
            <span className="text-[#26262B]">•</span>
            <div className="flex items-center gap-1">
              <span className="text-[#9A9AA3]">LATENCY:</span>
              <span className="text-[#F4F4F5]">SINGLE PASS</span>
            </div>
          </div>

          <div className="max-w-3xl space-y-4">
            {/* High-Contrast Editorial Display Headline */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl heading-editorial leading-[1.08] text-[#F4F4F5]">
              Perplexity &amp; Next-Token <br />
              <ShinyText text="Prediction Engine" className="font-bold text-[#FFAE52]" />
            </h1>

            {/* Concise Editorial Subtitle */}
            <p className="text-sm md:text-base font-mono text-[#9A9AA3] leading-relaxed max-w-2xl">
              Client-side causal language model evaluator running Xenova/distilgpt2 (q8 ONNX).
              Computes token conditional probabilities, stable log-softmax, and 3-step geometric mean perplexity.
            </p>
          </div>

          {/* 4-Column Architectural Stat Bar with React Bits SpotlightCards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
            <SpotlightCard className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">01 / VOCAB SIZE</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1 font-tabular">50,257</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">02 / QUANTIZATION</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">8-Bit (q8)</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">03 / FORWARD PASS</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">Single Pass</div>
            </SpotlightCard>
            <SpotlightCard className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">04 / EXECUTION</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">Web Worker</div>
            </SpotlightCard>
          </div>
        </section>

        {/* SECTION 01: MODEL RUNNER */}
        <section id="model-runner" className="space-y-8 scroll-mt-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">01</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                In-Browser Language Model Runner
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#9A9AA3]">
              DistilGPT-2 (q8 ONNX)
            </span>
          </div>

          <SentenceEvaluator
            currentText={currentText}
            onTextChange={setCurrentText}
            onEvaluate={evaluateSentence}
            status={status}
            isBusy={isBusy}
            isModelLoaded={isModelLoaded}
            progress={progress}
            error={error}
          />

          {result ? (
            <div className="space-y-8 animate-fadeIn">
              <TokenEvaluationTable
                tokens={result.tokens}
                breakdown={result.perplexityBreakdown}
                inferenceTimeMs={result.inferenceTimeMs}
              />
              <NextTokenPredictions
                candidates={result.nextTokens}
                evaluatedSentence={result.text}
                onAppendToken={handleAppendToken}
              />
            </div>
          ) : (
            <div className="border border-[#26262B] bg-[#141417] rounded-xl p-8 text-center font-mono">
              <div className="text-xs text-[#9A9AA3]">
                Select a preset sequence above or click <span className="text-[#FFAE52] font-semibold">"Evaluate Perplexity →"</span> to execute the forward pass and reveal the token probability breakdown.
              </div>
            </div>
          )}
        </section>

        {/* SECTION 02: OFFLINE SIMULATOR */}
        <section id="offline-simulator" className="space-y-8 pt-6 scroll-mt-24 border-t border-[#26262B]">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">02</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                Offline Classroom Perplexity Simulator
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#9A9AA3]">
              Pedagogical Hand-Calculator (No Weights Needed)
            </span>
          </div>

          <ManualSimulator />
        </section>

        {/* SECTION 03: MATHEMATICAL FORMULATIONS & PROOFS */}
        <section id="math-proofs" className="space-y-8 pt-6 scroll-mt-24 border-t border-[#26262B]">
          <div className="flex items-center justify-between pb-3 border-b border-[#26262B]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">03</span>
              <span className="font-mono text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                Mathematical Formulations &amp; Algorithmic Proofs
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#9A9AA3]">
              Numerically Stable Log-Softmax &amp; Log-Space Perplexity
            </span>
          </div>

          <MathTheoryExplorer />
        </section>
      </div>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-[#26262B] bg-[#09090B] py-6 mt-16 font-mono text-xs text-[#9A9AA3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52]" />
            <span>Xenova/distilgpt2 (q8) Client-Side Inference</span>
          </div>
          <div className="flex items-center gap-4">
            <span>ShapeWaves (React Bits)</span>
            <span>•</span>
            <span>Plus Jakarta Sans &amp; JetBrains Mono</span>
            <span>•</span>
            <span>Lenis Scroll</span>
            <span>•</span>
            <span className="text-[#F4F4F5]">Vercel Deployed</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
