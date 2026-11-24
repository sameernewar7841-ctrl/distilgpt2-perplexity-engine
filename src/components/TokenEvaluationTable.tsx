'use client';

import React from 'react';
import {
  formatSignificantDigits,
  type TokenEvaluation,
  type PerplexityBreakdown,
} from '@/lib/perplexity-math';
import { Sparkles, Layers, CheckCircle2, Sigma, Hash, Zap } from 'lucide-react';

interface TokenEvaluationTableProps {
  tokens: TokenEvaluation[];
  breakdown: PerplexityBreakdown;
  inferenceTimeMs: number;
}

export function TokenEvaluationTable({
  tokens,
  breakdown,
  inferenceTimeMs,
}: TokenEvaluationTableProps) {
  if (!tokens || tokens.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-300 mb-2">
            <Layers className="w-3.5 h-3.5" />
            <span>Conditional Probability Breakdown</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-zinc-300">{inferenceTimeMs}ms execution</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Token-by-Token Probability & Perplexity Evaluator
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Explicit tokenization with whitespace markers (<code className="text-cyan-300 font-mono">␣</code> = space, <code className="text-cyan-300 font-mono">↵</code> = newline), probabilities, inverse probabilities, and 3-step geometric mean.
          </p>
        </div>
      </div>

      {/* Visual Token Ribbon */}
      <div className="mt-6 p-4 rounded-xl border border-white/10 bg-zinc-950/60">
        <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3 flex items-center justify-between">
          <span>Decoded Sequence Tokens:</span>
          <span className="text-zinc-500 text-[11px]">Hover or inspect token chips</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {tokens.map((t) => {
            const isHighSurprise = t.prob < 0.05;
            const isMediumSurprise = t.prob >= 0.05 && t.prob < 0.25;

            return (
              <div
                key={t.index}
                className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isHighSurprise
                    ? 'border-rose-500/50 bg-rose-950/30 text-rose-200'
                    : isMediumSurprise
                    ? 'border-amber-500/40 bg-amber-950/30 text-amber-200'
                    : 'border-cyan-500/40 bg-cyan-950/30 text-cyan-200'
                }`}
              >
                <span className="text-[10px] text-zinc-400 font-bold">#{t.index}</span>
                <span className="font-semibold bg-white/10 px-1.5 py-0.5 rounded text-white tracking-wide">
                  {t.token}
                </span>
                <span className="text-[11px] opacity-80">
                  {(t.prob * 100).toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Token Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/50">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5 text-zinc-400 uppercase font-mono tracking-wider">
              <th className="py-2.5 px-4 w-14 text-center">#</th>
              <th className="py-2.5 px-4 min-w-[140px]">Decoded Token</th>
              <th className="py-2.5 px-4 min-w-[150px]">
                Probability <span className="font-serif italic lowercase font-normal">P</span>
              </th>
              <th className="py-2.5 px-4 min-w-[150px]">
                Inverse Prob <span className="font-serif italic lowercase font-normal">1 / P</span>
              </th>
              <th className="py-2.5 px-4 min-w-[140px]">-ln(P) Loss</th>
              <th className="py-2.5 px-4 min-w-[140px]">Surprise Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {tokens.map((t) => {
              const isHighSurprise = t.prob < 0.05;
              const isMediumSurprise = t.prob >= 0.05 && t.prob < 0.25;

              return (
                <tr key={t.index} className="hover:bg-white/[0.03] transition-colors">
                  <td className="py-3 px-4 text-center text-zinc-500 font-bold">{t.index}</td>
                  <td className="py-3 px-4">
                    <span className="inline-block bg-white/10 border border-white/15 px-2 py-0.5 rounded text-white font-semibold">
                      {t.token}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-cyan-300 font-medium">
                      {formatSignificantDigits(t.prob)}
                    </span>
                    <span className="text-[11px] text-zinc-500 ml-2">
                      ({(t.prob * 100).toFixed(1)}%)
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {formatSignificantDigits(t.inverseProb)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {formatSignificantDigits(-t.logProb)}
                  </td>
                  <td className="py-3 px-4">
                    {isHighSurprise ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300">
                        High Surprise
                      </span>
                    ) : isMediumSurprise ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                        Moderate
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                        Expected
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 3-Step Perplexity Calculation Breakdown Cards */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <h3 className="text-base font-semibold text-white tracking-tight">
            3-Step Perplexity Calculation Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                Step 1 • Product of All 1/P
              </div>
              <div className="text-xs text-zinc-400 mb-3">
                Accumulated inverse probabilities <span className="font-mono text-zinc-200">∏ (1 / Pᵢ)</span>
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-lg p-3">
              <div className="text-xl md:text-2xl font-mono font-bold text-cyan-200 break-all">
                {breakdown.productInversePFormatted}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                Log Sum S = {formatSignificantDigits(breakdown.sumNegLogProb)}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
                Step 2 • Token Count (N)
              </div>
              <div className="text-xs text-zinc-400 mb-3">
                Total evaluated tokens in sentence
              </div>
            </div>
            <div className="bg-black/50 border border-white/5 rounded-lg p-3">
              <div className="text-xl md:text-2xl font-mono font-bold text-blue-200">
                {breakdown.tokenCount}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">
                Average Negative Log-Likelihood = {formatSignificantDigits(breakdown.averageLoss)}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 p-4 flex flex-col justify-between shadow-lg shadow-cyan-950/50">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                Step 3 • Geometric Mean (N-th Root)
              </div>
              <div className="text-xs text-zinc-300 mb-3">
                Perplexity = <span className="font-mono text-white">(Product)^(1/N) = e^(loss)</span>
              </div>
            </div>
            <div className="bg-black/60 border border-cyan-500/30 rounded-lg p-3">
              <div className="text-2xl md:text-3xl font-mono font-black text-white">
                {breakdown.perplexityFormatted}
              </div>
              <div className="text-[10px] text-emerald-400 font-mono mt-1">
                Sentence Perplexity
              </div>
            </div>
          </div>
        </div>

        {/* Plain-English Interpretation */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-start gap-3.5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider font-mono">
              Plain-English Interpretation
            </div>
            <div className="text-sm text-zinc-200 mt-1 font-medium">
              {breakdown.interpretation}
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              A lower perplexity score indicates that the sequence aligns strongly with the language model's learned distribution of natural language.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
