import type { JSX } from 'react';

export function Header(): JSX.Element {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center transform -rotate-6">
            <span className="text-white font-black text-2xl leading-none">O</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Omni<span className="text-indigo-600">Kart</span>
          </h1>
        </div>
        <div className="hidden sm:block">
          <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold tracking-widest uppercase">
            v2.0 Beta
          </span>
        </div>
      </div>
    </header>
  );
}
