import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  transparent?: boolean;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingOverlay({
  isLoading,
  message = 'Loading...',
  transparent = false,
  fullScreen = false,
  className = '',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`
        ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'}
        ${transparent ? 'bg-white bg-opacity-75' : 'bg-white'}
        flex flex-col items-center justify-center
        ${className}
      `}
    >
      <Loader2 className="w-10 h-10 text-sage-600 animate-spin" />
      {message && (
        <p className="mt-4 text-sage-700 font-medium">{message}</p>
      )}
    </div>
  );
}