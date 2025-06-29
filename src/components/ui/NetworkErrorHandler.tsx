import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { TouchOptimized } from './TouchOptimized';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

export function NetworkErrorHandler({ children }: NetworkErrorHandlerProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkError(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    // Listen for online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Setup global fetch error handling
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        // Reset network error state on successful fetch
        if (hasNetworkError) {
          setHasNetworkError(false);
        }
        return response;
      } catch (error) {
        // Set network error state
        setHasNetworkError(true);
        throw error;
      }
    };

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.fetch = originalFetch;
    };
  }, [hasNetworkError]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    
    // Reload the page if we've tried too many times
    if (retryCount >= 2) {
      window.location.reload();
    } else {
      // Just reset the error state and let components retry their fetches
      setHasNetworkError(false);
    }
  };

  if (!isOnline) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-200">
          <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-6">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
            You're offline
          </h2>
          
          <p className="text-gray-600 mb-6 text-center">
            Please check your internet connection and try again. Your changes will be saved locally and synced when you're back online.
          </p>
          
          <div className="flex justify-center">
            <TouchOptimized>
              <button
                onClick={handleRetry}
                className="flex items-center justify-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-lg hover:bg-sage-800 transition-colors"
              >
                <RefreshCw size={18} />
                <span>Try Again</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    );
  }

  if (hasNetworkError) {
    return (
      <div className="fixed bottom-4 right-4 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-sm">
        <div className="flex items-center space-x-3">
          <WifiOff className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Network Error</p>
            <p className="text-sm">There was a problem connecting to the server.</p>
          </div>
          <TouchOptimized>
            <button
              onClick={handleRetry}
              className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition-colors"
            >
              <RefreshCw size={16} className="text-red-600" />
            </button>
          </TouchOptimized>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}