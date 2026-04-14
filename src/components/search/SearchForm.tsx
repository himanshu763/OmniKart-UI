import { useState } from 'react';
import type { JSX, FormEvent } from 'react';
import { validateUrl } from '../../lib/validation';

interface SearchFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export function SearchForm({ onSubmit, loading }: SearchFormProps): JSX.Element {
  const [inputUrl, setInputUrl] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    if (!validateUrl(inputUrl)) {
      setValidationError('Please enter a valid product URL (e.g. https://amazon.com/...)');
      return;
    }

    setValidationError(null);
    onSubmit(inputUrl);
  };

  return (
    <section className="pt-16 pb-20 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
        Stop overpaying.{' '}
        <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
          Scan the web.
        </span>
      </h2>
      <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
        Paste any product link below and we'll instantly find better deals across major
        marketplaces.
      </p>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-center p-2 bg-white rounded-2xl shadow-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
          <input
            type="url"
            aria-label="Product URL"
            placeholder="Paste Amazon or Flipkart URL..."
            className="flex-1 py-4 px-6 outline-none text-slate-700 text-lg bg-transparent"
            value={inputUrl}
            onChange={(e) => {
              setInputUrl(e.target.value);
              if (validationError) setValidationError(null);
            }}
          />
          <button
            type="submit"
            aria-label={loading ? 'Scanning for deals' : 'Compare prices'}
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Compare'}
          </button>
        </div>
        {validationError && (
          <p role="alert" className="mt-3 text-sm text-rose-600 font-medium">
            {validationError}
          </p>
        )}
      </form>
    </section>
  );
}
