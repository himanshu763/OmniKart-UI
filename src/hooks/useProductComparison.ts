import { useState, useRef } from 'react';
import type { ComparisonResponse } from '../types/api';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface UseProductComparisonReturn {
  data: ComparisonResponse | null;
  loading: boolean;
  error: string | null;
  fetchComparison: (url: string) => Promise<void>;
}

export function useProductComparison(): UseProductComparisonReturn {
  const [data, setData] = useState<ComparisonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchComparison = async (url: string): Promise<void> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/api/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10_000)]),
      });

      if (!res.ok) throw new Error(`Comparison failed (HTTP ${res.status})`);

      setData((await res.json()) as ComparisonResponse);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Failed to fetch comparison results. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchComparison };
}
