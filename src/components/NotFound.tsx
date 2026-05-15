import type { JSX } from 'react';
import { Link } from 'react-router-dom';

export function NotFound(): JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
        <span className="text-3xl font-black text-indigo-600">404</span>
      </div>
      <h1 className="text-2xl font-black text-slate-900 mb-2">Page not found</h1>
      <p className="text-slate-500 mb-8 max-w-sm">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all"
      >
        Back to search
      </Link>
    </div>
  );
}
