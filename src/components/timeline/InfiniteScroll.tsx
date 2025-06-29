import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  className?: string;
}

export function InfiniteScroll({
  children,
  hasMore,
  loading,
  onLoadMore,
  threshold = 200,
  className = ''
}: InfiniteScrollProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !loading) {
      onLoadMore();
    }
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const element = loadingRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: `${threshold}px`
    });

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {children}
      
      {/* Loading Trigger Element */}
      <div ref={loadingRef} className="py-8">
        {loading && (
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="w-6 h-6 animate-spin text-sage-600" />
            <span className="text-lg text-sage-600 font-medium">Loading more memories...</span>
          </div>
        )}
        
        {!hasMore && !loading && (
          <div className="text-center py-8">
            <div className="bg-sage-50 rounded-2xl p-8 border border-sage-100">
              <div className="w-16 h-16 bg-sage-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">You've reached the end!</h3>
              <p className="text-gray-600">
                You've seen all the memories in your timeline. Keep adding new ones to grow your family's story!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}