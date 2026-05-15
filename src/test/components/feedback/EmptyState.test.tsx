import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../../../components/feedback/EmptyState';

describe('EmptyState', () => {
  it('renders without crashing', () => {
    render(<EmptyState />);
  });

  it('shows a "No results found" heading', () => {
    render(<EmptyState />);
    expect(screen.getByRole('heading', { name: /no results found/i })).toBeInTheDocument();
  });

  it('renders a helpful description', () => {
    render(<EmptyState />);
    expect(screen.getByText(/try a different url/i)).toBeInTheDocument();
  });
});
