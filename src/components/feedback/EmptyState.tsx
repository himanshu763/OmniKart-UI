import type { JSX } from 'react';

export function EmptyState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-3xl">🔍</span>
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
      <p className="text-slate-500 max-w-sm">
        We couldn't find any matching products. Try a different URL or check that the product is
        available on supported platforms.
      </p>
    </div>
  );
}
