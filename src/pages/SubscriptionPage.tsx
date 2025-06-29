import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';
import { PricingPage } from '../components/subscription/PricingPage';

export function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-sage-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link 
          to="/settings" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Settings</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Plans</h1>
            <p className="text-lg text-gray-600">
              Choose the perfect plan for your family's memory preservation needs
            </p>
          </div>
        </div>
      </div>
      
      {/* Pricing Page Component */}
      <PricingPage />
    </div>
  );
}