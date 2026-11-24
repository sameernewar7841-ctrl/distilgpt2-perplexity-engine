'use client';

import React from 'react';

export function MathTheoryExplorer() {
  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#26262B]">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#FFAE52] font-bold">05</span>
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

      {/* Lenis-style Numbered 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 01 */}
        <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
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
        <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
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
            <div>m = max_j (z_j)</div>
            <div>log Z = m + ln( ∑ exp(z_j - m) )</div>
            <div>ln P(j) = z_j - log Z</div>
            <div>P(j) = exp( ln P(j) )</div>
          </div>
        </div>

        {/* 03 */}
        <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">03</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Autoregressive Indexing</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Per-Token Conditional Probability
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Because a causal language model predicts the <em>next</em> token at each step, the conditional probability of token <span className="text-[#F4F4F5]">t_i</span> originates from logits at position <span className="text-[#F4F4F5]">i - 1</span>:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div>P_i = P(t_i | 50256, t₁, ..., t_{'{'}i-1{'}'})</div>
            <div className="text-[#9A9AA3] pt-1">// Index mapping:</div>
            <div>Slice pos 0   → predicts user token t₁</div>
            <div>Slice pos i-1 → predicts user token t_i</div>
            <div>Inverse Prob  = 1 / P_i</div>
          </div>
        </div>

        {/* 04 */}
        <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs font-bold text-[#FFAE52]">04</span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Loss &amp; Geometric Mean</span>
            </div>
            <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
              Perplexity in Log Space
            </h3>
            <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
              Direct multiplication of <span className="text-[#F4F4F5]">∏ (1 / P_i)</span> overflows for longer sequences. The engine accumulates negative log-likelihoods instead:
            </p>
          </div>
          <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
            <div>S = ∑_{'{'}i=1{'}'}^{'{'}N{'}'} -ln(P_i)</div>
            <div>Product = exp(S)</div>
            <div>Average Loss = S / N</div>
            <div>Perplexity = exp(S / N) = (Product)^(1/N)</div>
          </div>
        </div>
      </div>

      {/* 05 - Full Width Architectural Block */}
      <div className="border border-[#26262B] bg-[#141417] rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-xs font-bold text-[#FFAE52]">05</span>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#9A9AA3]">Zero-Cost Continuation</span>
        </div>
        <h3 className="text-base font-semibold text-[#F4F4F5] heading-editorial mb-2">
          Position n - 1 Logit Softmax &amp; Next-Token Ranking
        </h3>
        <p className="text-xs font-mono text-[#9A9AA3] leading-relaxed mb-4">
          Rather than initiating a separate forward pass, the engine slices the logits at position <span className="text-[#F4F4F5]">n - 1</span> (where <span className="text-[#F4F4F5]">n = N + 1</span>), performs log-softmax across all 50,257 vocabulary entries, sorts descending, and normalizes the top 8 candidates against the rank #1 prediction:
        </p>
        <div className="bg-[#09090B] rounded-lg p-3.5 border border-[#26262B] font-mono text-xs text-[#F4F4F5] space-y-1">
          <div>Next-Token Distribution: P(j | 50256, t₁, ..., t_N) for j ∈ {'{'}0, ..., 50256{'}'}</div>
          <div>Rank Candidates: Sort descending by P(j), select Top 8 (k = 1...8)</div>
          <div>Exact Percentage: (P_k × 100).toFixed(1) + "%"</div>
          <div>Relative Proportion to Rank #1: Ratio = P_k / P₁</div>
        </div>
      </div>
    </div>
  );
}
