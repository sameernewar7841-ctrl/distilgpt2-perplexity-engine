'use client';

import React from 'react';
import type { NextTokenCandidate } from '@/lib/perplexity-math';
import { Plus } from 'lucide-react';

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
    <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#26262B]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#FF7A1A] font-bold">03</span>
          <h3 className="text-xl md:text-2xl heading-editorial">
            Next-Token Predictions
          </h3>
        </div>
        <div className="font-mono text-xs text-[#9A9AA3]">
          Slice: <span className="text-[#F4F4F5]">Position n-1 Logits</span>
        </div>
      </div>

      {/* Context Banner */}
      <div className="p-3.5 rounded-lg border border-[#26262B] bg-[#09090B] flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="text-[#9A9AA3] uppercase">Context Prompt:</span>
          <span className="text-[#F4F4F5] font-semibold truncate">"{evaluatedSentence}"</span>
        </div>
        <span className="text-[#9A9AA3] text-[11px] shrink-0">Reused single forward pass</span>
      </div>

      {/* Top 8 Candidates List */}
      <div className="space-y-2 font-mono">
        {candidates.map((c) => {
          const isTop1 = c.rank === 1;

          return (
            <div
              key={c.rank}
              className={`p-3.5 rounded-lg border transition-all relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isTop1
                  ? 'border-[#FF7A1A]/50 bg-[#09090B] shadow-[0_0_15px_rgba(255,122,26,0.03)]'
                  : 'border-[#26262B] bg-[#09090B] hover:border-[#383840]'
              }`}
            >
              {/* Relative proportion fill bar */}
              <div
                className="absolute top-0 bottom-0 left-0 bg-[#26262B]/60 pointer-events-none transition-all"
                style={{ width: `${c.relativeRatio * 100}%` }}
              />

              {/* Left Column: Rank + Token */}
              <div className="flex items-center gap-3 z-10">
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs font-tabular ${
                    isTop1
                      ? 'bg-[#FF7A1A] text-[#09090B]'
                      : 'bg-[#141417] text-[#9A9AA3] border border-[#26262B]'
                  }`}
                >
                  #{c.rank}
                </span>

                <div className="flex items-center gap-2">
                  <span className="bg-[#141417] border border-[#26262B] px-2.5 py-0.5 rounded text-sm font-semibold text-[#F4F4F5]">
                    {c.token}
                  </span>
                  <span className="text-[11px] text-[#9A9AA3] font-tabular">
                    ID {c.tokenId}
                  </span>
                </div>
              </div>

              {/* Right Column: Probabilities & Actions */}
              <div className="flex items-center gap-4 z-10 self-end sm:self-center text-xs font-tabular">
                <div className="text-right">
                  <div className={`font-bold ${isTop1 ? 'text-[#FF7A1A]' : 'text-[#F4F4F5]'}`}>
                    {c.probPercent}
                  </div>
                  <div className="text-[10px] text-[#9A9AA3]">
                    P = {c.prob.toFixed(4)}
                  </div>
                </div>

                <div className="text-right min-w-[70px]">
                  <div className="text-[#F4F4F5] font-medium">
                    {c.relativeRatioPercent}
                  </div>
                  <div className="text-[10px] text-[#9A9AA3]">
                    of Rank #1
                  </div>
                </div>

                {onAppendToken && (
                  <button
                    type="button"
                    onClick={() => {
                      const raw = c.token.replace(/␣/g, ' ').replace(/↵/g, '\n').replace(/⇥/g, '\t');
                      onAppendToken(raw);
                    }}
                    className="p-1.5 rounded border border-[#26262B] bg-[#141417] hover:border-[#FF7A1A]/40 hover:text-[#FF7A1A] text-[#9A9AA3] transition-colors cursor-pointer active:scale-95"
                    title={`Append "${c.token}" to sentence`}
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
