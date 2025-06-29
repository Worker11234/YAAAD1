import React from 'react';
import { Link } from 'react-router-dom';
import { Feature, featureDetails, SubscriptionTier } from '../../lib/revenuecat';
import { useSubscription } from '../../hooks/useSubscription';
import { ArrowRight, Lock, Sparkles, Star } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface UpgradePromptProps {
  /**
   * The feature that requires an upgrade
   */
  feature: Feature;
  
  /**
   * Whether to show a compact version of the prompt
   */
  compact?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function UpgradePrompt({
  feature,
  compact = false,
  className = ''
}: UpgradePromptProps) {
  const { subscriptionTier } = useSubscription();
  
  // Get feature details
  const featureDetail = featureDetails.find(f => f.feature === feature);
  
  if (!featureDetail) {
    return null;
  }
  
  // Determine the minimum tier required for this feature
  const requiredTiers = featureDetail.tiers;
  let recommendedTier: SubscriptionTier;
  
  if (requiredTiers.includes(SubscriptionTier.FAMILY)) {
    recommendedTier = SubscriptionTier.FAMILY;
  } else if (requiredTiers.includes(SubscriptionTier.PREMIUM)) {
    recommendedTier = SubscriptionTier.PREMIUM;
  } else {
    recommendedTier = SubscriptionTier.CARE_PLUS;
  }
  
  // Get tier name
  const getTierName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FAMILY:
        return 'Family';
      case SubscriptionTier.PREMIUM:
        return 'Premium';
      case SubscriptionTier.CARE_PLUS:
        return 'Care+';
      default:
        return 'Free';
    }
  };
  
  // Compact version
  if (compact) {
    return (
      <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-100 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-800">
              {featureDetail.name} requires {getTierName(recommendedTier)}
            </span>
          </div>
          <TouchOptimized>
            <Link
              to="/pricing"
              className="text-xs font-medium text-purple-700 hover:text-purple-800 flex items-center"
            >
              Upgrade <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </TouchOptimized>
        </div>
      </div>
    );
  }
  
  // Full version
  return (
    <div className={`bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 ${className}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-purple-100 p-3 rounded-full">
          <Lock className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-purple-800">
            Upgrade to {getTierName(recommendedTier)}
          </h3>
          <p className="text-sm text-purple-700">
            To access {featureDetail.name}
          </p>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">
        {featureDetail.description} is available on the {getTierName(recommendedTier)} plan and higher.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <TouchOptimized>
          <Link
            to="/pricing"
            className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full"
          >
            <Sparkles className="w-5 h-5" />
            <span>View Plans</span>
          </Link>
        </TouchOptimized>
        
        <TouchOptimized>
          <Link
            to={`/pricing?plan=${recommendedTier}`}
            className="flex items-center justify-center space-x-2 bg-white border border-purple-300 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors w-full"
          >
            <Star className="w-5 h-5" />
            <span>Upgrade Now</span>
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
}