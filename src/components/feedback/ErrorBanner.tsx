import type { JSX } from 'react';

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps): JSX.Element {
  return (
    <div
      role="alert"
      className="max-w-3xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-medium"
    >
      {message}
    </div>
  );
}
