'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type {
  TokenEvaluation,
  NextTokenCandidate,
  PerplexityBreakdown,
} from '@/lib/perplexity-math';

export interface ProgressState {
  file: string;
  progress: number;
  loaded?: number;
  total?: number;
  status?: string;
}

export interface EvaluationResult {
  text: string;
  tokens: TokenEvaluation[];
  nextTokens: NextTokenCandidate[];
  perplexityBreakdown: PerplexityBreakdown;
  inferenceTimeMs: number;
}

export type RunnerStatus = 'idle' | 'loading_model' | 'evaluating' | 'ready' | 'error';

export function useLmRunner() {
  const [status, setStatus] = useState<RunnerStatus>('idle');
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [currentText, setCurrentText] = useState<string>('I love Python');

  const workerRef = useRef<Worker | null>(null);
  const pendingEvaluationIdRef = useRef<string | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    // Check if running in browser
    if (typeof window === 'undefined') return;

    // Check protocol
    if (window.location.protocol === 'file:') {
      setError(
        'Running via file:// is not supported due to browser security restrictions. Please serve over HTTP/HTTPS.'
      );
      setStatus('error');
      return;
    }

    try {
      const worker = new Worker(new URL('../workers/lm.worker.ts', import.meta.url), {
        type: 'module',
      });

      worker.onmessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        if (type === 'PROGRESS') {
          if (payload) {
            setProgress({
              file: payload.file || 'model weights',
              progress: typeof payload.progress === 'number' ? Math.round(payload.progress) : 0,
              loaded: payload.loaded,
              total: payload.total,
              status: payload.status,
            });
          }
        } else if (type === 'READY') {
          setIsModelLoaded(true);
          setStatus((prev) => (prev === 'loading_model' ? 'ready' : prev));
          setProgress(null);
        } else if (type === 'RESULT') {
          if (pendingEvaluationIdRef.current === payload.id) {
            setResult({
              text: payload.text,
              tokens: payload.tokens,
              nextTokens: payload.nextTokens,
              perplexityBreakdown: payload.perplexityBreakdown,
              inferenceTimeMs: payload.inferenceTimeMs,
            });
            setIsModelLoaded(true);
            setStatus('ready');
            setProgress(null);
            setError(null);
            pendingEvaluationIdRef.current = null;
          }
        } else if (type === 'ERROR') {
          setError(payload?.message || 'An error occurred during evaluation.');
          setStatus('error');
          setProgress(null);
          pendingEvaluationIdRef.current = null;
        }
      };

      worker.onerror = (err) => {
        console.error('LM Worker error:', err);
        setError(
          err.message ||
            'Web Worker failed to initialize or execute. Please ensure your browser supports Web Workers and WebAssembly.'
        );
        setStatus('error');
        setProgress(null);
        pendingEvaluationIdRef.current = null;
      };

      workerRef.current = worker;

      return () => {
        worker.terminate();
        workerRef.current = null;
      };
    } catch (e: any) {
      console.error('Failed to construct Worker:', e);
      setError('Could not initialize in-browser AI worker: ' + (e?.message || 'Unknown error'));
      setStatus('error');
    }
  }, []);

  const evaluateSentence = useCallback(
    async (sentence: string) => {
      // 1. Ignore blank or whitespace-only inputs
      const trimmed = sentence.trim();
      if (!trimmed) {
        return;
      }

      // 2. Prevent concurrent runs while busy
      if (status === 'loading_model' || status === 'evaluating') {
        console.warn('Evaluation is already in progress.');
        return;
      }

      setError(null);

      // Check offline before model is cached
      if (!isModelLoaded && typeof navigator !== 'undefined' && !navigator.onLine) {
        setError('You are offline. The model must be downloaded once while online before it can run offline.');
        setStatus('error');
        return;
      }

      const evalId = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      pendingEvaluationIdRef.current = evalId;
      setCurrentText(sentence);

      if (!isModelLoaded) {
        setStatus('loading_model');
      } else {
        setStatus('evaluating');
      }

      if (workerRef.current) {
        workerRef.current.postMessage({
          type: 'EVALUATE',
          payload: { text: sentence, id: evalId },
        });
      } else {
        setError('Worker is not available.');
        setStatus('error');
      }
    },
    [status, isModelLoaded]
  );

  const isBusy = status === 'loading_model' || status === 'evaluating';

  return {
    status,
    isBusy,
    isModelLoaded,
    progress,
    result,
    error,
    currentText,
    setCurrentText,
    evaluateSentence,
  };
}
