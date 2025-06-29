import React from 'react';
import { Feature } from '../../lib/revenuecat';
import { useSubscription } from '../../hooks/useSubscription';
import { UpgradePrompt } from './UpgradePrompt';

interface FeatureGateProps {
  /**
   * The feature to check
   */
  feature: Feature;
  
  /**
   * The content to render if the feature is available
   */
  children: React.ReactNode;
  
  /**
   * Optional fallback UI to render if the feature is not available
   */
  fallback?: React.ReactNode;
  
  /**
   * Whether to show an upgrade prompt if the feature is not available
   */
  showUpgradePrompt?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function FeatureGate({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  className
}: FeatureGateProps) {
  const { isFeatureAvailable, isLoading } = useSubscription();
  
  // If still loading, show a loading state
  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }
  
  // Check if the feature is available
  const isAvailable = isFeatureAvailable(feature);
  
  // If the feature is available, render the children
  if (isAvailable) {
    return <>{children}</>;
  }
  
  // If the feature is not available, render the fallback or upgrade prompt
  return (
    <div className={className}>
      {fallback ? (
        fallback
      ) : showUpgradePrompt ? (
        <UpgradePrompt feature={feature} />
      ) : null}
    </div>
  );
}