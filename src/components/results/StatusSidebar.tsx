import type { JSX } from 'react';
import type { PlatformResult } from '../../types/api';

interface StatusSidebarProps {
  results: PlatformResult[];
}

export function StatusSidebar({ results }: StatusSidebarProps): JSX.Element {
  return (
    <aside className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sticky top-28">
        <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6 border-b border-slate-50 pb-4">
          Scanner Status
        </h4>
        <div className="space-y-4 mb-8">
          {results.map((res) => (
            <div key={res.platform} className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-500 capitalize">{res.platform}</span>
              <div
                className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                  res.status === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-slate-50 text-slate-400'
                }`}
              >
                {res.status === 'success' ? 'Ready' : 'Skipped'}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-indigo-600 rounded-xl p-4 text-white">
          <p className="text-[10px] font-bold opacity-70 uppercase mb-1">Engine Score</p>
          <p className="text-xl font-black">Optimal Result</p>
        </div>
      </div>
    </aside>
  );
}
