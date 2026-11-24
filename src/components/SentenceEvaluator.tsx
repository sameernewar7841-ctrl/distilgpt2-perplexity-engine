'use client';

import React, { useState } from 'react';
import { Play, Sparkles, AlertCircle, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
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
  { label: 'I love Python', sentence: 'I love Python', tag: 'Natural & Coherent' },
  { label: 'Python love I', sentence: 'Python love I', tag: 'Unnatural Syntax' },
  { label: 'The capital of France is Paris', sentence: 'The capital of France is Paris', tag: 'Factual High-Confidence' },
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

  const handleInputChange = (val: string) => {
    setLocalInput(val);
    onTextChange(val);
  };

  const handlePresetClick = (sentence: string) => {
    setLocalInput(sentence);
    onTextChange(sentence);
    onEvaluate(sentence);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localInput.trim() || isBusy) return;
    onEvaluate(localInput);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header and status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>In-Browser Neural Engine</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-zinc-300">Xenova/distilgpt2 (q8 ONNX)</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Sentence Input & Quick Presets
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Type any sentence or pick a preset to evaluate token probabilities, sequence perplexity, and top-8 next tokens.
          </p>
        </div>

        {/* Model State Pill */}
        <div className="flex items-center">
          {isModelLoaded ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium font-mono">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Model In Memory (Cached)</span>
            </div>
          ) : status === 'loading_model' ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium font-mono">
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>Downloading Model...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Lazy Loaded (Ready to Download)</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-6">
        <label className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-2">
          One-Click Teaching Presets (Triggers Evaluation Immediately):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = localInput === preset.sentence;
            return (
              <button
                key={preset.sentence}
                type="button"
                onClick={() => handlePresetClick(preset.sentence)}
                disabled={isBusy}
                className={`text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-950/50'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20'
                } ${isBusy ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="text-xs font-mono font-semibold text-cyan-300 mb-1 flex items-center justify-between">
                  <span>"{preset.label}"</span>
                  <Sparkles className="w-3 h-3 text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-[11px] text-zinc-400">{preset.tag}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="sentence-input" className="text-xs uppercase font-mono tracking-wider text-zinc-400 block mb-2">
            Free-Text Sentence:
          </label>
          <div className="relative">
            <input
              id="sentence-input"
              type="text"
              value={localInput}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Enter any sentence (e.g. 'I love Python')"
              disabled={isBusy}
              className="w-full bg-zinc-950/80 border border-white/15 focus:border-cyan-500 rounded-xl px-4 py-3.5 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all font-mono"
            />
          </div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-zinc-500 font-mono">
            <span>Encoding prepends </span>
            <code className="text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">
              &lt;|endoftext|&gt; (50256)
            </code>
            <span> for initial word context</span>
          </div>

          <button
            type="submit"
            disabled={!localInput.trim() || isBusy}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !localInput.trim() || isBusy
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-110 active:scale-95'
            }`}
          >
            {isBusy ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-400" />
                <span>{status === 'loading_model' ? 'Loading Model Weights...' : 'Computing Logits...'}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Evaluate Perplexity</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Download Progress Bar */}
      {status === 'loading_model' && progress && (
        <div className="mt-6 p-4 rounded-xl border border-cyan-500/30 bg-cyan-950/20 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Downloading {progress.file}
            </span>
            <span className="font-bold">{progress.progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 rounded-full"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-400 mt-2">
            First-time download only (~80 MB 8-bit quantized ONNX). Cached in browser IndexedDB/Cache API for instant future runs.
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 rounded-xl border border-rose-500/40 bg-rose-950/20 text-rose-200 text-xs flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-rose-300">Model Runner Notice:</span> {error}
          </div>
        </div>
      )}
    </div>
  );
}
