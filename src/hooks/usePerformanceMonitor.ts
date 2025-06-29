import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

export function usePerformanceMonitor() {
  const metrics = useRef<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
  });

  useEffect(() => {
    // Only run in production and if the Performance API is available
    if (process.env.NODE_ENV !== 'production' || !('performance' in window)) {
      return;
    }

    // First Contentful Paint
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstPaint = entries.find(entry => entry.name === 'first-contentful-paint');
      if (firstPaint) {
        metrics.current.fcp = firstPaint.startTime;
        console.log(`FCP: ${metrics.current.fcp}ms`);
      }
    });
    
    fcpObserver.observe({ type: 'paint', buffered: true });

    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        metrics.current.lcp = lastEntry.startTime;
        console.log(`LCP: ${metrics.current.lcp}ms`);
      }
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const firstInput = entries[0];
      if (firstInput) {
        metrics.current.fid = firstInput.processingStart - firstInput.startTime;
        console.log(`FID: ${metrics.current.fid}ms`);
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((entryList) => {
      let clsValue = 0;
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          // @ts-ignore
          clsValue += entry.value;
        }
      }
      metrics.current.cls = clsValue;
      console.log(`CLS: ${metrics.current.cls}`);
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Time to First Byte
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries.length > 0) {
      // @ts-ignore
      metrics.current.ttfb = navigationEntries[0].responseStart;
      console.log(`TTFB: ${metrics.current.ttfb}ms`);
    }

    // Clean up
    return () => {
      fcpObserver.disconnect();
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  return metrics.current;
}