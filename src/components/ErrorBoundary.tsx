import { Component } from 'react';
import type { ReactNode, JSX } from 'react';
import { ErrorBanner } from './feedback/ErrorBanner';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render(): JSX.Element {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md w-full">
            <ErrorBanner message="Something went wrong. Please refresh the page and try again." />
          </div>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}
