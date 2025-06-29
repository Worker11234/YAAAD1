import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  initializeRevenueCat,
  identifyUser,
  getCustomerInfo,
  purchaseProduct,
  restorePurchases,
  getCurrentSubscriptionTier,
  isFeatureAvailable,
  getUsageLimits,
  SubscriptionTier,
  ProductId,
  Feature
} from '../lib/revenuecat';

interface UsageData {
  storageUsed: number; // in GB
  aiRequestsUsed: number;
  familyMembersCount: number;
}

interface SubscriptionHook {
  isLoading: boolean;
  error: string | null;
  subscriptionTier: SubscriptionTier;
  isSubscribed: boolean;
  usageLimits: {
    storage: number;
    aiRequests: number;
    familyMembers: number | 'unlimited';
  };
  usageData: UsageData;
  isFeatureAvailable: (feature: Feature) => boolean;
  purchaseSubscription: (productId: ProductId) => Promise<void>;
  restoreSubscription: () => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
  calculateStoragePercentage: () => number;
  calculateAIRequestsPercentage: () => number;
  calculateFamilyMembersPercentage: () => number;
  hasReachedStorageLimit: () => boolean;
  hasReachedAIRequestsLimit: () => boolean;
  hasReachedFamilyMembersLimit: () => boolean;
}

export function useSubscription(): SubscriptionHook {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(SubscriptionTier.FREE);
  const [usageLimits, setUsageLimits] = useState({
    storage: 1,
    aiRequests: 100,
    familyMembers: 5 as number | 'unlimited'
  });
  
  // Mock usage data - in a real app, this would come from your backend
  const [usageData, setUsageData] = useState<UsageData>({
    storageUsed: 0.3, // 300MB
    aiRequestsUsed: 25,
    familyMembersCount: 3
  });
  
  // Initialize RevenueCat and load subscription data
  useEffect(() => {
    const initSubscription = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Initialize RevenueCat
        const initialized = initializeRevenueCat();
        
        if (!initialized) {
          throw new Error('Failed to initialize RevenueCat');
        }
        
        // Identify user if logged in
        if (user) {
          await identifyUser(user.id);
        }
        
        // Get current subscription tier
        const tier = await getCurrentSubscriptionTier();
        setSubscriptionTier(tier);
        
        // Get usage limits
        const limits = await getUsageLimits();
        setUsageLimits(limits);
        
        // In a real app, fetch actual usage data from your backend
        // For now, we'll use mock data
        fetchUsageData();
        
      } catch (err) {
        console.error('Subscription initialization error:', err);
        setError('Failed to load subscription data');
      } finally {
        setIsLoading(false);
      }
    };
    
    initSubscription();
  }, [user]);
  
  // Mock function to fetch usage data - in a real app, this would be an API call
  const fetchUsageData = useCallback(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data - in a real app, this would come from your backend
      setUsageData({
        storageUsed: 0.3, // 300MB
        aiRequestsUsed: 25,
        familyMembersCount: 3
      });
    }, 500);
  }, []);
  
  // Check if a feature is available
  const checkFeatureAvailability = useCallback((feature: Feature): boolean => {
    // This is a client-side check for UI purposes
    // In a real app, you should also verify this on the server
    
    switch (feature) {
      // Storage features
      case Feature.STORAGE_BASIC:
        return true; // Available to all tiers
      case Feature.STORAGE_FAMILY:
        return [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.STORAGE_PREMIUM:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.STORAGE_CAREPLUS:
        return subscriptionTier === SubscriptionTier.CARE_PLUS;
        
      // Family features
      case Feature.FAMILY_BASIC:
        return true; // Available to all tiers
      case Feature.FAMILY_UNLIMITED:
        return [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
        
      // AI features
      case Feature.AI_BASIC:
        return true; // Available to all tiers
      case Feature.AI_FAMILY:
        return [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.AI_PREMIUM:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.AI_UNLIMITED:
        return subscriptionTier === SubscriptionTier.CARE_PLUS;
        
      // Other features
      case Feature.MEMORY_EXPORT:
        return [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.HEALTHCARE_API:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.ADVANCED_ANALYTICS:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(subscriptionTier);
      case Feature.COGNITIVE_ASSESSMENT:
        return subscriptionTier === SubscriptionTier.CARE_PLUS;
      case Feature.MEDICAL_REPORTS:
        return subscriptionTier === SubscriptionTier.CARE_PLUS;
        
      default:
        return false;
    }
  }, [subscriptionTier]);
  
  // Purchase a subscription
  const purchase = useCallback(async (productId: ProductId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await purchaseProduct(productId);
      
      // Refresh subscription status
      const tier = await getCurrentSubscriptionTier();
      setSubscriptionTier(tier);
      
      // Update usage limits
      const limits = await getUsageLimits();
      setUsageLimits(limits);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Failed to complete purchase');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Restore purchases
  const restore = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await restorePurchases();
      
      // Refresh subscription status
      const tier = await getCurrentSubscriptionTier();
      setSubscriptionTier(tier);
      
      // Update usage limits
      const limits = await getUsageLimits();
      setUsageLimits(limits);
    } catch (err: any) {
      console.error('Restore error:', err);
      setError(err.message || 'Failed to restore purchases');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Refresh subscription status
  const refreshStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current subscription tier
      const tier = await getCurrentSubscriptionTier();
      setSubscriptionTier(tier);
      
      // Get usage limits
      const limits = await getUsageLimits();
      setUsageLimits(limits);
      
      // Refresh usage data
      fetchUsageData();
    } catch (err: any) {
      console.error('Refresh error:', err);
      setError(err.message || 'Failed to refresh subscription status');
    } finally {
      setIsLoading(false);
    }
  }, [fetchUsageData]);
  
  // Calculate usage percentages
  const calculateStoragePercentage = useCallback(() => {
    if (typeof usageLimits.storage !== 'number') return 0;
    return Math.min(Math.round((usageData.storageUsed / usageLimits.storage) * 100), 100);
  }, [usageData.storageUsed, usageLimits.storage]);
  
  const calculateAIRequestsPercentage = useCallback(() => {
    if (typeof usageLimits.aiRequests !== 'number' || usageLimits.aiRequests === Infinity) return 0;
    return Math.min(Math.round((usageData.aiRequestsUsed / usageLimits.aiRequests) * 100), 100);
  }, [usageData.aiRequestsUsed, usageLimits.aiRequests]);
  
  const calculateFamilyMembersPercentage = useCallback(() => {
    if (usageLimits.familyMembers === 'unlimited') return 0;
    return Math.min(Math.round((usageData.familyMembersCount / usageLimits.familyMembers) * 100), 100);
  }, [usageData.familyMembersCount, usageLimits.familyMembers]);
  
  // Check if limits have been reached
  const hasReachedStorageLimit = useCallback(() => {
    if (typeof usageLimits.storage !== 'number') return false;
    return usageData.storageUsed >= usageLimits.storage;
  }, [usageData.storageUsed, usageLimits.storage]);
  
  const hasReachedAIRequestsLimit = useCallback(() => {
    if (typeof usageLimits.aiRequests !== 'number' || usageLimits.aiRequests === Infinity) return false;
    return usageData.aiRequestsUsed >= usageLimits.aiRequests;
  }, [usageData.aiRequestsUsed, usageLimits.aiRequests]);
  
  const hasReachedFamilyMembersLimit = useCallback(() => {
    if (usageLimits.familyMembers === 'unlimited') return false;
    return usageData.familyMembersCount >= usageLimits.familyMembers;
  }, [usageData.familyMembersCount, usageLimits.familyMembers]);
  
  return {
    isLoading,
    error,
    subscriptionTier,
    isSubscribed: subscriptionTier !== SubscriptionTier.FREE,
    usageLimits,
    usageData,
    isFeatureAvailable: checkFeatureAvailability,
    purchaseSubscription: purchase,
    restoreSubscription: restore,
    refreshSubscriptionStatus: refreshStatus,
    calculateStoragePercentage,
    calculateAIRequestsPercentage,
    calculateFamilyMembersPercentage,
    hasReachedStorageLimit,
    hasReachedAIRequestsLimit,
    hasReachedFamilyMembersLimit
  };
}