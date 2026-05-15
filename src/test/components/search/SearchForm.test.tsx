import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchForm } from '../../../components/search/SearchForm';

describe('SearchForm', () => {
  it('renders the URL input with correct aria-label', () => {
    render(<SearchForm onSubmit={vi.fn()} loading={false} />);
    expect(screen.getByRole('textbox', { name: /product url/i })).toBeInTheDocument();
  });

  it('renders the Compare button', () => {
    render(<SearchForm onSubmit={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: /compare prices/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the typed URL on submit', async () => {
    const onSubmit = vi.fn();
    render(<SearchForm onSubmit={onSubmit} loading={false} />);

    await userEvent.type(screen.getByRole('textbox'), 'https://amazon.in/dp/B01');
    await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));

    expect(onSubmit).toHaveBeenCalledWith('https://amazon.in/dp/B01');
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not call onSubmit when URL is empty', async () => {
    const onSubmit = vi.fn();
    render(<SearchForm onSubmit={onSubmit} loading={false} />);

    await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid URL', async () => {
    const onSubmit = vi.fn();
    render(<SearchForm onSubmit={onSubmit} loading={false} />);

    await userEvent.type(screen.getByRole('textbox'), 'notavalidurl');
    await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears validation error when user starts typing again', async () => {
    render(<SearchForm onSubmit={vi.fn()} loading={false} />);

    await userEvent.type(screen.getByRole('textbox'), 'notaurl');
    await userEvent.click(screen.getByRole('button', { name: /compare prices/i }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();

    await userEvent.type(screen.getByRole('textbox'), 'x');
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument());
  });

  it('disables submit button while loading', () => {
    render(<SearchForm onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: /scanning for deals/i })).toBeDisabled();
  });

  it('shows Scanning... text on button while loading', () => {
    render(<SearchForm onSubmit={vi.fn()} loading={true} />);
    expect(screen.getByText('Scanning...')).toBeInTheDocument();
  });
});
