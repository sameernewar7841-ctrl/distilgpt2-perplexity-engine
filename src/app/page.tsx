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
    <main className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] flex flex-col justify-between selection:bg-[#FF5A1F]/20 selection:text-[#F4F4F5]">
      {/* Vanta.js Clouds2 Monochrome Obsidian Mist (confined to hero background) */}
      <VantaClouds2 enabled={atmosphereEnabled} />

      {/* 1. Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-[#26262B] bg-[#09090B]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Minimal Monochrome Geometric Mark + Brand */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded border border-[#26262B] bg-[#141417] flex items-center justify-center font-mono font-bold text-xs text-[#F4F4F5]">
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

          {/* Centered Navigation Tabs (Solid #141417 pill with #FF5A1F active indicator) */}
          <nav className="flex items-center gap-1 p-1 rounded-lg border border-[#26262B] bg-[#141417]">
            <button
              type="button"
              onClick={() => handleTabChange('model')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-[#FF5A1F] text-[#09090B] font-bold'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              Model Runner
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('simulator')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-[#FF5A1F] text-[#09090B] font-bold'
                  : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
              }`}
            >
              Offline Simulator
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('math')}
              className={`px-3 py-1.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-[#FF5A1F] text-[#09090B] font-bold'
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
              className="px-2.5 py-1 rounded border border-[#26262B] bg-[#141417] hover:border-[#383840] text-xs font-mono text-[#9A9AA3] hover:text-[#F4F4F5] transition-colors cursor-pointer"
            >
              Atmosphere: <span className={atmosphereEnabled ? 'text-[#FF5A1F]' : 'text-[#9A9AA3]'}>{atmosphereEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 space-y-10">
        {/* 2. Hero Section (Above the Fold) */}
        <section className="pt-4 pb-8 space-y-6">
          <div className="max-w-3xl space-y-4">
            {/* High-Contrast Solid Editorial H1 */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl heading-editorial leading-[1.1] text-[#F4F4F5]">
              Perplexity &amp; Next-Token <br />
              <span className="text-[#FF5A1F]">Prediction Engine</span>
            </h1>

            {/* Concise 2-Line Editorial Subtitle */}
            <p className="text-sm md:text-base font-mono text-[#9A9AA3] leading-relaxed max-w-2xl">
              Client-side causal language model evaluator running Xenova/distilgpt2 (q8 ONNX).
              Computes token conditional probabilities, stable log-softmax, and 3-step geometric mean perplexity.
            </p>
          </div>

          {/* Single Horizontal 4-Column Architectural Stat Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 border border-[#26262B] bg-[#141417] rounded-xl overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-[#26262B] font-mono">
            <div className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">01 / VOCAB SIZE</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1 font-tabular">50,257</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">02 / QUANTIZATION</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">8-Bit (q8)</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">03 / FORWARD PASS</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">Single Pass</div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="text-[10px] text-[#9A9AA3] uppercase tracking-wider">04 / EXECUTION</div>
              <div className="text-base sm:text-lg font-bold text-[#F4F4F5] mt-1">Web Worker</div>
            </div>
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
                  Select a preset sequence above or click <span className="text-[#F4F4F5]">"Evaluate Perplexity →"</span> to execute the forward pass.
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
            <span>Xenova/distilgpt2 (q8) Client-Side Inference</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Lenis Scroll</span>
            <span>•</span>
            <span>Vanta Obsidian Mist</span>
            <span>•</span>
            <span className="text-[#F4F4F5]">Vercel Deployed</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
