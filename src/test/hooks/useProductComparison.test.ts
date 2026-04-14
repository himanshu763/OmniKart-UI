import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProductComparison } from '../../hooks/useProductComparison';
import type { ComparisonResponse } from '../../types/api';

const mockResponse: ComparisonResponse = {
  results: [
    { product: { title: 'Test Product', price: '₹999', productUrl: 'https://amazon.in/dp/B01' }, platform: 'amazon', status: 'success' },
  ],
  similarProducts: [
    { product: { title: 'Similar Item', price: '₹899', productUrl: 'https://flipkart.com/p/1' }, platform: 'flipkart', confidence: 0.85 },
  ],
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useProductComparison', () => {
  it('starts with null data, not loading, no error', () => {
    const { result } = renderHook(() => useProductComparison());
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets loading true while fetching, then false after', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('populates data on successful fetch', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBeNull();
  });

  it('sets error message on HTTP error response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to fetch comparison results. Please try again.');
    expect(result.current.loading).toBe(false);
  });

  it('sets error message on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });

    expect(result.current.error).toBe('Failed to fetch comparison results. Please try again.');
  });

  it('clears previous error on new fetch', async () => {
    vi.mocked(fetch)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({ ok: true, json: async () => mockResponse } as Response);

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });
    expect(result.current.error).toBeTruthy();

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B02');
    });
    expect(result.current.error).toBeNull();
    expect(result.current.data).toEqual(mockResponse);
  });

  it('does not set error on AbortError', async () => {
    const abortError = new DOMException('Aborted', 'AbortError');
    vi.mocked(fetch).mockRejectedValueOnce(abortError);

    const { result } = renderHook(() => useProductComparison());

    await act(async () => {
      await result.current.fetchComparison('https://amazon.in/dp/B01');
    });

    expect(result.current.error).toBeNull();
  });
});
