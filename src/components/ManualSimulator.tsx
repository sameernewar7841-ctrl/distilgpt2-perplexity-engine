'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  calculatePerplexity,
  formatSignificantDigits,
} from '@/lib/perplexity-math';
import { useLenisScroll } from '@/components/SmoothScroll';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

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
  const { resize } = useLenisScroll();

  useEffect(() => {
    resize();
  }, [rows, resize]);

  // Validation and math calculation
  const { validationError, breakdown, multiplicationFormula } = useMemo(() => {
    if (rows.length === 0) {
      return { validationError: null, breakdown: null, multiplicationFormula: '' };
    }

    const parsedItems: Array<{ token: string; prob: number }> = [];
    const invStrings: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const p = parseFloat(row.probStr);

      if (isNaN(p) || p <= 0 || p > 1) {
        return {
          validationError: `Row #${i + 1} ("${row.token || 'untitled'}"): Probability must satisfy 0 < P ≤ 1. Received: "${row.probStr}"`,
          breakdown: null,
          multiplicationFormula: '',
        };
      }

      parsedItems.push({
        token: row.token || `token_${i + 1}`,
        prob: p,
      });

      const inv = 1 / p;
      invStrings.push(formatSignificantDigits(inv));
    }

    const res = calculatePerplexity(parsedItems);
    const formula = invStrings.join(' × ');

    return { validationError: null, breakdown: res, multiplicationFormula: formula };
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
    setRows((prev) => [...prev, { id: newId, token: `token_${prev.length + 1}`, probStr: '0.5' }]);
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

  return (
    <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 md:p-8 space-y-6">
      {/* Clean Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#26262B]">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#FFAE52] font-bold">04</span>
            <h2 className="text-xl md:text-2xl heading-editorial">
              Try It by Hand (Offline Simulator)
            </h2>
          </div>
          <p className="text-xs font-mono text-[#9A9AA3] mt-1">
            Simulated, not from the model. Type custom probabilities to watch geometric mean perplexity change live.
          </p>
        </div>

        {/* Status Dot */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#9A9AA3]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFAE52]" />
          <span className="text-[#F4F4F5]">100% Offline Capable</span>
        </div>
      </div>

      {/* Preset Buttons Bar (Single row, clean segmented look) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#9A9AA3] mr-2">Presets:</span>
        <button
          type="button"
          onClick={() => handleApplyPreset('p1')}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
            activePreset === 'p1'
              ? 'bg-[#FFAE52] text-[#09090B] font-bold'
              : 'border border-[#26262B] bg-[#09090B] text-[#F4F4F5] hover:bg-[#1A1A1E]'
          }`}
        >
          I love Python (0.5, 0.8, 0.2)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset('p2')}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
            activePreset === 'p2'
              ? 'bg-[#FFAE52] text-[#09090B] font-bold'
              : 'border border-[#26262B] bg-[#09090B] text-[#F4F4F5] hover:bg-[#1A1A1E]'
          }`}
        >
          All 1/8 (Perplexity = 8)
        </button>
        <button
          type="button"
          onClick={() => handleApplyPreset('p3')}
          className={`px-3 py-1.5 rounded text-xs font-mono transition-all active:scale-95 cursor-pointer ${
            activePreset === 'p3'
              ? 'bg-[#FFAE52] text-[#09090B] font-bold'
              : 'border border-[#26262B] bg-[#09090B] text-[#F4F4F5] hover:bg-[#1A1A1E]'
          }`}
        >
          One surprising word (Spike demo)
        </button>
      </div>

      {/* Validation Error Notice */}
      {validationError && (
        <div className="p-4 rounded-lg border border-[#26262B] border-l-2 border-l-[#FFAE52] bg-[#09090B] text-xs font-mono text-[#F4F4F5]">
          <div className="text-[#FFAE52] font-bold uppercase mb-1">Validation Notice</div>
          <div className="text-[#9A9AA3]">{validationError}</div>
        </div>
      )}

      {/* Editable Tokens & Probabilities Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-mono uppercase tracking-wider text-[#9A9AA3]">
            Sequence Tokens ({rows.length})
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddRow}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-[#26262B] bg-[#09090B] hover:border-[#383840] hover:bg-[#1A1A1E] text-xs font-mono text-[#F4F4F5] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add token</span>
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset('p1')}
              className="p-1.5 rounded border border-[#26262B] bg-[#09090B] hover:text-[#F4F4F5] text-[#9A9AA3] transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="p-8 text-center border border-[#26262B] bg-[#09090B] rounded-lg">
            <p className="text-xs font-mono text-[#9A9AA3]">No tokens in table.</p>
            <button
              type="button"
              onClick={() => handleApplyPreset('p1')}
              className="mt-3 px-4 py-2 rounded bg-[#FFAE52] text-[#09090B] text-xs font-mono font-bold"
            >
              Load Default Preset
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-[#26262B] bg-[#09090B]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#26262B] bg-[#141417] text-[#9A9AA3] uppercase font-mono tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4 min-w-[150px]">Token Word</th>
                  <th className="py-3 px-4 min-w-[160px]">
                    Probability <span className="font-serif italic lowercase font-normal">P</span> (0 &lt; P ≤ 1)
                  </th>
                  <th className="py-3 px-4 min-w-[140px]">
                    Inverse Prob <span className="font-serif italic lowercase font-normal">1 / P</span>
                  </th>
                  <th className="py-3 px-4 w-16 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#26262B] font-mono font-tabular">
                {rows.map((row, index) => {
                  const pVal = parseFloat(row.probStr);
                  const isRowValid = !isNaN(pVal) && pVal > 0 && pVal <= 1;
                  const invP = isRowValid ? 1 / pVal : NaN;

                  return (
                    <tr key={row.id} className="hover:bg-[#141417]/50 transition-colors">
                      <td className="py-2.5 px-4 text-center text-[#9A9AA3]">{index + 1}</td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={row.token}
                          onChange={(e) => handleRowChange(row.id, 'token', e.target.value)}
                          placeholder="word"
                          className="w-full bg-[#141417] border border-[#26262B] focus:border-[#FFAE52] rounded px-2.5 py-1 text-xs text-[#F4F4F5] font-mono focus:outline-none focus:ring-1 focus:ring-[#FFAE52] transition-colors"
                        />
                      </td>
                      <td className="py-2.5 px-4">
                        <input
                          type="text"
                          value={row.probStr}
                          onChange={(e) => handleRowChange(row.id, 'probStr', e.target.value)}
                          placeholder="0.0 - 1.0"
                          className={`w-full bg-[#141417] border rounded px-2.5 py-1 text-xs font-mono focus:outline-none transition-colors ${
                            isRowValid
                              ? 'border-[#26262B] text-[#F4F4F5] focus:border-[#FFAE52] focus:ring-1 focus:ring-[#FFAE52]'
                              : 'border-[#FFAE52] text-[#FFAE52]'
                          }`}
                        />
                      </td>
                      <td className="py-2.5 px-4 text-[#F4F4F5]">
                        <span className="px-2 py-0.5 rounded bg-[#141417] border border-[#26262B]">
                          {isRowValid ? formatSignificantDigits(invP) : '—'}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="p-1 rounded text-[#9A9AA3] hover:text-[#FFAE52] transition-colors cursor-pointer"
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

      {/* Pedagogical Step-by-Step Breakdown (Exact Teacher Specification) */}
      {breakdown && (
        <div className="space-y-4 pt-2">
          {/* Exact Classroom Mathematical Steps */}
          <div className="p-4 rounded-lg border border-[#26262B] bg-[#09090B] space-y-2 font-mono text-xs">
            <div className="text-[#F4F4F5] flex flex-wrap items-center gap-1.5">
              <span className="text-[#FFAE52] font-bold">Step 1:</span>
              <span className="text-[#9A9AA3]">Multiply all the 1/P values:</span>
              <span className="text-[#F4F4F5] font-semibold">{multiplicationFormula}</span>
              <span className="text-[#9A9AA3]">=</span>
              <span className="text-[#F4F4F5] font-bold">{breakdown.productInversePFormatted}</span>
            </div>

            <div className="text-[#F4F4F5] flex items-center gap-1.5">
              <span className="text-[#FFAE52] font-bold">Step 2:</span>
              <span className="text-[#9A9AA3]">Count the tokens:</span>
              <span className="text-[#F4F4F5] font-bold">N = {breakdown.tokenCount}</span>
            </div>

            <div className="text-[#F4F4F5] flex items-center gap-1.5">
              <span className="text-[#FFAE52] font-bold">Step 3:</span>
              <span className="text-[#9A9AA3]">Take the N-th root:</span>
              <span className="text-[#F4F4F5]">
                ({breakdown.productInversePFormatted})<sup>1/{breakdown.tokenCount}</sup> =
              </span>
              <span className="text-[#FFAE52] font-bold font-tabular text-sm">
                {breakdown.perplexityFormatted}
              </span>
            </div>
          </div>

          {/* 3-Step Architectural Stat Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border border-[#26262B] bg-[#09090B] rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-[#9A9AA3] mb-1">
                  01 / PRODUCT OF 1/P
                </div>
                <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                  ∏ (1 / Pᵢ) = eˢ
                </div>
              </div>
              <div className="text-xl md:text-2xl font-mono font-bold font-tabular text-[#F4F4F5] break-all">
                {breakdown.productInversePFormatted}
              </div>
            </div>

            <div className="border border-[#26262B] bg-[#09090B] rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="text-[11px] font-mono text-[#9A9AA3] mb-1">
                  02 / TOKEN COUNT
                </div>
                <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                  Total evaluated tokens (N)
                </div>
              </div>
              <div className="text-xl md:text-2xl font-mono font-bold font-tabular text-[#F4F4F5]">
                {breakdown.tokenCount}
              </div>
            </div>

            <div className="border border-[#FFAE52]/50 bg-[#09090B] rounded-lg p-4 flex flex-col justify-between shadow-[0_0_15px_rgba(255,160,72,0.06)]">
              <div>
                <div className="text-[11px] font-mono text-[#FFAE52] font-bold mb-1">
                  03 / GEOMETRIC MEAN (PERPLEXITY)
                </div>
                <div className="text-xs text-[#9A9AA3] font-mono mb-3">
                  (Product)^(1/N) = e^(loss)
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-mono font-black font-tabular text-[#FFAE52]">
                {breakdown.perplexityFormatted}
              </div>
            </div>
          </div>

          {/* Clean Matte Interpretation Callout (2px #FFAE52 left border) */}
          <div className="border border-[#26262B] border-l-2 border-l-[#FFAE52] bg-[#141417] p-4 rounded-lg font-mono text-xs">
            <div className="text-[#FFAE52] font-bold uppercase tracking-wider mb-1">
              Pedagogical Interpretation
            </div>
            <div className="text-sm font-medium text-[#F4F4F5]">
              Perplexity ≈ {breakdown.perplexityFormatted}: on average the model was as unsure as choosing between about {Math.round(breakdown.perplexity).toLocaleString()} equally likely tokens.
            </div>
            <div className="text-[11px] text-[#9A9AA3] mt-1">
              Notice how lower probability tokens disproportionately spike perplexity due to inverse geometric scaling.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
