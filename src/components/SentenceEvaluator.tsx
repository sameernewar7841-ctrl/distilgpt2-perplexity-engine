'use client';

import React, { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { ProgressState, RunnerStatus } from '@/hooks/use-lm-runner';

interface SentenceEvaluatorProps {
  currentText: string;
  onTextChange: (text: string) => void;
  onEvaluate: (sentence: string) => void;
  status: RunnerStatus;
  isBusy: boolean;
  isModelLoaded: boolean;
  progress: ProgressState | null;
  error: string | null;
}

const PRESETS = [
  { label: 'I love Python', sentence: 'I love Python', note: 'Natural syntax' },
  { label: 'Python love I', sentence: 'Python love I', note: 'Permuted order' },
  { label: 'The capital of France is Paris', sentence: 'The capital of France is Paris', note: 'Factual context' },
];

export function SentenceEvaluator({
  currentText,
  onTextChange,
  onEvaluate,
  status,
  isBusy,
  isModelLoaded,
  progress,
  error,
}: SentenceEvaluatorProps) {
  const [localInput, setLocalInput] = useState<string>(currentText);
  const [activeEvaluated, setActiveEvaluated] = useState<string | null>(null);

  const handleInputChange = (val: string) => {
    setLocalInput(val);
    onTextChange(val);
  };

  const handlePresetClick = (sentence: string) => {
    setLocalInput(sentence);
    setActiveEvaluated(sentence);
    onTextChange(sentence);
    onEvaluate(sentence);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isBusy) return;
    setActiveEvaluated(localInput.trim());
    onEvaluate(localInput);
  };

  return (
    <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 md:p-8">
      {/* Clean Single Title Row with Minimal Status Dot */}
      <div className="flex items-center justify-between pb-6 border-b border-[#26262B]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#FF5A1F] font-bold">01</span>
          <h2 className="text-xl md:text-2xl heading-editorial">
            Sequence Input &amp; Evaluation
          </h2>
        </div>

        {/* Minimal Right-Aligned Model Status */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#9A9AA3]">
          {isModelLoaded ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
              <span className="text-[#F4F4F5]">Model Cached (In-Memory)</span>
            </>
          ) : status === 'loading_model' ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] animate-pulse" />
              <span className="text-[#F4F4F5]">Downloading Weights...</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A9AA3]" />
              <span>Xenova/distilgpt2 (q8)</span>
            </>
          )}
        </div>
      </div>

      {/* 3 Clickable Presets Bar */}
      <div className="mt-6">
        <div className="text-xs font-mono uppercase tracking-wider text-[#9A9AA3] mb-2.5">
          Preset Sequences (Click to Evaluate)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {PRESETS.map((preset) => {
            const isEvaluated = activeEvaluated === preset.sentence;
            return (
              <button
                key={preset.sentence}
                type="button"
                onClick={() => handlePresetClick(preset.sentence)}
                disabled={isBusy}
                className={`group flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  isEvaluated
                    ? 'border-[#FF5A1F] bg-[#FF5A1F]/5 text-[#F4F4F5]'
                    : 'border-[#26262B] bg-[#09090B] hover:border-[#383840] hover:bg-[#1A1A1E] text-[#F4F4F5]'
                } ${isBusy ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div>
                  <div className="text-xs font-mono font-medium text-[#F4F4F5]">
                    "{preset.label}"
                  </div>
                  <div className="text-[11px] text-[#9A9AA3] mt-0.5">
                    {preset.note}
                  </div>
                </div>
                <ArrowRight
                  className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                    isEvaluated ? 'text-[#FF5A1F]' : 'text-[#9A9AA3] group-hover:text-[#F4F4F5]'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="sentence-input" className="text-xs font-mono uppercase tracking-wider text-[#9A9AA3] block mb-2">
            Input Sentence
          </label>
          <input
            id="sentence-input"
            type="text"
            value={localInput}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Enter custom sentence..."
            disabled={isBusy}
            className="w-full bg-[#09090B] border border-[#26262B] focus:border-[#FF5A1F] rounded-lg px-4 py-3.5 text-base md:text-lg text-[#F4F4F5] placeholder-[#9A9AA3]/40 focus:outline-none focus:ring-1 focus:ring-[#FF5A1F] transition-colors font-mono font-tabular"
          />
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
          <div className="text-xs font-mono text-[#9A9AA3]">
            Auto-prepends <span className="text-[#F4F4F5] bg-[#09090B] px-1.5 py-0.5 border border-[#26262B] rounded">&lt;|endoftext|&gt; (50256)</span> to provide causal context for token #1
          </div>

          <button
            type="submit"
            disabled={!localInput.trim() || isBusy}
            className={`w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              !localInput.trim() || isBusy
                ? 'bg-[#26262B] text-[#9A9AA3] cursor-not-allowed'
                : 'bg-[#FF5A1F] hover:bg-[#E04812] text-[#09090B]'
            }`}
          >
            {isBusy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#09090B]" />
                <span>Computing...</span>
              </>
            ) : (
              <span>Evaluate Perplexity →</span>
            )}
          </button>
        </div>
      </form>

      {/* First-Time Download Progress (Monochrome + Vermilion) */}
      {status === 'loading_model' && progress && (
        <div className="mt-6 p-4 rounded-lg border border-[#26262B] bg-[#09090B] animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-[#F4F4F5] mb-2">
            <span>Downloading {progress.file}...</span>
            <span className="font-tabular font-bold text-[#FF5A1F]">{progress.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#26262B] overflow-hidden">
            <div
              className="h-full bg-[#FF5A1F] transition-all duration-200"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="text-[11px] font-mono text-[#9A9AA3] mt-2">
            Cached in browser Cache API / IndexedDB for zero-download subsequent runs.
          </div>
        </div>
      )}

      {/* Clean Offline / Error Notice (No generic red box) */}
      {error && (
        <div className="mt-6 p-4 rounded-lg border border-[#26262B] border-l-2 border-l-[#FF5A1F] bg-[#09090B] text-xs font-mono text-[#F4F4F5] animate-fadeIn">
          <div className="text-[#FF5A1F] font-bold uppercase tracking-wider mb-1">Notice</div>
          <div className="text-[#9A9AA3] leading-relaxed">{error}</div>
        </div>
      )}
    </div>
  );
}
