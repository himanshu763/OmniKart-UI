import type { JSX } from 'react';

export function LoadingState(): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-pulse">
      <div className="relative w-20 h-20 mb-6">
        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-indigo-600 font-bold text-lg">Analyzing market data...</p>
    </div>
  );
}
