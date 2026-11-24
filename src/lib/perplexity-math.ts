/**
 * Perplexity & Probability Math Engine
 * Implements numerically stable log-softmax, token conditional probabilities,
 * log-space perplexity calculation, next-token ranking, and number formatting.
 */

export interface TokenEvaluation {
  index: number;
  token: string;
  rawToken: string;
  prob: number;
  inverseProb: number;
  logProb: number;
}

export interface NextTokenCandidate {
  rank: number;
  tokenId: number;
  token: string;
  prob: number;
  probPercent: string; // e.g. "34.2%"
  relativeRatio: number; // P_k / P_1
  relativeRatioPercent: string; // e.g. "100.0%", "45.8%"
}

export interface PerplexityBreakdown {
  tokens: TokenEvaluation[];
  tokenCount: number; // N
  sumNegLogProb: number; // S = sum(-ln(P_i))
  productInverseP: number; // e^S
  productInversePFormatted: string;
  perplexity: number; // e^(S/N)
  perplexityFormatted: string;
  averageLoss: number; // S / N
  interpretation: string;
}

/**
 * Format numbers according to specification:
 * 4 significant digits for values in [0.001, 10^6)
 * Scientific notation outside that range
 */
export function formatSignificantDigits(value: number): string {
  if (value === 0 || !Number.isFinite(value)) {
    if (value === 0) return '0.000';
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    return 'NaN';
  }

  const absVal = Math.abs(value);

  if (absVal >= 0.001 && absVal < 1_000_000) {
    // 4 significant digits
    return Number(value.toPrecision(4)).toString();
  }

  // Scientific notation with 4 significant digits (e.g., 1.234e-4)
  return value.toExponential(3);
}

/**
 * Replaces whitespace with explicit visual characters:
 * Space -> ␣
 * Newline -> ↵
 * Tab -> ⇥
 */
export function makeWhitespaceExplicit(text: string): string {
  if (!text) return '';
  return text
    .replace(/ /g, '␣')
    .replace(/\n/g, '↵')
    .replace(/\t/g, '⇥');
}

/**
 * Numerically stable log-softmax:
 * m = max_j z_j
 * log Z = m + ln(sum_j e^(z_j - m))
 * ln P(j) = z_j - log Z
 * P(j) = e^(ln P(j))
 */
export function computeLogSoftmax(logits: Float32Array | number[]): {
  logProbs: Float32Array;
  probs: Float32Array;
} {
  const len = logits.length;
  let maxLogit = -Infinity;
  for (let i = 0; i < len; i++) {
    if (logits[i] > maxLogit) {
      maxLogit = logits[i];
    }
  }

  let sumExp = 0;
  for (let i = 0; i < len; i++) {
    sumExp += Math.exp(logits[i] - maxLogit);
  }

  const logZ = maxLogit + Math.log(sumExp);

  const logProbs = new Float32Array(len);
  const probs = new Float32Array(len);

  for (let i = 0; i < len; i++) {
    const lp = logits[i] - logZ;
    logProbs[i] = lp;
    probs[i] = Math.exp(lp);
  }

  return { logProbs, probs };
}

/**
 * Calculates perplexity from an array of tokens and their probabilities.
 * Operates in log-space to prevent floating-point overflow:
 * S = sum_{i=1}^N -ln(P_i)
 * Product = e^S
 * Perplexity = e^(S / N)
 */
export function calculatePerplexity(
  items: Array<{ token: string; rawToken?: string; prob: number; logProb?: number }>
): PerplexityBreakdown {
  const N = items.length;

  if (N === 0) {
    return {
      tokens: [],
      tokenCount: 0,
      sumNegLogProb: 0,
      productInverseP: 1,
      productInversePFormatted: '1.000',
      perplexity: 1,
      perplexityFormatted: '1.000',
      averageLoss: 0,
      interpretation: 'No tokens provided.',
    };
  }

  let sumNegLogProb = 0;
  const tokenEvals: TokenEvaluation[] = [];

  for (let i = 0; i < N; i++) {
    const item = items[i];
    const prob = Math.max(item.prob, 1e-15);
    const logProb = item.logProb ?? Math.log(prob);
    const inverseProb = 1 / prob;

    sumNegLogProb += -logProb;

    tokenEvals.push({
      index: i + 1,
      token: makeWhitespaceExplicit(item.token),
      rawToken: item.rawToken ?? item.token,
      prob,
      inverseProb,
      logProb,
    });
  }

  // Calculate product = e^S
  let productInverseP = Math.exp(sumNegLogProb);
  let productInversePFormatted: string;

  if (sumNegLogProb > 709) {
    // Math.exp overflow in JS happens around 709.78
    // In that case: product = 10^(S / ln(10))
    const log10Val = sumNegLogProb / Math.LN10;
    const exponent = Math.floor(log10Val);
    const mantissa = Math.pow(10, log10Val - exponent);
    productInversePFormatted = `${mantissa.toFixed(3)} × 10^${exponent}`;
    productInverseP = Infinity;
  } else {
    productInversePFormatted = formatSignificantDigits(productInverseP);
  }

  const averageLoss = sumNegLogProb / N;
  const perplexity = Math.exp(averageLoss);
  const perplexityFormatted = formatSignificantDigits(perplexity);

  // Plain-English interpretation: "as unsure as choosing between about X equally likely tokens"
  const approxOptions = Math.round(perplexity);
  const interpretation = `The model is about as unsure as choosing between ${approxOptions === 1 ? '1 single obvious token' : `about ${approxOptions.toLocaleString()} equally likely tokens`}.`;

  return {
    tokens: tokenEvals,
    tokenCount: N,
    sumNegLogProb,
    productInverseP,
    productInversePFormatted,
    perplexity,
    perplexityFormatted,
    averageLoss,
    interpretation,
  };
}

/**
 * Extracts Top-8 highest probability next tokens from logit slice.
 */
export function getTop8NextTokens(
  nextLogits: Float32Array | number[],
  decodeFn: (id: number) => string
): NextTokenCandidate[] {
  const { probs } = computeLogSoftmax(nextLogits);
  const len = probs.length;

  // Track top 8 using a min-heap or simple sort of indices
  // For V = 50257, a single pass with top 8 is fast (O(V))
  const topK: Array<{ id: number; prob: number }> = [];

  for (let i = 0; i < len; i++) {
    const p = probs[i];
    if (topK.length < 8) {
      topK.push({ id: i, prob: p });
      if (topK.length === 8) {
        topK.sort((a, b) => b.prob - a.prob);
      }
    } else if (p > topK[7].prob) {
      topK[7] = { id: i, prob: p };
      topK.sort((a, b) => b.prob - a.prob);
    }
  }

  // Ensure descending order
  topK.sort((a, b) => b.prob - a.prob);

  const top1Prob = topK[0]?.prob || 1;

  return topK.map((item, idx) => {
    const decodedRaw = decodeFn(item.id);
    const decodedExplicit = makeWhitespaceExplicit(decodedRaw);
    const probPercent = (item.prob * 100).toFixed(1) + '%';
    const relativeRatio = item.prob / top1Prob;
    const relativeRatioPercent = (relativeRatio * 100).toFixed(1) + '%';

    return {
      rank: idx + 1,
      tokenId: item.id,
      token: decodedExplicit,
      prob: item.prob,
      probPercent,
      relativeRatio,
      relativeRatioPercent,
    };
  });
}
