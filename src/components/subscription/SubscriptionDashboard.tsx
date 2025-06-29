import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  Database, 
  Sparkles, 
  Users, 
  Calendar, 
  ArrowRight, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import { SubscriptionTier, Feature } from '../../lib/revenuecat';
import { formatBytes, calculatePercentage, formatCurrency } from '../../lib/utils';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SubscriptionDashboardProps {
  className?: string;
}

export function SubscriptionDashboard({ className = '' }: SubscriptionDashboardProps) {
  const { 
    subscriptionTier, 
    isSubscribed,
    usageLimits,
    usageData,
    isLoading,
    error,
    calculateStoragePercentage,
    calculateAIRequestsPercentage,
    calculateFamilyMembersPercentage,
    refreshSubscriptionStatus,
    restoreSubscription
  } = useSubscription();
  
  const [isRestoring, setIsRestoring] = React.useState(false);
  const [restoreError, setRestoreError] = React.useState<string | null>(null);
  const [restoreSuccess, setRestoreSuccess] = React.useState(false);
  
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
  
  // Handle restore purchases
  const handleRestore = async () => {
    setIsRestoring(true);
    setRestoreError(null);
    setRestoreSuccess(false);
    
    try {
      await restoreSubscription();
      setRestoreSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setRestoreSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Restore error:', err);
      setRestoreError(err.message || 'Failed to restore purchases');
    } finally {
      setIsRestoring(false);
    }
  };
  
  // Get storage percentage color
  const getStoragePercentageColor = () => {
    const percentage = calculateStoragePercentage();
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Get AI requests percentage color
  const getAIRequestsPercentageColor = () => {
    const percentage = calculateAIRequestsPercentage();
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Get family members percentage color
  const getFamilyMembersPercentageColor = () => {
    const percentage = calculateFamilyMembersPercentage();
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          
          <div className="h-12 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Dashboard</h2>
          <p className="text-gray-600">
            {isSubscribed 
              ? `You are currently on the ${getTierName(subscriptionTier)} plan` 
              : 'You are currently on the Free plan'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <TouchOptimized>
            <button
              onClick={refreshSubscriptionStatus}
              className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Refresh subscription status"
            >
              <RefreshCw size={20} />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <Link
              to="/pricing"
              className={`
                px-4 py-2 rounded-lg text-sm font-medium
                ${isSubscribed 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-sage-700 text-white hover:bg-sage-800'}
                transition-colors
              `}
            >
              {isSubscribed ? 'Manage Subscription' : 'Upgrade Now'}
            </Link>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Error Message */}
      {(error || restoreError) && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error || restoreError}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success Message */}
      {restoreSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Success</p>
              <p className="text-sm">Your purchases have been restored successfully.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Storage Usage */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Storage Usage</h3>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                {formatBytes(usageData.storageUsed * 1024 * 1024 * 1024)} used
              </span>
              <span className={`text-sm font-medium ${getStoragePercentageColor()}`}>
                {calculateStoragePercentage()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  calculateStoragePercentage() >= 90 ? 'bg-red-600' :
                  calculateStoragePercentage() >= 75 ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                style={{ width: `${calculateStoragePercentage()}%` }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {typeof usageLimits.storage === 'number' 
              ? `${formatBytes(usageLimits.storage * 1024 * 1024 * 1024)} total storage` 
              : 'Unlimited storage'}
          </p>
          
          {calculateStoragePercentage() >= 75 && (
            <div className="mt-3 text-sm">
              <Link 
                to="/pricing" 
                className="text-sage-600 hover:text-sage-700 font-medium"
              >
                Upgrade for more storage
              </Link>
            </div>
          )}
        </div>
        
        {/* AI Requests */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">AI Requests</h3>
          </div>
          
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">
                {usageData.aiRequestsUsed} used this month
              </span>
              <span className={`text-sm font-medium ${getAIRequestsPercentageColor()}`}>
                {calculateAIRequestsPercentage()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  calculateAIRequestsPercentage() >= 90 ? 'bg-red-600' :
                  calculateAIRequestsPercentage() >= 75 ? 'bg-yellow-600' : 'bg-green-600'
                }`}
                style={{ width: `${calculateAIRequestsPercentage()}%` }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            {usageLimits.aiRequests === Infinity 
              ? 'Unlimited AI requests' 
              : `${usageLimits.aiRequests} requests per month`}
          </p>
          
          {calculateAIRequestsPercentage() >= 75 && (
            <div className="mt-3 text-sm">
              <Link 
                to="/pricing" 
                className="text-sage-600 hover:text-sage-700 font-medium"
              >
                Upgrade for more AI requests
              </Link>
            </div>
          )}
        </div>
        
        {/* Family Members */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="w-5 h-5 text-sage-600" />
            <h3 className="font-semibold text-gray-900">Family Members</h3>
          </div>
          
          {usageLimits.familyMembers === 'unlimited' ? (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-1">
                {usageData.familyMembersCount} members
              </p>
              <p className="text-sm text-gray-600">
                Unlimited family members
              </p>
            </div>
          ) : (
            <>
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    {usageData.familyMembersCount} members
                  </span>
                  <span className={`text-sm font-medium ${getFamilyMembersPercentageColor()}`}>
                    {calculateFamilyMembersPercentage()}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      calculateFamilyMembersPercentage() >= 90 ? 'bg-red-600' :
                      calculateFamilyMembersPercentage() >= 75 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${calculateFamilyMembersPercentage()}%` }}
                  />
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                {usageLimits.familyMembers} total members allowed
              </p>
              
              {calculateFamilyMembersPercentage() >= 75 && (
                <div className="mt-3 text-sm">
                  <Link 
                    to="/pricing" 
                    className="text-sage-600 hover:text-sage-700 font-medium"
                  >
                    Upgrade for unlimited members
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Subscription Details */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <CreditCard className="w-6 h-6 text-sage-600" />
          <h3 className="text-xl font-semibold text-gray-900">Subscription Details</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Plan</p>
            <p className="text-lg font-semibold text-gray-900">
              {getTierName(subscriptionTier)}
              {isSubscribed && (
                <span className="ml-2 text-sm font-normal text-gray-600">
                  ({formatCurrency(subscriptionTier === SubscriptionTier.FAMILY ? 9.99 : 
                                   subscriptionTier === SubscriptionTier.PREMIUM ? 19.99 : 
                                   subscriptionTier === SubscriptionTier.CARE_PLUS ? 39.99 : 0)}/month)
                </span>
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Renewal Date</p>
            <p className="text-lg font-semibold text-gray-900">
              {isSubscribed 
                ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString() 
                : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
            <p className="text-lg font-semibold text-gray-900">
              {isSubscribed ? 'Monthly' : 'N/A'}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-1">Payment Method</p>
            <p className="text-lg font-semibold text-gray-900">
              {isSubscribed ? '•••• •••• •••• 1234' : 'N/A'}
            </p>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-end">
          {isSubscribed && (
            <TouchOptimized>
              <Link
                to="/billing-history"
                className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5" />
                <span>Billing History</span>
              </Link>
            </TouchOptimized>
          )}
          
          <TouchOptimized>
            <button
              onClick={handleRestore}
              disabled={isRestoring}
              className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isRestoring ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Restoring...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Restore Purchases</span>
                </>
              )}
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <Link
              to="/pricing"
              className={`
                flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
                ${isSubscribed 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-sage-700 text-white hover:bg-sage-800'}
                transition-colors
              `}
            >
              {isSubscribed ? 'Manage Subscription' : 'Upgrade Now'}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}