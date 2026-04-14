import type { JSX } from 'react';
import type { SimilarProduct } from '../../types/api';
import { ConfidenceBadge } from './ConfidenceBadge';

interface ProductCardProps {
  item: SimilarProduct;
  isBestPrice: boolean;
}

export function ProductCard({ item, isBestPrice }: ProductCardProps): JSX.Element {
  return (
    <article className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-indigo-400 hover:shadow-2xl hover:shadow-indigo-100 transition-all group flex flex-col relative">
      {isBestPrice && (
        <div className="absolute -top-3 left-6 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">
          BEST PRICE
        </div>
      )}
      <div className="flex justify-between items-start mb-4 pt-2">
        <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">
          {item.platform}
        </span>
        <ConfidenceBadge score={item.confidence} />
      </div>
      <h4 className="text-sm font-bold text-slate-800 line-clamp-2 mb-6 group-hover:text-indigo-600 transition-colors">
        {item.product.title}
      </h4>
      <div className="mt-auto">
        <div className="text-2xl font-black text-slate-900 mb-4">{item.product.price}</div>
        <a
          href={item.product.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center border-2 border-slate-100 text-slate-600 font-bold py-2.5 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 hover:text-indigo-600 transition-all"
        >
          View Deal
        </a>
      </div>
    </article>
  );
}
