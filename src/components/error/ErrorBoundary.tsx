'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
              <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                エラーが発生しました
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {this.state.error?.message || '予期しないエラーが発生しました'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-lg bg-primary-600 px-6 py-3 text-white hover:bg-primary-700"
              >
                ページを再読み込み
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
