'use client';

import React from 'react';
import {
  formatSignificantDigits,
  type TokenEvaluation,
  type PerplexityBreakdown,
} from '@/lib/perplexity-math';

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
    <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 md:p-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#26262B]">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#FFAE52] font-bold">02</span>
          <h3 className="text-xl md:text-2xl heading-editorial">
            Token-by-Token Probabilities
          </h3>
        </div>
        <div className="font-mono text-xs text-[#9A9AA3]">
          Inference: <span className="text-[#F4F4F5] font-tabular">{inferenceTimeMs}ms</span>
        </div>
      </div>

      {/* Decoded Sequence Ribbon */}
      <div className="p-4 rounded-lg border border-[#26262B] bg-[#09090B]">
        <div className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3] mb-3">
          Decoded Token Sequence (Spaces = <span className="text-[#F4F4F5]">␣</span>, Newlines = <span className="text-[#F4F4F5]">↵</span>)
        </div>
        <div className="flex flex-wrap gap-2">
          {tokens.map((t) => (
            <div
              key={t.index}
              className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#26262B] bg-[#141417] text-xs font-mono font-tabular text-[#F4F4F5] hover:border-[#FFAE52]/50 transition-colors"
            >
              <span className="text-[10px] text-[#9A9AA3]">#{t.index}</span>
              <span className="font-semibold text-[#F4F4F5] bg-[#09090B] px-1 py-0.5 rounded border border-[#26262B]">
                {t.token}
              </span>
              <span className="text-[11px] text-[#9A9AA3]">
                {(t.prob * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Technical Table */}
      <div className="overflow-x-auto rounded-lg border border-[#26262B] bg-[#09090B]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#26262B] bg-[#141417] text-[#9A9AA3] uppercase font-mono tracking-wider">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[140px]">Decoded Token</th>
              <th className="py-3 px-4 min-w-[160px]">
                Probability <span className="font-serif italic lowercase font-normal">P</span>
              </th>
              <th className="py-3 px-4 min-w-[160px]">
                Inverse Prob <span className="font-serif italic lowercase font-normal">1 / P</span>
              </th>
              <th className="py-3 px-4 min-w-[140px]">-ln(P) Loss</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#26262B] font-mono font-tabular">
            {tokens.map((t) => (
              <tr key={t.index} className="hover:bg-[#141417]/50 transition-colors">
                <td className="py-3 px-4 text-center text-[#9A9AA3]">{t.index}</td>
                <td className="py-3 px-4">
                  <span className="inline-block bg-[#141417] border border-[#26262B] px-2 py-0.5 rounded text-[#F4F4F5] font-semibold">
                    {t.token}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#F4F4F5]">
                  <span>{formatSignificantDigits(t.prob)}</span>
                  <span className="text-[11px] text-[#9A9AA3] ml-2">
                    ({(t.prob * 100).toFixed(1)}%)
                  </span>
                </td>
                <td className="py-3 px-4 text-[#F4F4F5]">
                  <span className="px-2 py-0.5 rounded bg-[#141417] border border-[#26262B]">
                    {formatSignificantDigits(t.inverseProb)}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#9A9AA3]">
                  {formatSignificantDigits(-t.logProb)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3-Step Perplexity Calculation Breakdown */}
      <div className="pt-2 space-y-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#9A9AA3]">
          3-Step Geometric Mean Breakdown
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div className="border border-[#26262B] bg-[#09090B] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-[#9A9AA3] mb-1">
                01 / PRODUCT OF 1/P
              </div>
              <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                ∏ (1 / Pᵢ) = eˢ
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold font-tabular text-[#F4F4F5] break-all">
                {breakdown.productInversePFormatted}
              </div>
              <div className="text-[10px] text-[#9A9AA3] font-mono mt-1 font-tabular">
                Log Sum S = {formatSignificantDigits(breakdown.sumNegLogProb)}
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-[#26262B] bg-[#09090B] rounded-lg p-4 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono text-[#9A9AA3] mb-1">
                02 / TOKEN COUNT
              </div>
              <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                Evaluated tokens (N)
              </div>
            </div>
            <div>
              <div className="text-xl md:text-2xl font-mono font-bold font-tabular text-[#F4F4F5]">
                {breakdown.tokenCount}
              </div>
              <div className="text-[10px] text-[#9A9AA3] font-mono mt-1 font-tabular">
                Loss (S/N) = {formatSignificantDigits(breakdown.averageLoss)}
              </div>
            </div>
          </div>

          {/* Step 3 - Final Output Highlighted in Lighter Orange #FFAE52 */}
          <div className="border border-[#FFAE52]/50 bg-[#09090B] rounded-lg p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(255,160,72,0.06)]">
            <div>
              <div className="text-[11px] font-mono text-[#FFAE52] font-bold mb-1">
                03 / GEOMETRIC MEAN (PERPLEXITY)
              </div>
              <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                (Product)^(1/N) = e^(loss)
              </div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-mono font-black font-tabular text-[#FFAE52]">
                {breakdown.perplexityFormatted}
              </div>
              <div className="text-[10px] text-[#9A9AA3] font-mono mt-1">
                Final Evaluated Perplexity
              </div>
            </div>
          </div>
        </div>

        {/* Plain-English Interpretation Callout */}
        <div className="border border-[#26262B] border-l-2 border-l-[#FFAE52] bg-[#141417] p-4 rounded-lg">
          <div className="text-xs font-mono uppercase tracking-wider text-[#FFAE52] mb-1">
            Plain-English Interpretation
          </div>
          <div className="text-sm font-medium text-[#F4F4F5]">
            {breakdown.interpretation}
          </div>
          <div className="text-xs text-[#9A9AA3] mt-1 font-mono">
            Lower perplexity means the model assigned higher probability to this exact sequence. Higher perplexity indicates greater surprise.
          </div>
        </div>
      </div>
    </div>
  );
}
