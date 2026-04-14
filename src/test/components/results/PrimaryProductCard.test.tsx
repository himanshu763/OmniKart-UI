import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PrimaryProductCard } from '../../../components/results/PrimaryProductCard';
import type { PlatformResult } from '../../../types/api';

const result: PlatformResult = {
  product: { title: 'Apple AirPods Pro', price: '₹19,990', productUrl: 'https://amazon.in/dp/B09' },
  platform: 'amazon',
  status: 'success',
};

describe('PrimaryProductCard', () => {
  it('renders the product title', () => {
    render(<PrimaryProductCard result={result} />);
    expect(screen.getByText('Apple AirPods Pro')).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<PrimaryProductCard result={result} />);
    expect(screen.getByText('₹19,990')).toBeInTheDocument();
  });

  it('renders the platform name', () => {
    render(<PrimaryProductCard result={result} />);
    expect(screen.getByText('amazon')).toBeInTheDocument();
  });

  it('renders a Visit Store link with correct attributes', () => {
    render(<PrimaryProductCard result={result} />);
    const link = screen.getByRole('link', { name: /visit store/i });
    expect(link).toHaveAttribute('href', 'https://amazon.in/dp/B09');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
