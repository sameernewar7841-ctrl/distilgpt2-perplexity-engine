'use client';

import React, { useState, useMemo } from 'react';
import {
  calculatePerplexity,
  formatSignificantDigits,
  makeWhitespaceExplicit,
  type PerplexityBreakdown,
} from '@/lib/perplexity-math';
import { Plus, Trash2, RotateCcw, Sparkles, AlertCircle, Info, Calculator, CheckCircle2 } from 'lucide-react';

interface ManualRow {
  id: string;
  token: string;
  probStr: string;
}

const PRESET_1: ManualRow[] = [
  { id: '1', token: 'I', probStr: '0.5' },
  { id: '2', token: 'love', probStr: '0.8' },
  { id: '3', token: 'Python', probStr: '0.2' },
];

const PRESET_2: ManualRow[] = Array.from({ length: 8 }, (_, i) => ({
  id: String(i + 1),
  token: `token_${i + 1}`,
  probStr: '0.125',
}));

const PRESET_3: ManualRow[] = [
  { id: '1', token: 'The', probStr: '0.9' },
  { id: '2', token: 'cat', probStr: '0.9' },
  { id: '3', token: 'sat', probStr: '0.9' },
  { id: '4', token: 'quietly', probStr: '0.01' },
];

export function ManualSimulator() {
  const [rows, setRows] = useState<ManualRow[]>(PRESET_1);
  const [activePreset, setActivePreset] = useState<'p1' | 'p2' | 'p3' | 'custom'>('p1');

  // Validate and compute breakdown
  const { validationError, breakdown } = useMemo(() => {
    if (rows.length === 0) {
      return { validationError: null, breakdown: null };
    }

    const parsedItems: Array<{ token: string; prob: number }> = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const p = parseFloat(row.probStr);

      if (isNaN(p) || p <= 0 || p > 1) {
        return {
          validationError: `Row #${i + 1} ("${row.token || 'untitled'}"): Probability must satisfy 0 < P ≤ 1. Received: "${row.probStr}"`,
          breakdown: null,
        };
      }

      parsedItems.push({
        token: row.token || `token_${i + 1}`,
        prob: p,
      });
    }

    const res = calculatePerplexity(parsedItems);
    return { validationError: null, breakdown: res };
  }, [rows]);

  const handleRowChange = (id: string, field: 'token' | 'probStr', value: string) => {
    setActivePreset('custom');
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleAddRow = () => {
    setActivePreset('custom');
    const newId = String(Date.now() + Math.random());
    setRows((prev) => [...prev, { id: newId, token: 'next_word', probStr: '0.5' }]);
  };

  const handleDeleteRow = (id: string) => {
    setActivePreset('custom');
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleApplyPreset = (presetKey: 'p1' | 'p2' | 'p3') => {
    setActivePreset(presetKey);
    if (presetKey === 'p1') setRows(PRESET_1);
    if (presetKey === 'p2') setRows(PRESET_2);
    if (presetKey === 'p3') setRows(PRESET_3);
  };

  const handleReset = () => {
    handleApplyPreset('p1');
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl p-6 md:p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30">
      {/* Decorative gradient corner glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-br from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Laboratory</span>
            <span className="text-white/40">•</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              100% Offline Capable
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Offline Manual Perplexity Simulator
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
            Directly manipulate token probabilities to explore geometric mean scaling, uniform distributions, and the dramatic impact of unexpected tokens.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 uppercase font-mono tracking-wider mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('p1')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'p1'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 font-semibold'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            I love Python (Default)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('p2')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'p2'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 font-semibold'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            All 1/8 (Perplexity = 8)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('p3')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activePreset === 'p3'
                ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 font-semibold'
                : 'bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10'
            }`}
          >
            One Surprising Word (Spike)
          </button>
        </div>
      </div>

      {/* Interactive Table Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <span>Tokens & Probabilities Table</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              {rows.length} {rows.length === 1 ? 'token' : 'tokens'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Token Row</span>
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
              title="Reset to default preset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-rose-300">Validation Error:</span> {validationError}
            </div>
          </div>
        )}

        {/* Empty State */}
        {rows.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-white/15 bg-white/5">
            <AlertCircle className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
            <p className="text-sm text-zinc-300 font-medium">No tokens in simulator table</p>
            <p className="text-xs text-zinc-500 mt-1">Add a new token row or select a preset to compute perplexity.</p>
            <button
              type="button"
              onClick={() => handleApplyPreset('p1')}
              className="mt-4 px-4 py-2 rounded-lg bg-cyan-500 text-black text-xs font-semibold shadow hover:bg-cyan-400 transition-all"
            >
              Load Default Preset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-zinc-400 uppercase font-mono tracking-wider">
                  <th className="py-2.5 px-3 w-12 text-center">#</th>
                  <th className="py-2.5 px-3 min-w-[140px]">Token Word</th>
                  <th className="py-2.5 px-3 min-w-[160px]">
                    Probability <span className="font-serif italic lowercase font-normal">P</span> (0 &lt; P ≤ 1)
                  </th>
                  <th className="py-2.5 px-3 min-w-[140px]">
                    Inverse Prob <span className="font-serif italic lowercase font-normal">1 / P</span>
                  </th>
                  <th className="py-2.5 px-3 min-w-[120px]">-ln(P) Loss</th>
                  <th className="py-2.5 px-3 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {rows.map((row, index) => {
                  const pVal = parseFloat(row.probStr);
                  const isRowValid = !isNaN(pVal) && pVal > 0 && pVal <= 1;
                  const invP = isRowValid ? 1 / pVal : NaN;
                  const negLn = isRowValid ? -Math.log(pVal) : NaN;

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-white/[0.03] ${
                        !isRowValid ? 'bg-rose-950/20' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 text-center text-zinc-500 font-semibold">{index + 1}</td>
                      <td className="py-2.5 px-3">
                        <input
                          type="text"
                          value={row.token}
                          onChange={(e) => handleRowChange(row.id, 'token', e.target.value)}
                          placeholder="word"
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-zinc-100 text-xs focus:outline-none focus:border-cyan-500 font-mono transition-colors"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={row.probStr}
                            onChange={(e) => handleRowChange(row.id, 'probStr', e.target.value)}
                            placeholder="0.0 - 1.0"
                            className={`w-full bg-white/5 border rounded-lg px-2.5 py-1 text-xs focus:outline-none font-mono transition-colors ${
                              isRowValid
                                ? 'border-white/10 text-cyan-300 focus:border-cyan-500'
                                : 'border-rose-500/70 text-rose-300 focus:border-rose-500'
                            }`}
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono ${
                            isRowValid ? 'text-amber-300 bg-amber-500/10' : 'text-zinc-600'
                          }`}
                        >
                          {isRowValid ? formatSignificantDigits(invP) : '—'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-400">
                        {isRowValid ? formatSignificantDigits(negLn) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1 rounded text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                          title="Remove row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3-Step Perplexity Breakdown */}
      {breakdown && (
        <div className="mt-8 space-y-6 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Live 3-Step Perplexity Calculation
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 relative flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold mb-1">
                  Step 1 • Product of 1/P
                </div>
                <div className="text-xs text-zinc-400 mb-3">
                  Accumulate inverse probabilities <span className="font-mono text-zinc-200">∏ (1 / Pᵢ) = eˢ</span>
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
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 relative flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1">
                  Step 2 • Token Count
                </div>
                <div className="text-xs text-zinc-400 mb-3">
                  Number of evaluated tokens in sequence <span className="font-mono text-zinc-200">N</span>
                </div>
              </div>
              <div className="bg-black/50 border border-white/5 rounded-lg p-3">
                <div className="text-xl md:text-2xl font-mono font-bold text-blue-200">
                  {breakdown.tokenCount}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono mt-1">
                  Average NLL = {formatSignificantDigits(breakdown.averageLoss)}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-br from-cyan-950/40 to-blue-950/40 p-4 relative flex flex-col justify-between shadow-lg shadow-cyan-950/50">
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
                <div className="text-[10px] text-emerald-400/90 font-mono mt-1">
                  Final Evaluated Perplexity
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
                Lower perplexity means the model is more confident and predictive. Higher perplexity indicates greater surprise or uncertainty.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
