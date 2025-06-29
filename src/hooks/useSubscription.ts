import { useState, useEffect } from 'react';
import { SubscriptionTier, Feature, ProductId } from '../lib/revenuecat';

interface UsageData {
  storageUsed: number; // in GB
  aiRequestsUsed: number;
  familyMembersCount: number;
}

interface UsageLimits {
  storage: number | 'unlimited'; // in GB
  aiRequests: number | typeof Infinity;
  familyMembers: number | 'unlimited';
}

interface SubscriptionState {
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  subscriptionInfo: any;
  subscriptionTier: SubscriptionTier;
  usageData: UsageData;
  usageLimits: UsageLimits;
}

interface SubscriptionHook extends SubscriptionState {
  checkSubscription: () => Promise<void>;
  purchaseSubscription: (productId: ProductId) => Promise<boolean>;
  restoreSubscription: () => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
  hasReachedStorageLimit: () => boolean;
  calculateStoragePercentage: () => number;
  calculateAIRequestsPercentage: () => number;
  calculateFamilyMembersPercentage: () => number;
  isFeatureAvailable: (feature: Feature) => boolean;
}

export function useSubscription(): SubscriptionHook {
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    isLoading: true,
    error: null,
    subscriptionInfo: null,
    subscriptionTier: SubscriptionTier.FREE,
    usageData: {
      storageUsed: 0.5, // 0.5 GB used
      aiRequestsUsed: 25,
      familyMembersCount: 3,
    },
    usageLimits: {
      storage: 1, // 1 GB for free tier
      aiRequests: 100,
      familyMembers: 5,
    },
  });

  const initSubscription = async () => {
    try {
      const revenueCatKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
      
      // Check if RevenueCat key is properly configured
      if (!revenueCatKey || revenueCatKey === 'YOUR_REVENUECAT_PUBLIC_KEY') {
        console.warn('RevenueCat not configured. Subscription features will be disabled.');
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: null, // Don't treat this as an error, just a missing configuration
          isSubscribed: false,
        }));
        return;
      }

      // Initialize RevenueCat here when properly configured
      // For now, we'll simulate the initialization
      console.log('RevenueCat would be initialized with key:', revenueCatKey);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to initialize subscription service',
      }));
    }
  };

  const checkSubscription = async () => {
    const revenueCatKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (!revenueCatKey || revenueCatKey === 'YOUR_REVENUECAT_PUBLIC_KEY') {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Check subscription status here
      // For now, we'll simulate this
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubscribed: false, // Default to false for demo
      }));
    } catch (error) {
      console.error('Failed to check subscription:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to check subscription status',
      }));
    }
  };

  const purchaseSubscription = async (productId: ProductId): Promise<boolean> => {
    const revenueCatKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (!revenueCatKey || revenueCatKey === 'YOUR_REVENUECAT_PUBLIC_KEY') {
      console.warn('RevenueCat not configured. Cannot purchase subscription.');
      return false;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Purchase subscription here
      // For now, we'll simulate this
      console.log('Would purchase subscription:', productId);
      
      // Simulate successful purchase and update tier based on product
      let newTier = SubscriptionTier.FREE;
      let newLimits = state.usageLimits;
      
      if (productId.includes('family')) {
        newTier = SubscriptionTier.FAMILY;
        newLimits = {
          storage: 50,
          aiRequests: 500,
          familyMembers: 'unlimited',
        };
      } else if (productId.includes('premium')) {
        newTier = SubscriptionTier.PREMIUM;
        newLimits = {
          storage: 200,
          aiRequests: 2000,
          familyMembers: 'unlimited',
        };
      } else if (productId.includes('care')) {
        newTier = SubscriptionTier.CARE_PLUS;
        newLimits = {
          storage: 500,
          aiRequests: Infinity,
          familyMembers: 'unlimited',
        };
      }
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isSubscribed: true,
        subscriptionTier: newTier,
        usageLimits: newLimits,
      }));
      
      return true;
    } catch (error) {
      console.error('Failed to purchase subscription:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to purchase subscription',
      }));
      return false;
    }
  };

  const restoreSubscription = async () => {
    const revenueCatKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (!revenueCatKey || revenueCatKey === 'YOUR_REVENUECAT_PUBLIC_KEY') {
      console.warn('RevenueCat not configured. Cannot restore purchases.');
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Restore purchases here
      // For now, we'll simulate this
      console.log('Would restore purchases');
      
      setState(prev => ({
        ...prev,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to restore purchases',
      }));
    }
  };

  const refreshSubscriptionStatus = async () => {
    await checkSubscription();
  };

  const hasReachedStorageLimit = (): boolean => {
    if (state.usageLimits.storage === 'unlimited') {
      return false;
    }
    return state.usageData.storageUsed >= (state.usageLimits.storage as number);
  };

  const calculateStoragePercentage = (): number => {
    if (state.usageLimits.storage === 'unlimited') {
      return 0;
    }
    const percentage = (state.usageData.storageUsed / (state.usageLimits.storage as number)) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const calculateAIRequestsPercentage = (): number => {
    if (state.usageLimits.aiRequests === Infinity) {
      return 0;
    }
    const percentage = (state.usageData.aiRequestsUsed / (state.usageLimits.aiRequests as number)) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const calculateFamilyMembersPercentage = (): number => {
    if (state.usageLimits.familyMembers === 'unlimited') {
      return 0;
    }
    const percentage = (state.usageData.familyMembersCount / (state.usageLimits.familyMembers as number)) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const isFeatureAvailable = (feature: Feature): boolean => {
    // Simple feature availability check based on subscription tier
    switch (feature) {
      case Feature.STORAGE_FAMILY:
        return state.subscriptionTier !== SubscriptionTier.FREE;
      case Feature.MEMORY_EXPORT:
        return [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(state.subscriptionTier);
      case Feature.HEALTHCARE_API:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(state.subscriptionTier);
      case Feature.ADVANCED_ANALYTICS:
        return [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(state.subscriptionTier);
      case Feature.COGNITIVE_ASSESSMENT:
        return state.subscriptionTier === SubscriptionTier.CARE_PLUS;
      case Feature.MEDICAL_REPORTS:
        return state.subscriptionTier === SubscriptionTier.CARE_PLUS;
      default:
        return true;
    }
  };

  useEffect(() => {
    initSubscription();
  }, []);

  return {
    ...state,
    checkSubscription,
    purchaseSubscription,
    restoreSubscription,
    refreshSubscriptionStatus,
    hasReachedStorageLimit,
    calculateStoragePercentage,
    calculateAIRequestsPercentage,
    calculateFamilyMembersPercentage,
    isFeatureAvailable,
  };
}