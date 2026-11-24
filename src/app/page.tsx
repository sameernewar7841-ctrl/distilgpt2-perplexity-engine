'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
import { ArrowRight, Cpu } from 'lucide-react';

const PANELS = ['overview', 'runner', 'simulator', 'math'] as const;
type PanelId = (typeof PANELS)[number];

const NAV_ITEMS: { id: PanelId; number: string; label: string }[] = [
  { id: 'overview', number: '01', label: 'Overview' },
  { id: 'runner', number: '02', label: 'Model Runner' },
  { id: 'simulator', number: '03', label: 'Offline Simulator' },
  { id: 'math', number: '04', label: 'Math & Proofs' },
];

const PANEL_LABELS: Record<PanelId, string> = {
  overview: 'Overview',
  runner: 'Model Runner',
  simulator: 'Offline Simulator',
  math: 'Math & Proofs',
};

export default function HomePage() {
  const [activePanel, setActivePanel] = useState<PanelId>('overview');
  const [wavesEnabled, setWavesEnabled] = useState<boolean>(true);
  const { lenis, scrollProgress } = useLenisScroll();

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

  // Smooth scroll handler targeting panel ID
  const scrollToPanel = useCallback(
    (panelId: PanelId) => {
      setActivePanel(panelId);
      if (lenis) {
        lenis.scrollTo(`#${panelId}`, { duration: 1.1 });
      } else {
        const el = document.getElementById(panelId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [lenis]
  );

  // Active panel scroll spy: tracks horizontal on desktop, vertical on mobile
  useEffect(() => {
    const updateActiveByPosition = () => {
      const isDesktop = window.innerWidth >= 1024;
      const overviewEl = document.getElementById('overview');
      const runnerEl = document.getElementById('runner');
      const simulatorEl = document.getElementById('simulator');
      const mathEl = document.getElementById('math');

      if (isDesktop) {
        const scrollX =
          window.scrollX ||
          document.documentElement.scrollLeft ||
          (lenis ? (lenis as any).scroll : 0);
        const threshold = scrollX + window.innerWidth * 0.45;

        if (mathEl && threshold >= mathEl.offsetLeft) {
          setActivePanel('math');
        } else if (simulatorEl && threshold >= simulatorEl.offsetLeft) {
          setActivePanel('simulator');
        } else if (runnerEl && threshold >= runnerEl.offsetLeft) {
          setActivePanel('runner');
        } else {
          setActivePanel('overview');
        }
      } else {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const threshold = scrollY + 250;

        if (mathEl && threshold >= mathEl.offsetTop) {
          setActivePanel('math');
        } else if (simulatorEl && threshold >= simulatorEl.offsetTop) {
          setActivePanel('simulator');
        } else if (runnerEl && threshold >= runnerEl.offsetTop) {
          setActivePanel('runner');
        } else {
          setActivePanel('overview');
        }
      }
    };

    if (lenis) {
      lenis.on('scroll', updateActiveByPosition);
    }
    window.addEventListener('scroll', updateActiveByPosition, { passive: true });

    return () => {
      if (lenis) {
        lenis.off('scroll', updateActiveByPosition);
      }
      window.removeEventListener('scroll', updateActiveByPosition);
    };
  }, [lenis]);

  // Keyboard navigation: Left/Right arrows jump between panels when not inside input/textarea
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);
      if (isTyping) return;

      const currentIndex = PANELS.indexOf(activePanel);
      if (currentIndex === -1) return;

      if (e.key === 'ArrowRight' && currentIndex < PANELS.length - 1) {
        e.preventDefault();
        scrollToPanel(PANELS[currentIndex + 1]);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        scrollToPanel(PANELS[currentIndex - 1]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel, scrollToPanel]);

  const handleAppendToken = (rawTokenText: string) => {
    const updated = currentText + rawTokenText;
    setCurrentText(updated);
    evaluateSentence(updated);
  };

  return (
    <main className="relative min-h-screen bg-[#09090B] text-[#F4F4F5] selection:bg-[#FFAE52]/20 selection:text-[#FFFFFF]">
      {/* React Bits ShapeWaves Background (Fixed in viewport across all 4 horizontal panels) */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden select-none">
        <ShapeWaves
          shapes="mixed"
          cellSize={16}
          dotSize={0.72}
          color="#1e1e24"
          hoverColor="#FFAE52"
          backgroundColor="#09090B"
          glow={0.38}
          speed={0.9}
          interactive={true}
          splashRadius={45}
          splashStrength={0.45}
          className={`transition-opacity duration-700 ${wavesEnabled ? 'opacity-85' : 'opacity-0'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090B]/30 via-transparent to-[#09090B]/60" />
      </div>

      {/* 1. Fixed Header with 4 Segmented Anchor Links + Atmosphere Toggle */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#26262B] bg-[#09090B]/90 backdrop-blur-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Monospace Geometric Mark */}
          <div className="flex items-center gap-3 shrink-0">
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

          {/* 4 Segmented Smooth-Scroll Anchor Links */}
          <nav className="hidden sm:flex items-center gap-1 p-1 rounded-lg border border-[#26262B] bg-[#141417]">
            {NAV_ITEMS.map((item) => {
              const isActive = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToPanel(item.id)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#FFAE52] text-[#09090B] font-bold shadow-sm'
                      : 'text-[#9A9AA3] hover:text-[#F4F4F5] hover:bg-[#09090B]'
                  }`}
                >
                  <span className={isActive ? 'text-[#09090B]/70' : 'text-[#FFAE52]'}>
                    {item.number}.
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Atmosphere Toggle */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setWavesEnabled((prev) => !prev)}
              className="px-2.5 py-1 rounded border border-[#26262B] bg-[#141417] hover:border-[#383840] text-xs font-mono text-[#9A9AA3] hover:text-[#F4F4F5] transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>Atmosphere:</span>
              <span className={wavesEnabled ? 'text-[#FFAE52] font-bold' : 'text-[#9A9AA3]'}>
                {wavesEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Continuous 4-Panel Track: Horizontal Flex on Desktop (>= 1024px), Vertical Stack on Mobile (< 1024px) */}
      <div className="flex flex-col lg:flex-row lg:w-max lg:h-screen lg:overflow-visible">
        {/* PANEL 01: OVERVIEW & SPECIFICATION */}
        <section
          id="overview"
          className="w-full lg:w-screen h-auto lg:h-screen shrink-0 flex flex-col justify-between pt-20 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-8 lg:px-16 border-b lg:border-b-0 lg:border-r border-[#26262B] relative overflow-y-auto lg:overflow-hidden"
        >
          <div className="space-y-6 max-w-5xl my-auto">
            {/* Status Metadata Bar */}
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
                <span className="text-[#FFAE52]">LENIS HORIZONTAL</span>
              </div>
              <span className="text-[#26262B]">•</span>
              <div className="flex items-center gap-1">
                <span className="text-[#9A9AA3]">LATENCY:</span>
                <span className="text-[#F4F4F5]">SINGLE PASS</span>
              </div>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-5xl md:text-6xl heading-editorial leading-[1.08] text-[#F4F4F5]">
                Perplexity &amp; Next-Token <br />
                <ShinyText text="Prediction Engine" className="font-bold text-[#FFAE52]" />
              </h1>

              {/* Editorial Subtitle */}
              <p className="text-sm md:text-base font-mono text-[#9A9AA3] leading-relaxed max-w-2xl">
                Client-side causal language model evaluator running Xenova/distilgpt2 (q8 ONNX).
                Computes token conditional probabilities, stable log-softmax, and 3-step geometric mean perplexity.
              </p>
            </div>

            {/* 4-Column Architectural Stat Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono pt-2">
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
          </div>

          {/* Bottom Row Cue */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-[#26262B] font-mono text-xs text-[#9A9AA3] shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52]" />
              <span>01 / OVERVIEW • ARCHITECTURAL SPECIFICATION</span>
            </div>
            <button
              type="button"
              onClick={() => scrollToPanel('runner')}
              className="inline-flex items-center gap-2 text-[#FFAE52] hover:text-[#FFBE73] font-semibold cursor-pointer group transition-colors"
            >
              <span>Scroll sideways to Model Runner</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* PANEL 02: MODEL RUNNER */}
        <section
          id="runner"
          className="w-full lg:min-w-[100vw] lg:w-[100vw] h-auto lg:h-screen shrink-0 flex flex-col justify-between pt-20 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-8 lg:px-12 border-b lg:border-b-0 lg:border-r border-[#26262B] relative overflow-y-auto lg:overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-h-0">
            {/* Section Ticker / Header */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#26262B] shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFAE52]">02</span>
                <span className="text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                  Model Runner &amp; Causal Inference
                </span>
              </div>
              <span className="text-[11px] text-[#9A9AA3]">
                DistilGPT-2 (q8 ONNX) • Web Worker
              </span>
            </div>

            {/* 2-Column Desktop Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 min-h-0 items-start">
              {/* Left Column: Preset Sequences, Input Sentence, & CTA */}
              <div data-lenis-prevent className="overflow-y-auto max-h-[calc(100vh-210px)] pr-1">
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
              </div>

              {/* Right Column: Ready State or Results (Token Probability Table & Next-Token Predictions) */}
              <div data-lenis-prevent className="overflow-y-auto max-h-[calc(100vh-210px)] pr-1 space-y-6">
                {result ? (
                  <div className="space-y-6 animate-fadeIn">
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
                  <div className="border border-[#26262B] bg-[#141417] rounded-xl p-8 flex flex-col justify-between h-full min-h-[380px]">
                    <div>
                      <div className="flex items-center justify-between pb-4 border-b border-[#26262B]">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FFAE52] animate-pulse" />
                          <span className="font-mono text-xs uppercase tracking-wider text-[#F4F4F5] font-semibold">
                            Inference Engine Standby
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#9A9AA3]">
                          Single-Pass Forward Graph
                        </span>
                      </div>

                      <div className="py-12 text-center space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-lg border border-[#26262B] bg-[#09090B] flex items-center justify-center text-[#FFAE52]">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <h4 className="text-base font-semibold text-[#F4F4F5] heading-editorial">
                          Ready for Evaluation
                        </h4>
                        <p className="text-xs font-mono text-[#9A9AA3] max-w-md mx-auto leading-relaxed">
                          Select a preset sequence on the left or enter a custom prompt and click{' '}
                          <span className="text-[#FFAE52] font-semibold">"Evaluate Perplexity →"</span> to execute the forward pass and reveal the token probability breakdown.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-[#26262B] font-mono text-[11px]">
                      <div className="p-2.5 rounded bg-[#09090B] border border-[#26262B]">
                        <div className="text-[#9A9AA3] text-[10px]">VOCAB</div>
                        <div className="text-[#F4F4F5] font-bold mt-0.5 font-tabular">50,257</div>
                      </div>
                      <div className="p-2.5 rounded bg-[#09090B] border border-[#26262B]">
                        <div className="text-[#9A9AA3] text-[10px]">QUANTIZATION</div>
                        <div className="text-[#FFAE52] font-bold mt-0.5">8-Bit (q8)</div>
                      </div>
                      <div className="p-2.5 rounded bg-[#09090B] border border-[#26262B]">
                        <div className="text-[#9A9AA3] text-[10px]">EXECUTION</div>
                        <div className="text-[#F4F4F5] font-bold mt-0.5">Web Worker</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 03: OFFLINE SIMULATOR */}
        <section
          id="simulator"
          className="w-full lg:min-w-[100vw] lg:w-[100vw] h-auto lg:h-screen shrink-0 flex flex-col justify-between pt-20 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-8 lg:px-12 border-b lg:border-b-0 lg:border-r border-[#26262B] relative overflow-y-auto lg:overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-h-0">
            {/* Section Ticker / Header */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#26262B] shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFAE52]">03</span>
                <span className="text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                  Offline Classroom Perplexity Simulator
                </span>
              </div>
              <span className="text-[11px] text-[#9A9AA3]">
                Pedagogical Hand-Calculator (No Weights Needed)
              </span>
            </div>

            <div className="flex-1 min-h-0">
              <ManualSimulator />
            </div>
          </div>
        </section>

        {/* PANEL 04: MATHEMATICAL FORMULATIONS & PROOFS */}
        <section
          id="math"
          className="w-full lg:min-w-[135vw] lg:w-max h-auto lg:h-screen shrink-0 flex flex-col justify-between pt-20 lg:pt-24 pb-12 lg:pb-16 px-4 sm:px-8 lg:px-12 relative overflow-y-auto lg:overflow-hidden"
        >
          <div className="flex-1 flex flex-col min-h-0">
            {/* Section Ticker / Header */}
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#26262B] shrink-0 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#FFAE52]">04</span>
                <span className="text-xs uppercase tracking-widest text-[#F4F4F5] font-semibold">
                  Mathematical Formulations &amp; Algorithmic Proofs
                </span>
              </div>
              <span className="text-[11px] text-[#9A9AA3]">
                Numerically Stable Log-Softmax &amp; Log-Space Perplexity
              </span>
            </div>

            <div className="flex-1 min-h-0">
              <MathTheoryExplorer />
            </div>
          </div>

          {/* Anchored Compact Footer */}
          <footer className="border-t border-[#26262B] pt-4 mt-6 font-mono text-xs text-[#9A9AA3] shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52]" />
                <span>DistilGPT-2 Perplexity Engine</span>
                <span className="text-[#26262B]">•</span>
                <span>Xenova/distilgpt2 (q8 ONNX) In-Browser</span>
              </div>
              <div className="flex items-center gap-3">
                <span>React Bits ShapeWaves</span>
                <span>•</span>
                <span>Lenis Horizontal Scroll</span>
                <span>•</span>
                <span className="text-[#FFAE52] font-semibold">Vercel Deployed</span>
              </div>
            </div>
          </footer>
        </section>
      </div>

      {/* 3. Fixed 2px Bottom Progress Rail */}
      <div className="fixed bottom-0 left-0 right-0 h-[2px] bg-[#26262B] z-50 pointer-events-none">
        <div
          className="h-full bg-[#FFAE52] shadow-[0_0_10px_rgba(255,174,82,0.7)] transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 4. Subtle Monospace Panel Counter (Bottom Right) */}
      <div className="fixed bottom-3 right-4 sm:right-6 z-40 flex items-center gap-2.5 font-mono text-[11px] bg-[#09090B]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#26262B] text-[#9A9AA3] select-none shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52] animate-pulse" />
        <span className="text-[#F4F4F5] font-bold">
          {activePanel === 'overview'
            ? '01'
            : activePanel === 'runner'
            ? '02'
            : activePanel === 'simulator'
            ? '03'
            : '04'}
        </span>
        <span className="text-[#26262B]">/</span>
        <span>04</span>
        <span className="hidden sm:inline text-[#26262B]">•</span>
        <span className="hidden sm:inline text-[#FFAE52] uppercase font-semibold">
          {PANEL_LABELS[activePanel]}
        </span>
      </div>

      {/* 5. Subtle Monospace Keyboard Hint (Bottom Left on Desktop) */}
      <div className="fixed bottom-3 left-4 sm:left-6 z-40 hidden lg:flex items-center gap-2 font-mono text-[11px] bg-[#09090B]/90 backdrop-blur-md px-3 py-1.5 rounded-md border border-[#26262B] text-[#9A9AA3] select-none pointer-events-none shadow-lg">
        <span className="px-1 py-0.5 rounded bg-[#141417] border border-[#26262B] text-[#FFAE52] font-semibold text-[10px]">
          ←
        </span>
        <span className="px-1 py-0.5 rounded bg-[#141417] border border-[#26262B] text-[#FFAE52] font-semibold text-[10px]">
          →
        </span>
        <span>Navigate panels</span>
      </div>
    </main>
  );
}
