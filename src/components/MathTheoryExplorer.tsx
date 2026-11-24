'use client';

import React from 'react';

export function MathTheoryExplorer() {
  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#26262B]">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#FFAE52] font-bold">04</span>
            <h2 className="text-xl md:text-2xl heading-editorial">
              Mathematical Formulations &amp; Algorithms
            </h2>
          </div>
          <p className="text-xs font-mono text-[#9A9AA3] mt-1">
            Formal technical breakdown of the 5 algorithms implemented client-side in this language model runner.
          </p>
        </div>

        <div className="font-mono text-xs text-[#9A9AA3]">
          Model: <span className="text-[#F4F4F5]">DistilGPT-2 (q8 ONNX)</span>
        </div>
      </div>

      {/* Horizontal Strip of 5 Algorithm Cards for Panel 04 */}
      <div className="flex flex-col lg:flex-row gap-5 items-stretch lg:overflow-visible pb-2">
        {/* 01 */}
        <div className="w-full lg:w-[360px] lg:shrink-0 border border-[#26262B] bg-[#141417] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">01</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Sequence Preparation</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Context Prepending &amp; Forward Pass
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Prepends GPT-2's <code className="text-[#F4F4F5] bg-[#09090B] px-1 py-0.5 rounded border border-[#26262B]">&lt;|endoftext|&gt;</code> token (ID <code className="text-[#FFAE52]">50256</code>) so token #1 has causal prior context to be evaluated against:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div className="text-[#9A9AA3]">// Prepended token sequence</div>
            <div>ids = [50256, t₁, t₂, ..., t_N],  n = N + 1</div>
            <div className="text-[#9A9AA3] pt-1">// Tensor shapes (int64)</div>
            <div>input_ids: [1, n], attention_mask: [1, n]</div>
            <div>output.logits: [1, n, V], where V = 50,257</div>
          </div>
        </div>

        {/* 02 */}
        <div className="w-full lg:w-[360px] lg:shrink-0 border border-[#26262B] bg-[#141417] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">02</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Numerical Stability</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Log-Space Softmax
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Subtracts the maximum logit <span className="text-[#F4F4F5]">m</span> prior to exponentiation to guarantee all exponents are <span className="text-[#F4F4F5]">≤ 0</span>, eliminating IEEE 754 float overflow:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div>m = maxⱼ (zⱼ)</div>
            <div>log Z = m + ln( ∑ⱼ exp(zⱼ - m) )</div>
            <div>ln P(j) = zⱼ - log Z</div>
            <div>P(j) = exp( ln P(j) )</div>
          </div>
        </div>

        {/* 03 */}
        <div className="w-full lg:w-[360px] lg:shrink-0 border border-[#26262B] bg-[#141417] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">03</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Autoregressive Indexing</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Per-Token Conditional Probability
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Because a causal language model predicts the <em>next</em> token at each step, the conditional probability of token <span className="text-[#F4F4F5] whitespace-nowrap">tᵢ</span> originates from logits at position <span className="text-[#F4F4F5] whitespace-nowrap">i - 1</span>:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div className="whitespace-nowrap">Pᵢ = P(tᵢ | 50256, t₁, ..., tᵢ₋₁)</div>
            <div className="text-[#9A9AA3] pt-1">// Index mapping:</div>
            <div className="whitespace-nowrap">Slice pos 0   → predicts user token t₁</div>
            <div className="whitespace-nowrap">Slice pos i-1 → predicts user token tᵢ</div>
            <div className="whitespace-nowrap">Inverse Prob  = 1 / Pᵢ</div>
          </div>
        </div>

        {/* 04 */}
        <div className="w-full lg:w-[360px] lg:shrink-0 border border-[#26262B] bg-[#141417] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">04</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Loss &amp; Geometric Mean</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Perplexity in Log Space
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Direct multiplication of <span className="text-[#F4F4F5]">∏ (1 / Pᵢ)</span> overflows for longer sequences. The engine accumulates negative log-likelihoods instead:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div>S = ∑ᵢ₌₁ᴺ -ln(Pᵢ)</div>
            <div>Product = exp(S) = ∏ᵢ₌₁ᴺ (1 / Pᵢ)</div>
            <div>Average Loss = S / N</div>
            <div>Perplexity = exp(S / N) = (Product)¹ᐟᴺ</div>
          </div>
        </div>

        {/* 05 */}
        <div className="w-full lg:w-[420px] lg:shrink-0 border border-[#26262B] bg-[#141417] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">05</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Zero-Cost Continuation</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Position n - 1 Logit Softmax &amp; Next-Token Ranking
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Rather than initiating a separate forward pass, the engine slices the logits at position <span className="text-[#F4F4F5]">n - 1</span> (where <span className="text-[#F4F4F5]">n = N + 1</span>), performs log-softmax across all 50,257 vocabulary entries, sorts descending, and normalizes the top 8 candidates:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div>P(j | 50256, t₁, ..., t_N) for j ∈ [0, ..., 50256]</div>
            <div>Rank Candidates: Sort descending by P(j) → Top 8</div>
            <div>Exact Percentage: (Pₖ × 100).toFixed(1) + "%"</div>
            <div>Relative Proportion: Ratio = Pₖ / P₁</div>
          </div>
        </div>

        {/* Compact Anchored End Card */}
        <div className="w-full lg:w-[280px] lg:shrink-0 border border-[#26262B] bg-[#09090B] rounded-xl p-5 flex flex-col justify-between font-mono text-xs">
          <div>
            <div className="text-[10px] text-[#FFAE52] uppercase font-bold tracking-wider mb-2">
              SPECIFICATION COMPLIANCE
            </div>
            <p className="text-[#9A9AA3] leading-relaxed">
              Fully self-contained in-browser causal model runner, numerically stable log-softmax, and offline simulator.
            </p>
          </div>
          <div className="space-y-2 pt-4 border-t border-[#26262B] text-[11px] text-[#9A9AA3]">
            <div className="flex items-center justify-between">
              <span>ENGINE:</span>
              <span className="text-[#F4F4F5]">ONNX Q8</span>
            </div>
            <div className="flex items-center justify-between">
              <span>BG EFFECT:</span>
              <span className="text-[#FFAE52]">SHAPE-WAVES</span>
            </div>
            <div className="flex items-center justify-between">
              <span>SCROLL:</span>
              <span className="text-[#F4F4F5]">LENIS HORIZONTAL</span>
            </div>
            <div className="pt-2 text-right">
              <span className="text-[#FFAE52] font-bold">End of Track • 04/04</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
