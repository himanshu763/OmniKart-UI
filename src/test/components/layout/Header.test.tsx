import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../../../components/layout/Header';

describe('Header', () => {
  it('renders the OmniKart brand name', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByText('Kart')).toBeInTheDocument();
  });

  it('shows the version badge', () => {
    render(<Header />);
    expect(screen.getByText(/v2\.0 beta/i)).toBeInTheDocument();
  });
});
