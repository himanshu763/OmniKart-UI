import type { JSX } from 'react';
import type { SimilarProduct } from '../../types/api';
import { ProductCard } from './ProductCard';

interface AlternativesGridProps {
  products: SimilarProduct[];
}

export function AlternativesGrid({ products }: AlternativesGridProps): JSX.Element {
  return (
    <div>
      <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <span className="w-8 h-0.5 bg-indigo-600"></span>
        Market Alternatives
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((item, idx) => (
          <ProductCard
            key={`${item.platform}-${item.product.productUrl}`}
            item={item}
            isBestPrice={idx === 0}
          />
        ))}
      </div>
    </div>
  );
}
