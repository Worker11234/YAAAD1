import Purchases, { CustomerInfo, PurchasesConfiguration } from '@revenuecat/purchases-js';

// Subscription tiers
export enum SubscriptionTier {
  FREE = 'free',
  FAMILY = 'family',
  PREMIUM = 'premium',
  CARE_PLUS = 'careplus'
}

// Feature flags
export enum Feature {
  STORAGE_BASIC = 'storage_basic',           // 1GB storage
  STORAGE_FAMILY = 'storage_family',         // 50GB storage
  STORAGE_PREMIUM = 'storage_premium',       // 200GB storage
  STORAGE_CAREPLUS = 'storage_careplus',     // 500GB storage
  
  FAMILY_BASIC = 'family_basic',             // 5 family members
  FAMILY_UNLIMITED = 'family_unlimited',     // Unlimited family members
  
  AI_BASIC = 'ai_basic',                     // 100 AI requests/month
  AI_FAMILY = 'ai_family',                   // 500 AI requests/month
  AI_PREMIUM = 'ai_premium',                 // 2000 AI requests/month
  AI_UNLIMITED = 'ai_unlimited',             // Unlimited AI requests
  
  MEMORY_EXPORT = 'memory_export',           // Memory exports
  HEALTHCARE_API = 'healthcare_api',         // Healthcare API
  ADVANCED_ANALYTICS = 'advanced_analytics', // Advanced analytics
  COGNITIVE_ASSESSMENT = 'cognitive_assessment', // Cognitive assessments
  MEDICAL_REPORTS = 'medical_reports'        // Medical reports
}

// Product IDs
export enum ProductId {
  FAMILY_MONTHLY = 'yaadein_family_monthly',
  FAMILY_YEARLY = 'yaadein_family_yearly',
  PREMIUM_MONTHLY = 'yaadein_premium_monthly',
  PREMIUM_YEARLY = 'yaadein_premium_yearly',
  CAREPLUS_MONTHLY = 'yaadein_careplus_monthly',
  CAREPLUS_YEARLY = 'yaadein_careplus_yearly'
}

// Subscription plan details
export interface SubscriptionPlan {
  id: ProductId;
  tier: SubscriptionTier;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'yearly';
  features: Feature[];
  storage: number; // in GB
  aiRequests: number;
  familyMembers: number | 'unlimited';
  popular?: boolean;
}

// Subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: ProductId.FAMILY_MONTHLY,
    tier: SubscriptionTier.FAMILY,
    name: 'Family',
    description: 'Perfect for families preserving memories together',
    price: 9.99,
    interval: 'monthly',
    features: [
      Feature.STORAGE_FAMILY,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_FAMILY,
      Feature.MEMORY_EXPORT
    ],
    storage: 50,
    aiRequests: 500,
    familyMembers: 'unlimited'
  },
  {
    id: ProductId.FAMILY_YEARLY,
    tier: SubscriptionTier.FAMILY,
    name: 'Family (Yearly)',
    description: 'Perfect for families preserving memories together',
    price: 99.99,
    interval: 'yearly',
    features: [
      Feature.STORAGE_FAMILY,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_FAMILY,
      Feature.MEMORY_EXPORT
    ],
    storage: 50,
    aiRequests: 500,
    familyMembers: 'unlimited'
  },
  {
    id: ProductId.PREMIUM_MONTHLY,
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium',
    description: 'Advanced features for comprehensive memory preservation',
    price: 19.99,
    interval: 'monthly',
    features: [
      Feature.STORAGE_PREMIUM,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_PREMIUM,
      Feature.MEMORY_EXPORT,
      Feature.HEALTHCARE_API,
      Feature.ADVANCED_ANALYTICS
    ],
    storage: 200,
    aiRequests: 2000,
    familyMembers: 'unlimited',
    popular: true
  },
  {
    id: ProductId.PREMIUM_YEARLY,
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium (Yearly)',
    description: 'Advanced features for comprehensive memory preservation',
    price: 199.99,
    interval: 'yearly',
    features: [
      Feature.STORAGE_PREMIUM,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_PREMIUM,
      Feature.MEMORY_EXPORT,
      Feature.HEALTHCARE_API,
      Feature.ADVANCED_ANALYTICS
    ],
    storage: 200,
    aiRequests: 2000,
    familyMembers: 'unlimited',
    popular: true
  },
  {
    id: ProductId.CAREPLUS_MONTHLY,
    tier: SubscriptionTier.CARE_PLUS,
    name: 'Care+',
    description: 'Complete solution with healthcare integration',
    price: 39.99,
    interval: 'monthly',
    features: [
      Feature.STORAGE_CAREPLUS,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_UNLIMITED,
      Feature.MEMORY_EXPORT,
      Feature.HEALTHCARE_API,
      Feature.ADVANCED_ANALYTICS,
      Feature.COGNITIVE_ASSESSMENT,
      Feature.MEDICAL_REPORTS
    ],
    storage: 500,
    aiRequests: Infinity,
    familyMembers: 'unlimited'
  },
  {
    id: ProductId.CAREPLUS_YEARLY,
    tier: SubscriptionTier.CARE_PLUS,
    name: 'Care+ (Yearly)',
    description: 'Complete solution with healthcare integration',
    price: 399.99,
    interval: 'yearly',
    features: [
      Feature.STORAGE_CAREPLUS,
      Feature.FAMILY_UNLIMITED,
      Feature.AI_UNLIMITED,
      Feature.MEMORY_EXPORT,
      Feature.HEALTHCARE_API,
      Feature.ADVANCED_ANALYTICS,
      Feature.COGNITIVE_ASSESSMENT,
      Feature.MEDICAL_REPORTS
    ],
    storage: 500,
    aiRequests: Infinity,
    familyMembers: 'unlimited'
  }
];

// Free tier details
export const freeTier: Omit<SubscriptionPlan, 'id' | 'price' | 'interval'> = {
  tier: SubscriptionTier.FREE,
  name: 'Free',
  description: 'Basic features for personal use',
  features: [
    Feature.STORAGE_BASIC,
    Feature.FAMILY_BASIC,
    Feature.AI_BASIC
  ],
  storage: 1,
  aiRequests: 100,
  familyMembers: 5
};

// Feature details
export interface FeatureDetail {
  feature: Feature;
  name: string;
  description: string;
  tiers: SubscriptionTier[];
}

export const featureDetails: FeatureDetail[] = [
  {
    feature: Feature.STORAGE_BASIC,
    name: '1GB Storage',
    description: 'Basic storage for personal memories',
    tiers: [SubscriptionTier.FREE]
  },
  {
    feature: Feature.STORAGE_FAMILY,
    name: '50GB Storage',
    description: 'Ample storage for family memories',
    tiers: [SubscriptionTier.FAMILY]
  },
  {
    feature: Feature.STORAGE_PREMIUM,
    name: '200GB Storage',
    description: 'Extensive storage for all your memories',
    tiers: [SubscriptionTier.PREMIUM]
  },
  {
    feature: Feature.STORAGE_CAREPLUS,
    name: '500GB Storage',
    description: 'Maximum storage for comprehensive memory preservation',
    tiers: [SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.FAMILY_BASIC,
    name: '5 Family Members',
    description: 'Connect with your immediate family',
    tiers: [SubscriptionTier.FREE]
  },
  {
    feature: Feature.FAMILY_UNLIMITED,
    name: 'Unlimited Family Members',
    description: 'Connect with your entire extended family',
    tiers: [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.AI_BASIC,
    name: '100 AI Requests/Month',
    description: 'Basic AI-powered memory organization',
    tiers: [SubscriptionTier.FREE]
  },
  {
    feature: Feature.AI_FAMILY,
    name: '500 AI Requests/Month',
    description: 'Enhanced AI-powered memory organization',
    tiers: [SubscriptionTier.FAMILY]
  },
  {
    feature: Feature.AI_PREMIUM,
    name: '2000 AI Requests/Month',
    description: 'Advanced AI-powered memory organization',
    tiers: [SubscriptionTier.PREMIUM]
  },
  {
    feature: Feature.AI_UNLIMITED,
    name: 'Unlimited AI Requests',
    description: 'Unlimited AI-powered memory organization',
    tiers: [SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.MEMORY_EXPORT,
    name: 'Memory Exports',
    description: 'Export memories as books, albums, and more',
    tiers: [SubscriptionTier.FAMILY, SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.HEALTHCARE_API,
    name: 'Healthcare API',
    description: 'Integration with healthcare providers',
    tiers: [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.ADVANCED_ANALYTICS,
    name: 'Advanced Analytics',
    description: 'Detailed insights into memory patterns',
    tiers: [SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.COGNITIVE_ASSESSMENT,
    name: 'Cognitive Assessments',
    description: 'Track cognitive health over time',
    tiers: [SubscriptionTier.CARE_PLUS]
  },
  {
    feature: Feature.MEDICAL_REPORTS,
    name: 'Medical Reports',
    description: 'Generate reports for healthcare providers',
    tiers: [SubscriptionTier.CARE_PLUS]
  }
];

// RevenueCat initialization
let isInitialized = false;

export const initializeRevenueCat = (): boolean => {
  if (isInitialized) return true;
  
  const revenueCatKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
  
  if (!revenueCatKey) {
    console.error('RevenueCat public key is not defined');
    return false;
  }
  
  try {
    const configuration: PurchasesConfiguration = {
      apiKey: revenueCatKey,
      appUserID: null, // Will be set after authentication
    };
    
    Purchases.configure(configuration);
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    return false;
  }
};

// Set user ID after authentication
export const identifyUser = (userId: string): Promise<void> => {
  if (!isInitialized) {
    if (!initializeRevenueCat()) {
      return Promise.reject(new Error('RevenueCat not initialized'));
    }
  }
  
  return Purchases.logIn(userId)
    .then(() => {
      console.log('User identified with RevenueCat');
    })
    .catch(error => {
      console.error('Failed to identify user with RevenueCat:', error);
      throw error;
    });
};

// Get customer info
export const getCustomerInfo = (): Promise<CustomerInfo> => {
  if (!isInitialized) {
    if (!initializeRevenueCat()) {
      return Promise.reject(new Error('RevenueCat not initialized'));
    }
  }
  
  return Purchases.getCustomerInfo();
};

// Purchase a product
export const purchaseProduct = async (productId: ProductId): Promise<CustomerInfo> => {
  if (!isInitialized) {
    if (!initializeRevenueCat()) {
      return Promise.reject(new Error('RevenueCat not initialized'));
    }
  }
  
  try {
    const offerings = await Purchases.getOfferings();
    const offering = offerings.current;
    
    if (!offering) {
      throw new Error('No offerings available');
    }
    
    const package_ = offering.availablePackages.find(p => p.identifier === productId);
    
    if (!package_) {
      throw new Error(`Package ${productId} not found`);
    }
    
    const { customerInfo } = await Purchases.purchasePackage(package_);
    return customerInfo;
  } catch (error) {
    console.error('Failed to purchase product:', error);
    throw error;
  }
};

// Restore purchases
export const restorePurchases = (): Promise<CustomerInfo> => {
  if (!isInitialized) {
    if (!initializeRevenueCat()) {
      return Promise.reject(new Error('RevenueCat not initialized'));
    }
  }
  
  return Purchases.restorePurchases();
};

// Get current subscription tier
export const getCurrentSubscriptionTier = async (): Promise<SubscriptionTier> => {
  try {
    const customerInfo = await getCustomerInfo();
    
    // Check for active subscriptions
    const entitlements = customerInfo.entitlements.active;
    
    if (entitlements.careplus) {
      return SubscriptionTier.CARE_PLUS;
    } else if (entitlements.premium) {
      return SubscriptionTier.PREMIUM;
    } else if (entitlements.family) {
      return SubscriptionTier.FAMILY;
    } else {
      return SubscriptionTier.FREE;
    }
  } catch (error) {
    console.error('Failed to get subscription tier:', error);
    return SubscriptionTier.FREE; // Default to free tier on error
  }
};

// Check if a feature is available for the current subscription
export const isFeatureAvailable = async (feature: Feature): Promise<boolean> => {
  const tier = await getCurrentSubscriptionTier();
  const featureDetail = featureDetails.find(f => f.feature === feature);
  
  if (!featureDetail) return false;
  
  return featureDetail.tiers.includes(tier);
};

// Get usage limits for the current subscription
export const getUsageLimits = async (): Promise<{
  storage: number;
  aiRequests: number;
  familyMembers: number | 'unlimited';
}> => {
  const tier = await getCurrentSubscriptionTier();
  
  switch (tier) {
    case SubscriptionTier.CARE_PLUS:
      return {
        storage: 500,
        aiRequests: Infinity,
        familyMembers: 'unlimited'
      };
    case SubscriptionTier.PREMIUM:
      return {
        storage: 200,
        aiRequests: 2000,
        familyMembers: 'unlimited'
      };
    case SubscriptionTier.FAMILY:
      return {
        storage: 50,
        aiRequests: 500,
        familyMembers: 'unlimited'
      };
    case SubscriptionTier.FREE:
    default:
      return {
        storage: 1,
        aiRequests: 100,
        familyMembers: 5
      };
  }
};