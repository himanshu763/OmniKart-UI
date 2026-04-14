import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProductCard } from '../../../components/results/ProductCard';
import type { SimilarProduct } from '../../../types/api';

const item: SimilarProduct = {
  product: { title: 'Sony WH-1000XM5', price: '₹24,990', productUrl: 'https://flipkart.com/p/1' },
  platform: 'flipkart',
  confidence: 0.85,
};

describe('ProductCard', () => {
  it('renders the product title', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.getByText('Sony WH-1000XM5')).toBeInTheDocument();
  });

  it('renders the product price', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.getByText('₹24,990')).toBeInTheDocument();
  });

  it('renders the platform name', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.getByText('flipkart')).toBeInTheDocument();
  });

  it('renders a "View Deal" link with correct href', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    const link = screen.getByRole('link', { name: /view deal/i });
    expect(link).toHaveAttribute('href', 'https://flipkart.com/p/1');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('shows BEST PRICE badge when isBestPrice is true', () => {
    render(<ProductCard item={item} isBestPrice={true} />);
    expect(screen.getByText('BEST PRICE')).toBeInTheDocument();
  });

  it('does not show BEST PRICE badge when isBestPrice is false', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.queryByText('BEST PRICE')).not.toBeInTheDocument();
  });

  it('renders the confidence badge', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.getByText('85% Match')).toBeInTheDocument();
  });

  it('renders as an article element', () => {
    render(<ProductCard item={item} isBestPrice={false} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
