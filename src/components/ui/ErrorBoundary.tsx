import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from './TouchOptimized';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // In a production app, you would send this to your error tracking service
    // Example: Sentry.captureException(error);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6 text-center">
              We're sorry, but an error occurred while rendering this page. 
              You can try reloading the page or returning to the dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TouchOptimized>
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors w-full"
                >
                  <RefreshCw size={18} />
                  <span>Reload Page</span>
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center space-x-2 border border-sage-700 text-sage-700 px-4 py-2 rounded-lg hover:bg-sage-50 transition-colors w-full"
                >
                  <Home size={18} />
                  <span>Go to Dashboard</span>
                </Link>
              </TouchOptimized>
            </div>
            
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg overflow-auto max-h-60">
                <p className="font-mono text-sm text-red-600 mb-2">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-xs text-gray-700 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}