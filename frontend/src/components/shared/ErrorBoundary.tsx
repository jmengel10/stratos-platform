'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Send to monitoring service if available
    if (typeof window !== 'undefined' && (window as any).appInsights) {
      (window as any).appInsights.trackException({
        exception: error,
        properties: {
          componentStack: errorInfo.componentStack
        }
      });
    }

    this.setState({
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      showDetails: false
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prev => ({
      showDetails: !prev.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white rounded-xl border border-slate-200 shadow-lg p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-3xl font-bold text-slate-900 text-center mb-3">
              Oops! Something went wrong
            </h1>

            {/* Description */}
            <p className="text-slate-600 text-center mb-6">
              We're sorry, but something unexpected happened. Don't worry, your data is safe.
              You can try refreshing the page or return to the homepage.
            </p>

            {/* Error Details (Collapsible) */}
            <div className="mb-6 border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={this.toggleDetails}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="text-sm font-medium text-slate-700">
                  Technical Details
                </span>
                {this.state.showDetails ? (
                  <ChevronUp className="w-5 h-5 text-slate-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500" />
                )}
              </button>

              {this.state.showDetails && (
                <div className="p-4 bg-slate-50 border-t border-slate-200">
                  {/* Error Message */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-1">
                      Error Message:
                    </p>
                    <div className="bg-white border border-slate-200 rounded p-3">
                      <code className="text-xs text-red-600 break-all">
                        {this.state.error?.message || 'Unknown error'}
                      </code>
                    </div>
                  </div>

                  {/* Stack Trace */}
                  {this.state.error?.stack && (
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Stack Trace:
                      </p>
                      <div className="bg-white border border-slate-200 rounded p-3 max-h-48 overflow-auto">
                        <pre className="text-xs text-slate-600 whitespace-pre-wrap break-all">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Component Stack */}
                  {this.state.errorInfo?.componentStack && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Component Stack:
                      </p>
                      <div className="bg-white border border-slate-200 rounded p-3 max-h-48 overflow-auto">
                        <pre className="text-xs text-slate-600 whitespace-pre-wrap break-all">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Button>
            </div>

            {/* Support Link */}
            <p className="text-center text-sm text-slate-500">
              If this problem persists, please{' '}
              <a
                href="mailto:support@stratos-platform.com"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

