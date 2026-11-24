'use client';

import React from 'react';
import type { NextTokenCandidate } from '@/lib/perplexity-math';
import { Compass, CornerDownRight, TrendingUp, BarChart3, Plus } from 'lucide-react';

interface NextTokenPredictionsProps {
  candidates: NextTokenCandidate[];
  evaluatedSentence: string;
  onAppendToken?: (rawTokenText: string) => void;
}

export function NextTokenPredictions({
  candidates,
  evaluatedSentence,
  onAppendToken,
}: NextTokenPredictionsProps) {
  if (!candidates || candidates.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Decorative gradient corner glow */}
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Zero-Cost Forward Pass Reuse</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-zinc-300">Position n-1 Softmax</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Next-Token Prediction Engine
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Derived directly from the final logit slice of the same forward pass. Shows the top 8 ranked continuation tokens, exact probabilities, and relative proportions to #1.
          </p>
        </div>
      </div>

      {/* Current Context Banner */}
      <div className="mt-6 p-3.5 rounded-xl border border-white/10 bg-zinc-950/70 flex items-center gap-3 text-xs font-mono">
        <span className="text-zinc-500 uppercase tracking-wider font-semibold">Context Prompt:</span>
        <span className="text-cyan-300 font-semibold truncate">"{evaluatedSentence}"</span>
        <CornerDownRight className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-auto" />
      </div>

      {/* Top-8 Ranked Tokens Grid / List */}
      <div className="mt-6 space-y-3">
        {candidates.map((c) => {
          const isTop1 = c.rank === 1;

          return (
            <div
              key={c.rank}
              className={`p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isTop1
                  ? 'border-cyan-500/50 bg-cyan-950/20 shadow-md shadow-cyan-950/40'
                  : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20'
              }`}
            >
              {/* Relative Probability Fill Background Bar */}
              <div
                className={`absolute top-0 bottom-0 left-0 transition-all pointer-events-none opacity-15 ${
                  isTop1 ? 'bg-cyan-400' : 'bg-blue-400'
                }`}
                style={{ width: `${c.relativeRatio * 100}%` }}
              />

              {/* Left Column: Rank + Token Display */}
              <div className="flex items-center gap-3 z-10">
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    isTop1
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                      : 'bg-white/10 text-zinc-400'
                  }`}
                >
                  #{c.rank}
                </span>

                <div className="flex items-center gap-2">
                  <span className="bg-black/60 border border-white/15 px-3 py-1 rounded-lg font-mono text-sm font-semibold text-white tracking-wide">
                    {c.token}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    ID {c.tokenId}
                  </span>
                </div>
              </div>

              {/* Right Column: Probabilities & Relative Proportions */}
              <div className="flex items-center gap-4 z-10 self-end sm:self-center font-mono text-xs">
                {/* Probability */}
                <div className="text-right">
                  <div className="font-bold text-cyan-300 text-sm">
                    {c.probPercent}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    P = {c.prob.toFixed(4)}
                  </div>
                </div>

                {/* Relative proportion to #1 */}
                <div className="text-right min-w-[70px]">
                  <div className="text-zinc-300 font-medium">
                    {c.relativeRatioPercent}
                  </div>
                  <div className="text-[10px] text-zinc-500">
                    of Top #1
                  </div>
                </div>

                {/* Optional append button */}
                {onAppendToken && (
                  <button
                    type="button"
                    onClick={() => {
                      // Remove explicit replacement markers for append
                      const raw = c.token.replace(/␣/g, ' ').replace(/↵/g, '\n').replace(/⇥/g, '\t');
                      onAppendToken(raw);
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 text-zinc-400 transition-all cursor-pointer"
                    title={`Append "${c.token}" to prompt`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
