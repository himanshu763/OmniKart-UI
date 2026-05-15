import type { JSX } from 'react';
import type { PlatformResult } from '../../types/api';

interface PrimaryProductCardProps {
  result: PlatformResult;
}

export function PrimaryProductCard({ result }: PrimaryProductCardProps): JSX.Element {
  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col md:flex-row group transition-all hover:border-indigo-200">
      <div className="p-8 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
          <span className="text-indigo-600 text-[10px] font-black uppercase tracking-widest">
            Tracking Live Price
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
          {result.product.title}
        </h2>
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-md">
            <span className="w-4 h-4 rounded-full bg-slate-200"></span>
            <span className="text-xs font-bold capitalize">{result.platform}</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 p-8 flex flex-col justify-center items-center md:items-end border-t md:border-t-0 md:border-l border-slate-100 min-w-70">
        <span className="text-slate-400 text-sm font-bold uppercase mb-1">Found For</span>
        <div className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
          {result.product.price}
        </div>
        <a
          href={result.product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-center bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all shadow-lg"
        >
          Visit Store
        </a>
      </div>
    </div>
  );
}
