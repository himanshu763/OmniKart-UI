import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotFound } from '../../components/NotFound';

describe('NotFound', () => {
  it('renders the 404 heading', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  });

  it('renders a link back to home', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    const link = screen.getByRole('link', { name: /back to search/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
