// LM Worker for in-browser distilgpt2 execution
import { AutoTokenizer, AutoModelForCausalLM, Tensor, env } from '@huggingface/transformers';
import {
  computeLogSoftmax,
  calculatePerplexity,
  getTop8NextTokens,
  makeWhitespaceExplicit,
  type TokenEvaluation,
  type NextTokenCandidate,
  type PerplexityBreakdown,
} from '../lib/perplexity-math';

// Configure transformers for browser
env.allowLocalModels = false;
env.useBrowserCache = true;

const MODEL_ID = 'Xenova/distilgpt2';
let tokenizer: any = null;
let model: any = null;
let isLoading = false;

async function loadModel(progressCallback?: (data: any) => void) {
  if (model && tokenizer) return { model, tokenizer };
  if (isLoading) throw new Error('Model is already loading');

  isLoading = true;
  try {
    tokenizer = await AutoTokenizer.from_pretrained(MODEL_ID, {
      progress_callback: (p: any) => {
        if (progressCallback) progressCallback(p);
      },
    });

    model = await AutoModelForCausalLM.from_pretrained(MODEL_ID, {
      dtype: 'q8',
      progress_callback: (p: any) => {
        if (progressCallback) progressCallback(p);
      },
    });

    isLoading = false;
    return { model, tokenizer };
  } catch (err: any) {
    isLoading = false;
    throw err;
  }
}

self.addEventListener('message', async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'INIT') {
    try {
      await loadModel((data) => {
        self.postMessage({ type: 'PROGRESS', payload: data });
      });
      self.postMessage({ type: 'READY' });
    } catch (err: any) {
      self.postMessage({
        type: 'ERROR',
        payload: { message: err?.message || 'Failed to load model' },
      });
    }
  } else if (type === 'EVALUATE') {
    const { text, id } = payload;
    const startTime = performance.now();

    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Input cannot be blank or whitespace-only.');
      }

      const { model: m, tokenizer: tok } = await loadModel((data) => {
        self.postMessage({ type: 'PROGRESS', payload: data });
      });

      // Tokenize
      const encoded = tok(text);
      const rawIds: number[] = Array.from(encoded.input_ids.data).map((x: any) => Number(x));
      const N = rawIds.length;

      if (N === 0) {
        throw new Error('No tokens produced for input.');
      }

      // Prepend GPT-2's <|endoftext|> (50256)
      const ids = [50256, ...rawIds];
      const n = ids.length;

      const input_ids = new Tensor('int64', BigInt64Array.from(ids.map((x) => BigInt(x))), [1, n]);
      const attention_mask = new Tensor('int64', new BigInt64Array(n).fill(BigInt(1)), [1, n]);

      // Run forward pass
      const output = await m({ input_ids, attention_mask });
      const logitsData = output.logits.data; // Float32Array of length 1 * n * V
      const V = 50257;

      // Calculate per-token probability from position i - 1
      const tokenEvaluations: TokenEvaluation[] = [];
      const tokenItemsForPerplexity: Array<{ token: string; rawToken: string; prob: number; logProb: number }> = [];

      for (let i = 1; i <= N; i++) {
        const tokenId = rawIds[i - 1];
        const prevPos = i - 1; // position in sequence [0 ... n-1]

        // Slice logits at prevPos
        const startIdx = prevPos * V;
        const logitSlice = logitsData.subarray(startIdx, startIdx + V);

        // Compute stable log-softmax
        const { logProbs, probs } = computeLogSoftmax(logitSlice);
        const prob = probs[tokenId];
        const logProb = logProbs[tokenId];
        const decodedRaw = tok.decode([tokenId]);

        tokenItemsForPerplexity.push({
          token: decodedRaw,
          rawToken: decodedRaw,
          prob,
          logProb,
        });
      }

      // Compute Perplexity Breakdown
      const perplexityBreakdown = calculatePerplexity(tokenItemsForPerplexity);

      // Next-token prediction: position n - 1
      const lastPos = n - 1;
      const lastLogits = logitsData.subarray(lastPos * V, lastPos + V);
      const nextTokens = getTop8NextTokens(lastLogits, (tokenIdx) => tok.decode([tokenIdx]));

      const inferenceTimeMs = Math.round(performance.now() - startTime);

      self.postMessage({
        type: 'RESULT',
        payload: {
          id,
          text,
          tokens: perplexityBreakdown.tokens,
          nextTokens,
          perplexityBreakdown,
          inferenceTimeMs,
        },
      });
    } catch (err: any) {
      self.postMessage({
        type: 'ERROR',
        payload: { id, message: err?.message || 'Inference error' },
      });
    }
  }
});
