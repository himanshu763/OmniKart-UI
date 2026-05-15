import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusSidebar } from '../../../components/results/StatusSidebar';
import type { PlatformResult } from '../../../types/api';

const results: PlatformResult[] = [
  { product: { title: 'T', price: '1', productUrl: 'https://a.com' }, platform: 'amazon', status: 'success' },
  { product: { title: 'T', price: '1', productUrl: 'https://b.com' }, platform: 'flipkart', status: 'skipped' },
];

describe('StatusSidebar', () => {
  it('renders all platform names', () => {
    render(<StatusSidebar results={results} />);
    expect(screen.getByText('amazon')).toBeInTheDocument();
    expect(screen.getByText('flipkart')).toBeInTheDocument();
  });

  it('shows "Ready" for success status', () => {
    render(<StatusSidebar results={results} />);
    expect(screen.getByText('Ready')).toBeInTheDocument();
  });

  it('shows "Skipped" for skipped status', () => {
    render(<StatusSidebar results={results} />);
    expect(screen.getByText('Skipped')).toBeInTheDocument();
  });

  it('renders Scanner Status heading', () => {
    render(<StatusSidebar results={results} />);
    expect(screen.getByText(/scanner status/i)).toBeInTheDocument();
  });
});
