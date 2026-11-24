'use client';

import React, { useState } from 'react';
import { useLmRunner } from '@/hooks/use-lm-runner';
import { SentenceEvaluator } from '@/components/SentenceEvaluator';
import { TokenEvaluationTable } from '@/components/TokenEvaluationTable';
import { NextTokenPredictions } from '@/components/NextTokenPredictions';
import { ManualSimulator } from '@/components/ManualSimulator';
import { MathTheoryExplorer } from '@/components/MathTheoryExplorer';
import { VantaClouds2 } from '@/components/VantaClouds2';
import { ShinyText } from '@/components/react-bits/ShinyText';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { SpotlightCard } from '@/components/react-bits/SpotlightCard';
import {
  Sparkles,
  Cpu,
  Calculator,
  BookOpen,
  Cloud,
  CloudOff,
  Zap,
  Layers,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'model' | 'simulator' | 'math'>('model');
  const [vantaCloudsEnabled, setVantaCloudsEnabled] = useState<boolean>(true);

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

  const handleAppendToken = (rawTokenText: string) => {
    const updated = currentText + rawTokenText;
    setCurrentText(updated);
    evaluateSentence(updated);
  };

  return (
    <main className="relative min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Vanta.js Clouds2 3D WebGL Background */}
      <VantaClouds2 enabled={vantaCloudsEnabled} />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-black font-mono font-black text-base">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  <DecryptedText text="PERPLEXITY" speed={30} className="text-white" />
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-semibold">
                  DistilGPT-2
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono hidden sm:block">
                In-Browser Neural LM &amp; Math Engine
              </div>
            </div>
          </div>

          {/* Tab Navigation Controls */}
          <nav className="flex items-center gap-1.5 bg-black/50 border border-white/10 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('model')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'model'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/25'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Model Runner</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/25'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Offline Simulator</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('math')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-cyan-500 text-black font-semibold shadow-md shadow-cyan-500/25'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Math &amp; Proofs</span>
            </button>
          </nav>

          {/* Controls: Clouds2 Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setVantaCloudsEnabled((prev) => !prev)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-mono transition-all cursor-pointer"
              title="Toggle Vanta.js Clouds2 3D Shader"
            >
              {vantaCloudsEnabled ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden md:inline">Clouds2: ON</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="hidden md:inline">Clouds2: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full flex-1 space-y-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>@huggingface/transformers@3 Client-Side Inference</span>
            <span className="text-white/30">•</span>
            <span className="text-emerald-400">Deployable on Vercel</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
            <ShinyText text="Perplexity & Next-Token" className="block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              Prediction Engine
            </span>
          </h1>

          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Run <span className="text-white font-semibold">Xenova/distilgpt2 (q8 ONNX)</span> natively inside your browser. Compute token-by-token conditional probabilities, mathematically stable log-softmax, 3-step geometric mean perplexity, and instant next-token predictions with zero server dependencies.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left">
            <SpotlightCard className="p-3">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Vocab Size (V)</div>
              <div className="text-lg font-mono font-bold text-cyan-300">50,257</div>
            </SpotlightCard>
            <SpotlightCard className="p-3">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Quantization</div>
              <div className="text-lg font-mono font-bold text-blue-300">8-Bit (q8)</div>
            </SpotlightCard>
            <SpotlightCard className="p-3">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Forward Pass</div>
              <div className="text-lg font-mono font-bold text-emerald-300">Single Pass</div>
            </SpotlightCard>
            <SpotlightCard className="p-3">
              <div className="text-[10px] text-zinc-400 font-mono uppercase">Execution</div>
              <div className="text-lg font-mono font-bold text-purple-300">Web Worker</div>
            </SpotlightCard>
          </div>
        </div>

        {/* Tab 1: AI Model Runner */}
        {activeTab === 'model' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Sentence Evaluator Input */}
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

            {/* Results Section */}
            {result && (
              <div className="space-y-8 animate-fadeIn">
                {/* Token-by-Token Probabilities & Perplexity */}
                <TokenEvaluationTable
                  tokens={result.tokens}
                  breakdown={result.perplexityBreakdown}
                  inferenceTimeMs={result.inferenceTimeMs}
                />

                {/* Top 8 Next-Token Prediction Engine */}
                <NextTokenPredictions
                  candidates={result.nextTokens}
                  evaluatedSentence={result.text}
                  onAppendToken={handleAppendToken}
                />
              </div>
            )}

            {/* If no result yet, display a helpful walkthrough hint */}
            {!result && (
              <div className="rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl p-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-white">Ready for In-Browser Evaluation</h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto">
                  Click any of the three one-click preset buttons above (e.g. <span className="text-cyan-300 font-mono font-semibold">"I love Python"</span>) or click <span className="text-white font-semibold">"Evaluate Perplexity"</span> to trigger the forward pass.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Offline Manual Perplexity Simulator */}
        {activeTab === 'simulator' && (
          <div className="space-y-8 animate-fadeIn">
            <ManualSimulator />
          </div>
        )}

        {/* Tab 3: Complete Math & Proofs */}
        {activeTab === 'math' && (
          <div className="space-y-8 animate-fadeIn">
            <MathTheoryExplorer />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl mt-16 py-8 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Built with @huggingface/transformers@3, Vanta.js (Clouds2), React Bits &amp; Lenis</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Client-Side ONNX q8</span>
            <span>•</span>
            <span>Vercel Ready</span>
            <span>•</span>
            <span className="text-cyan-400">DistilGPT-2</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
