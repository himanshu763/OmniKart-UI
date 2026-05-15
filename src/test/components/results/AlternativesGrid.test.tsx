import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AlternativesGrid } from '../../../components/results/AlternativesGrid';
import type { SimilarProduct } from '../../../types/api';

const products: SimilarProduct[] = [
  { product: { title: 'Best Deal Item', price: '₹899', productUrl: 'https://flipkart.com/1' }, platform: 'flipkart', confidence: 0.9 },
  { product: { title: 'Second Item', price: '₹950', productUrl: 'https://meesho.com/2' }, platform: 'meesho', confidence: 0.65 },
];

describe('AlternativesGrid', () => {
  it('renders the Market Alternatives heading', () => {
    render(<AlternativesGrid products={products} />);
    expect(screen.getByRole('heading', { name: /market alternatives/i })).toBeInTheDocument();
  });

  it('renders a card for each product', () => {
    render(<AlternativesGrid products={products} />);
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });

  it('marks the first card as best price', () => {
    render(<AlternativesGrid products={products} />);
    expect(screen.getByText('BEST PRICE')).toBeInTheDocument();
  });

  it('renders product titles', () => {
    render(<AlternativesGrid products={products} />);
    expect(screen.getByText('Best Deal Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
  });

  it('renders an empty grid without crashing when products is empty', () => {
    render(<AlternativesGrid products={[]} />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
