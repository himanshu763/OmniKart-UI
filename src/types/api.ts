export interface Product {
  title: string;
  price: string;
  productUrl: string;
}

export interface PlatformResult {
  product: Product;
  platform: string;
  status: 'success' | 'skipped';
}

export interface SimilarProduct {
  product: Product;
  platform: string;
  confidence: number;
}

export interface ComparisonResponse {
  results: PlatformResult[];
  similarProducts: SimilarProduct[];
}
