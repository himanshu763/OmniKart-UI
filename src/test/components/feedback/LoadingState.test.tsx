import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../../../components/feedback/LoadingState';

describe('LoadingState', () => {
  it('renders without crashing', () => {
    render(<LoadingState />);
  });

  it('shows loading message', () => {
    render(<LoadingState />);
    expect(screen.getByText(/analyzing market data/i)).toBeInTheDocument();
  });
});
