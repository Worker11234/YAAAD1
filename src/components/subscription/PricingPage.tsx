import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, Check, X, Sparkles, Shield, Loader2, ArrowLeft } from 'lucide-react';
import { 
  subscriptionPlans, 
  freeTier, 
  SubscriptionTier, 
  ProductId,
  SubscriptionPlan
} from '../../lib/revenuecat';
import { useSubscription } from '../../hooks/useSubscription';
import { PricingCard } from './PricingCard';
import { TouchOptimized } from '../ui/TouchOptimized';
import { formatCurrency } from '../../lib/utils';

export function PricingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { subscriptionTier, purchaseSubscription, isLoading, error } = useSubscription();
  
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  
  // Check if a specific plan was requested in the URL
  useEffect(() => {
    const planParam = searchParams.get('plan');
    if (planParam) {
      const matchingPlans = subscriptionPlans.filter(
        plan => plan.tier === planParam && plan.interval === billingInterval
      );
      
      if (matchingPlans.length > 0) {
        setSelectedPlan(matchingPlans[0]);
      }
    }
  }, [searchParams, billingInterval]);
  
  // Filter plans by billing interval
  const filteredPlans = subscriptionPlans.filter(plan => plan.interval === billingInterval);
  
  // Group plans by tier
  const plansByTier = filteredPlans.reduce((acc, plan) => {
    if (!acc[plan.tier]) {
      acc[plan.tier] = [];
    }
    acc[plan.tier].push(plan);
    return acc;
  }, {} as Record<string, SubscriptionPlan[]>);
  
  // Get one plan per tier
  const plansToDisplay = Object.values(plansByTier).map(plans => plans[0]);
  
  // Add free tier
  const allPlans = [
    { 
      ...freeTier, 
      id: 'free', 
      price: 0, 
      interval: billingInterval 
    } as SubscriptionPlan
  ].concat(plansToDisplay);
  
  // Handle plan selection
  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    
    // Scroll to the purchase section
    document.getElementById('purchase-section')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle purchase
  const handlePurchase = async () => {
    if (!selectedPlan || selectedPlan.tier === SubscriptionTier.FREE) return;
    
    setIsPurchasing(true);
    setPurchaseError(null);
    
    try {
      await purchaseSubscription(selectedPlan.id as ProductId);
      setPurchaseSuccess(true);
      
      // Redirect to dashboard after successful purchase
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Purchase error:', err);
      setPurchaseError(err.message || 'Failed to complete purchase');
    } finally {
      setIsPurchasing(false);
    }
  };
  
  // Calculate savings for yearly plans
  const calculateYearlySavings = (plan: SubscriptionPlan) => {
    if (plan.interval !== 'yearly') return 0;
    
    const monthlyPlan = subscriptionPlans.find(p => 
      p.tier === plan.tier && p.interval === 'monthly'
    );
    
    if (!monthlyPlan) return 0;
    
    return (monthlyPlan.price * 12) - plan.price;
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-sage-700 rounded-full mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 app-name">Yaadein Subscription Plans</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Choose the perfect plan for your family's memory preservation needs
        </p>
      </div>
      
      {/* Billing Interval Toggle */}
      <div className="flex justify-center mb-12">
        <div className="bg-gray-100 p-1 rounded-lg inline-flex">
          <TouchOptimized>
            <button
              onClick={() => setBillingInterval('monthly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setBillingInterval('yearly')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                billingInterval === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              Yearly
              <span className="ml-1 text-green-600 text-xs font-bold">Save 20%</span>
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {allPlans.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            currentTier={subscriptionTier}
            onSelect={handleSelectPlan}
            isLoading={isLoading}
          />
        ))}
      </div>
      
      {/* Feature Comparison */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-16">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Feature Comparison</h2>
          <p className="text-gray-600">Compare features across different subscription tiers</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Feature</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Free</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Family</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Premium</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Care+</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Storage</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">1 GB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">50 GB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">200 GB</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">500 GB</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Family Members</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">5</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">Unlimited</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">AI Requests/month</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">100</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">500</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">2,000</td>
                <td className="px-6 py-4 text-center text-sm text-gray-700">Unlimited</td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Memory Exports</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Healthcare API</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Advanced Analytics</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Cognitive Assessments</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">Medical Reports</td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <X className="w-5 h-5 text-red-600 mx-auto" />
                </td>
                <td className="px-6 py-4 text-center">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Purchase Section */}
      {selectedPlan && (
        <div id="purchase-section" className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-16">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-sage-700 p-3 rounded-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Complete Your Subscription</h2>
              <p className="text-gray-600">You're just one step away from unlocking premium features</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plan Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Plan Summary</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{selectedPlan.name}</span>
                  <span className="text-gray-900">{formatCurrency(selectedPlan.price)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Billed {selectedPlan.interval === 'monthly' ? 'monthly' : 'annually'}
                </div>
                
                {selectedPlan.interval === 'yearly' && (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-sm text-green-700">
                    You save {formatCurrency(calculateYearlySavings(selectedPlan))} with annual billing
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>{selectedPlan.storage} GB Storage</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>
                    {selectedPlan.familyMembers === 'unlimited' ? 'Unlimited' : selectedPlan.familyMembers} Family Members
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>
                    {selectedPlan.aiRequests === Infinity ? 'Unlimited' : selectedPlan.aiRequests} AI Requests/month
                  </span>
                </div>
                {selectedPlan.tier !== SubscriptionTier.FREE && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Memory Exports</span>
                  </div>
                )}
                {[SubscriptionTier.PREMIUM, SubscriptionTier.CARE_PLUS].includes(selectedPlan.tier as SubscriptionTier) && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Healthcare API</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Advanced Analytics</span>
                    </div>
                  </>
                )}
                {selectedPlan.tier === SubscriptionTier.CARE_PLUS && (
                  <>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Cognitive Assessments</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Medical Reports</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Purchase Form */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Purchase</h3>
              
              {/* Error Message */}
              {purchaseError && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-4">
                  <p className="font-medium">Purchase Failed</p>
                  <p className="text-sm">{purchaseError}</p>
                </div>
              )}
              
              {/* Success Message */}
              {purchaseSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-4">
                  <p className="font-medium">Purchase Successful!</p>
                  <p className="text-sm">Your subscription has been activated. Redirecting to dashboard...</p>
                </div>
              )}
              
              {/* Security Note */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">Secure Transaction</span>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment information is processed securely. We do not store your credit card details.
                </p>
              </div>
              
              {/* Purchase Button */}
              {selectedPlan.tier !== SubscriptionTier.FREE && (
                <TouchOptimized>
                  <button
                    onClick={handlePurchase}
                    disabled={isPurchasing || purchaseSuccess || isCurrentPlan}
                    className={`
                      w-full py-4 px-6 rounded-xl font-semibold text-center
                      ${isCurrentPlan 
                        ? 'bg-green-100 text-green-700 cursor-default' 
                        : 'bg-sage-700 text-white hover:bg-sage-800 transition-colors'}
                      ${isPurchasing ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {isPurchasing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      `Subscribe to ${selectedPlan.name} (${formatCurrency(selectedPlan.price)}/${selectedPlan.interval})`
                    )}
                  </button>
                </TouchOptimized>
              )}
              
              {/* Back Button */}
              <div className="mt-4 text-center">
                <TouchOptimized>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 inline mr-1" />
                    Back to plans
                  </button>
                </TouchOptimized>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
            <p className="text-gray-600">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How does billing work?</h3>
            <p className="text-gray-600">
              You'll be charged at the beginning of each billing cycle (monthly or yearly). You can cancel anytime.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What happens if I exceed my storage limit?</h3>
            <p className="text-gray-600">
              You'll be notified when you reach 90% of your storage limit. You can upgrade your plan or delete unused memories.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
            <p className="text-gray-600">
              We offer a 14-day money-back guarantee. If you're not satisfied, contact our support team for a full refund.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600">
              We accept all major credit cards, including Visa, Mastercard, American Express, and Discover.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
            <p className="text-gray-600">
              Yes, we use bank-level encryption to protect your data. Your memories are private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}