// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#E2E4E6] dark:bg-zinc-800 px-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-4xl font-normal text-gray-900 dark:text-gray-100 mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {this.state.error && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-6 font-mono bg-gray-200 dark:bg-gray-900 p-4 rounded">
                {this.state.error.message}
              </p>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="bg-gray-600 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-500"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

