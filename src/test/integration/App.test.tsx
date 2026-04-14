import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { App } from '../../App';
import type { ComparisonResponse } from '../../types/api';

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderApp(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>,
  );
}

async function submitSearch(url: string) {
  await userEvent.type(screen.getByRole('textbox', { name: /product url/i }), url);
  await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));
}

// ── Fixtures ─────────────────────────────────────────────────────────────────

const fullResponse: ComparisonResponse = {
  results: [
    {
      product: {
        title: 'Sony WH-1000XM5 Headphones',
        price: '₹24,990',
        productUrl: 'https://amazon.in/dp/B0C1',
      },
      platform: 'amazon',
      status: 'success',
    },
    {
      product: { title: 'T', price: '1', productUrl: 'https://flipkart.com/p/1' },
      platform: 'flipkart',
      status: 'skipped',
    },
  ],
  similarProducts: [
    {
      product: {
        title: 'Bose QuietComfort 45',
        price: '₹22,500',
        productUrl: 'https://flipkart.com/p/bose',
      },
      platform: 'flipkart',
      confidence: 0.88,
    },
    {
      product: {
        title: 'JBL Tune 760NC',
        price: '₹8,999',
        productUrl: 'https://meesho.com/p/jbl',
      },
      platform: 'meesho',
      confidence: 0.62,
    },
  ],
};

const emptyResponse: ComparisonResponse = {
  results: [],
  similarProducts: [],
};

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn());
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Integration: full search flow', () => {
  it('renders the search form on initial load', () => {
    renderApp();
    expect(screen.getByRole('textbox', { name: /product url/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /compare prices/i })).toBeInTheDocument();
  });

  it('shows primary product card after successful search', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => fullResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() =>
      expect(screen.getByText('Sony WH-1000XM5 Headphones')).toBeInTheDocument(),
    );
    expect(screen.getByText('₹24,990')).toBeInTheDocument();
  });

  it('shows alternatives grid with all alternative cards', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => fullResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2));
    expect(screen.getByText('Bose QuietComfort 45')).toBeInTheDocument();
    expect(screen.getByText('JBL Tune 760NC')).toBeInTheDocument();
  });

  it('shows the status sidebar with platform scan results', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => fullResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getByText(/scanner status/i)).toBeInTheDocument());
    expect(screen.getByText('Ready')).toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
  });

  it('marks the first alternative card as BEST PRICE', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => fullResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getByText('BEST PRICE')).toBeInTheDocument());
  });

  it('disables the Compare button and shows Scanning... while loading', async () => {
    let resolveResponse!: (r: Response) => void;
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise<Response>((res) => {
        resolveResponse = res;
      }),
    );

    renderApp();
    await userEvent.type(screen.getByRole('textbox', { name: /product url/i }), 'https://amazon.in/dp/B0C1');
    await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));

    expect(screen.getByRole('button', { name: /scanning for deals/i })).toBeDisabled();
    expect(screen.getByText('Scanning...')).toBeInTheDocument();

    resolveResponse({ ok: true, json: async () => fullResponse } as Response);
    await waitFor(() => expect(screen.getByRole('button', { name: /compare prices/i })).not.toBeDisabled());
  });
});

describe('Integration: error flow', () => {
  it('shows error banner when API returns HTTP 500', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(
      /failed to fetch comparison results/i,
    );
  });

  it('does not show results when fetch fails', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({}),
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('shows error banner on network failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });

  it('clears the error banner on a subsequent successful search', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) } as Response)
      .mockResolvedValueOnce({ ok: true, json: async () => fullResponse } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());

    await userEvent.clear(screen.getByRole('textbox', { name: /product url/i }));
    await submitSearch('https://amazon.in/dp/B0C2');

    await waitFor(() =>
      expect(screen.queryByRole('alert')).not.toBeInTheDocument(),
    );
    expect(screen.getByText('Sony WH-1000XM5 Headphones')).toBeInTheDocument();
  });
});

describe('Integration: empty results flow', () => {
  it('shows EmptyState when API returns empty arrays', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /no results found/i })).toBeInTheDocument(),
    );
  });

  it('does not show product cards when results are empty', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyResponse,
    } as Response);

    renderApp();
    await submitSearch('https://amazon.in/dp/B0C1');

    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /no results found/i })).toBeInTheDocument(),
    );
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});

describe('Integration: 404 route', () => {
  it('renders NotFound page on an unknown route', () => {
    renderApp('/this-page-does-not-exist');
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('renders a link back to / from the 404 page', () => {
    renderApp('/this-page-does-not-exist');
    expect(screen.getByRole('link', { name: /back to search/i })).toHaveAttribute('href', '/');
  });
});
