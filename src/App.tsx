import type { JSX } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useProductComparison } from './hooks/useProductComparison';
import { Header } from './components/layout/Header';
import { SearchForm } from './components/search/SearchForm';
import { LoadingState } from './components/feedback/LoadingState';
import { ErrorBanner } from './components/feedback/ErrorBanner';
import { EmptyState } from './components/feedback/EmptyState';
import { PrimaryProductCard } from './components/results/PrimaryProductCard';
import { AlternativesGrid } from './components/results/AlternativesGrid';
import { StatusSidebar } from './components/results/StatusSidebar';
import { NotFound } from './components/NotFound';

function HomePage(): JSX.Element {
  const { data, loading, error, fetchComparison } = useProductComparison();

  const hasResults = data && (data.results.length > 0 || data.similarProducts.length > 0);
  const isEmpty = data && !hasResults;

  return (
    <div className="min-h-screen pb-20">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchForm onSubmit={fetchComparison} loading={loading} />

        {error && <ErrorBanner message={error} />}

        {loading && <LoadingState />}

        {isEmpty && <EmptyState />}

        {hasResults && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3 space-y-10">
              {data.results[0]?.product && <PrimaryProductCard result={data.results[0]} />}
              {data.similarProducts.length > 0 && (
                <AlternativesGrid products={data.similarProducts} />
              )}
            </div>
            <StatusSidebar results={data.results} />
          </div>
        )}
      </main>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
