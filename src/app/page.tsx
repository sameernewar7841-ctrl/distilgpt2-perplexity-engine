'use client';

import React, { useState } from 'react';
import { useLmRunner } from '@/hooks/use-lm-runner';
import { useLenisScroll } from '@/components/SmoothScroll';
import { SentenceEvaluator } from '@/components/SentenceEvaluator';
import { TokenEvaluationTable } from '@/components/TokenEvaluationTable';
import { NextTokenPredictions } from '@/components/NextTokenPredictions';
import { ManualSimulator } from '@/components/ManualSimulator';
import { MathTheoryExplorer } from '@/components/MathTheoryExplorer';
import { VantaClouds2 } from '@/components/VantaClouds2';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { ShinyText } from '@/components/react-bits/ShinyText';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'model' | 'simulator' | 'math'>('model');
  const [atmosphereEnabled, setAtmosphereEnabled] = useState<boolean>(true);
  const { resize } = useLenisScroll();

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

  const handleTabChange = (tab: 'model' | 'simulator' | 'math') => {
    setActiveTab(tab);
    setTimeout(() => {
      resize();
    }, 50);
  };

  const handleAppendToken = (rawTokenText: string) => {
    const updated = currentText + rawTokenText;
    setCurrentText(updated);
    evaluateSentence(updated);
  };

  return (
    <main className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col justify-between selection:bg-[#FFAE52]/20 selection:text-[#FFFFFF]">
      {/* Vanta.js Clouds2 Twilight Atmosphere */}
      <VantaClouds2 enabled={atmosphereEnabled} />

      {/* 1. Sticky Header */}
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

          {/* Centered Navigation Tabs */}
          <nav className="flex items-center gap-1 p-1 rounded-lg border border-[#26262B] bg-[#141417]">
            <button
              type="button"
              onClick={() => handleTabChange('model')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              Model Runner
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('simulator')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              Offline Simulator
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('math')}
              className={`px-3.5 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              Math &amp; Proofs
            </button>
          </nav>

          {/* Atmosphere Toggle */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setAtmosphereEnabled((prev) => !prev)}
              className="px-2.5 py-1 rounded border border-[#26262B] bg-[#141417] hover:border-[#383840] text-xs font-mono text-[#9A9AA3] hover:text-[#F4F4F5] transition-all cursor-pointer active:scale-95"
            >
              Atmosphere: <span className={atmosphereEnabled ? 'text-[#FFAE52] font-bold' : 'text-[#9A9AA3]'}>{atmosphereEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 space-y-10">
        {/* 2. Hero Section */}
        <section className="pt-4 pb-8 space-y-6">
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

        {/* Tab Content */}
        {activeTab === 'model' && (
          <div className="space-y-8 animate-fadeIn">
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
                  Select a preset sequence above or click <span className="text-[#FFAE52] font-semibold">"Evaluate Perplexity →"</span> to execute the forward pass.
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            <ManualSimulator />
          </div>
        )}

        {activeTab === 'math' && (
          <div className="space-y-8 animate-fadeIn">
            <MathTheoryExplorer />
          </div>
        )}
      </div>

      {/* Minimal Editorial Footer */}
      <footer className="border-t border-[#26262B] bg-[#09090B] py-6 mt-16 font-mono text-xs text-[#9A9AA3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52]" />
            <span>Xenova/distilgpt2 (q8) Client-Side Inference</span>
          </div>
          <div className="flex items-center gap-4">
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
