import React from 'react';
import { Check, X } from 'lucide-react';
import { SubscriptionPlan, SubscriptionTier } from '../../lib/revenuecat';
import { formatCurrency } from '../../lib/utils';
import { TouchOptimized } from '../ui/TouchOptimized';

interface PricingCardProps {
  /**
   * The subscription plan to display
   */
  plan: SubscriptionPlan;
  
  /**
   * The current subscription tier
   */
  currentTier: SubscriptionTier;
  
  /**
   * Function to call when the user selects this plan
   */
  onSelect: (plan: SubscriptionPlan) => void;
  
  /**
   * Whether the card is in a loading state
   */
  isLoading?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function PricingCard({
  plan,
  currentTier,
  onSelect,
  isLoading = false,
  className = ''
}: PricingCardProps) {
  const isCurrentPlan = currentTier === plan.tier && 
    (plan.interval === 'monthly' || currentTier === SubscriptionTier.FREE);
  
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-lg border overflow-hidden transition-all duration-300
        ${plan.popular ? 'border-purple-300 scale-105 shadow-xl' : 'border-gray-200 hover:shadow-xl'}
        ${isCurrentPlan ? 'ring-2 ring-sage-500' : ''}
        ${className}
      `}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-1 font-medium text-sm">
          Most Popular
        </div>
      )}
      
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-gray-600 mb-4">{plan.description}</p>
        
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-gray-900">{formatCurrency(plan.price)}</span>
          <span className="text-gray-600 ml-1">/{plan.interval}</span>
        </div>
        
        {plan.interval === 'yearly' && (
          <p className="text-green-600 text-sm mt-1">
            Save {formatCurrency(plan.price / 12 * 2)} per year
          </p>
        )}
      </div>
      
      {/* Features */}
      <div className="p-6">
        <ul className="space-y-4">
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">{plan.storage} GB Storage</span>
          </li>
          
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">
              {plan.familyMembers === 'unlimited' ? 'Unlimited' : plan.familyMembers} Family Members
            </span>
          </li>
          
          <li className="flex items-center space-x-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-gray-700">
              {plan.aiRequests === Infinity ? 'Unlimited' : plan.aiRequests} AI Requests/month
            </span>
          </li>
          
          <li className="flex items-center space-x-3">
            {plan.features.includes('memory_export') ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-gray-700">Memory Exports</span>
          </li>
          
          <li className="flex items-center space-x-3">
            {plan.features.includes('healthcare_api') ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-gray-700">Healthcare API</span>
          </li>
          
          <li className="flex items-center space-x-3">
            {plan.features.includes('advanced_analytics') ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-gray-700">Advanced Analytics</span>
          </li>
          
          <li className="flex items-center space-x-3">
            {plan.features.includes('cognitive_assessment') ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-gray-700">Cognitive Assessments</span>
          </li>
          
          <li className="flex items-center space-x-3">
            {plan.features.includes('medical_reports') ? (
              <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-600 flex-shrink-0" />
            )}
            <span className="text-gray-700">Medical Reports</span>
          </li>
        </ul>
      </div>
      
      {/* CTA */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <TouchOptimized>
          <button
            onClick={() => onSelect(plan)}
            disabled={isLoading || isCurrentPlan}
            className={`
              w-full py-3 px-4 rounded-lg font-medium text-center
              ${isCurrentPlan 
                ? 'bg-green-100 text-green-700 cursor-default' 
                : 'bg-sage-700 text-white hover:bg-sage-800 transition-colors'}
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            {isLoading 
              ? 'Processing...' 
              : isCurrentPlan 
              ? 'Current Plan' 
              : `Subscribe ${plan.interval === 'yearly' ? 'Yearly' : 'Monthly'}`}
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
}