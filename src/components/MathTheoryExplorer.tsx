'use client';

import React from 'react';
import { SpotlightCard } from './react-bits/SpotlightCard';
import { BookOpen, ShieldCheck, Binary, Calculator, Award, ArrowRight } from 'lucide-react';

export function MathTheoryExplorer() {
  return (
    <div className="space-y-6">
      {/* Title banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mathematical Foundations</span>
            <span className="text-white/40">•</span>
            <span className="font-mono text-zinc-300">Underlying Algorithms &amp; Proofs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            The Complete Math &amp; Algorithm Specification
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            A formal mathematical breakdown of the 5 algorithms implemented in this client-side language model runner.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Math 1 */}
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">1</span>
            <span>Sequence Preparation &amp; Forward Pass</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Prepending Context &amp; Tensor Dimensions</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Prepend GPT-2's <code className="text-cyan-300 font-mono">&lt;|endoftext|&gt;</code> token (ID <code className="text-cyan-300 font-mono">50256</code>) to the encoded tokens so even the first word has a causal prior context to be predicted from:
          </p>
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-cyan-200 overflow-x-auto">
            <div className="text-zinc-400 mb-1">// Prepended token sequence</div>
            <div>ids = [50256, t₁, t₂, ..., t_N],  n = N + 1</div>
            <div className="text-zinc-400 mt-2">// Tensor shapes passed to DistilGPT-2 (q8 ONNX)</div>
            <div>input_ids: int64 [1, n]</div>
            <div>attention_mask: int64 [1, n] (all ones)</div>
            <div>output.logits: float32 [1, n, V], where V = 50,257</div>
          </div>
        </SpotlightCard>

        {/* Math 2 */}
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">2</span>
            <span>Numerically Stable Log-Softmax</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Overflow Prevention in Log-Space</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Subtract the maximum logit <span className="font-mono text-zinc-200">m</span> before exponentiating. This guarantees exponents are always <span className="font-mono text-zinc-200">≤ 0</span>, preventing IEEE 754 floating-point overflow:
          </p>
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-blue-200 overflow-x-auto space-y-1.5">
            <div>m = max_j (z_j)</div>
            <div>log Z = m + ln( ∑_{'{'}j=0{'}'}^{'{'}V-1{'}'} exp(z_j - m) )</div>
            <div>ln P(j) = z_j - log Z</div>
            <div>P(j) = exp( ln P(j) )</div>
          </div>
        </SpotlightCard>

        {/* Math 3 */}
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">3</span>
            <span>Per-Token Conditional Probability</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Causal Autoregressive Alignment</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Because a causal language model predicts the <em>next</em> token at each step, the conditional probability of token <span className="font-mono text-zinc-200">t_i</span> (for <span className="font-mono text-zinc-200">i = 1...N</span>) originates from the logits slice at position <span className="font-mono text-zinc-200">i - 1</span>:
          </p>
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-emerald-200 overflow-x-auto space-y-1.5">
            <div>P_i = P(t_i | 50256, t₁, ..., t_{'{'}i-1{'}'})</div>
            <div className="text-zinc-400 text-[11px] mt-2">// Logit slice indexing:</div>
            <div>Slice at pos 0 → predicts token t₁ (index #1)</div>
            <div>Slice at pos i - 1 → predicts token t_i (index #i)</div>
            <div>Inverse Probability = 1 / P_i</div>
          </div>
        </SpotlightCard>

        {/* Math 4 */}
        <SpotlightCard className="p-6">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-6 h-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">4</span>
            <span>Perplexity in Log Space</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Geometric Mean &amp; Cross-Entropy Loss</h3>
          <p className="text-xs text-zinc-400 leading-relaxed mb-4">
            Directly multiplying <span className="font-mono text-zinc-200">∏ (1 / P_i)</span> overflows floating-point numbers on longer texts. The engine accumulates negative log-likelihoods instead:
          </p>
          <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-amber-200 overflow-x-auto space-y-1.5">
            <div>S = ∑_{'{'}i=1{'}'}^{'{'}N{'}'} -ln(P_i)</div>
            <div>Product = exp(S)  // equivalent to ∏ (1 / P_i)</div>
            <div>Loss = S / N       // average negative log-likelihood</div>
            <div>Perplexity = exp(Loss) = exp(S / N) = (Product)^(1/N)</div>
          </div>
        </SpotlightCard>
      </div>

      {/* Math 5 */}
      <SpotlightCard className="p-6">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
          <span className="w-6 h-6 rounded-md bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">5</span>
          <span>Zero-Cost Next-Token Ranking</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Position n - 1 Logit Softmax &amp; Relative Proportion</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">
          Rather than initiating a second forward pass, the model extracts the logits vector at position <span className="font-mono text-zinc-200">n - 1</span> (where <span className="font-mono text-zinc-200">n = N + 1</span>), performs log-softmax across all 50,257 vocabulary entries, sorts descending, and normalizes the top 8 candidates against the #1 prediction:
        </p>
        <div className="bg-black/60 rounded-xl p-4 border border-white/10 font-mono text-xs text-purple-200 overflow-x-auto space-y-1.5">
          <div>Next-Token Distribution: P(j | 50256, t₁, ..., t_N) for j ∈ {'{'}0, ..., 50256{'}'}</div>
          <div>Rank Candidates: Sort descending by P(j), select Top 8 (ranks k = 1...8)</div>
          <div>Exact Percentage: (P_k × 100).toFixed(1) + "%"</div>
          <div>Relative Proportion to Top #1: Relative Ratio = P_k / P₁</div>
        </div>
      </SpotlightCard>
    </div>
  );
}
