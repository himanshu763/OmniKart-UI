import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceBadge } from '../../../components/results/ConfidenceBadge';

describe('ConfidenceBadge', () => {
  it('shows correct percentage text', () => {
    render(<ConfidenceBadge score={0.85} />);
    expect(screen.getByText('85% Match')).toBeInTheDocument();
  });

  it('renders green badge for score >= 0.7', () => {
    render(<ConfidenceBadge score={0.8} />);
    const badge = screen.getByText('80% Match');
    expect(badge).toHaveClass('bg-emerald-100');
    expect(badge).toHaveClass('text-emerald-700');
  });

  it('renders amber badge for score >= 0.5 and < 0.7', () => {
    render(<ConfidenceBadge score={0.6} />);
    const badge = screen.getByText('60% Match');
    expect(badge).toHaveClass('bg-amber-100');
    expect(badge).toHaveClass('text-amber-700');
  });

  it('renders red badge for score < 0.5', () => {
    render(<ConfidenceBadge score={0.3} />);
    const badge = screen.getByText('30% Match');
    expect(badge).toHaveClass('bg-rose-100');
    expect(badge).toHaveClass('text-rose-700');
  });

  it('renders red badge at exact 0.7 boundary (green)', () => {
    render(<ConfidenceBadge score={0.7} />);
    const badge = screen.getByText('70% Match');
    expect(badge).toHaveClass('bg-emerald-100');
  });

  it('renders red badge at exact 0.5 boundary (amber)', () => {
    render(<ConfidenceBadge score={0.5} />);
    const badge = screen.getByText('50% Match');
    expect(badge).toHaveClass('bg-amber-100');
  });

  it('rounds score to nearest integer', () => {
    render(<ConfidenceBadge score={0.756} />);
    expect(screen.getByText('76% Match')).toBeInTheDocument();
  });
});
