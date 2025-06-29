import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, ArrowLeft } from 'lucide-react';
import { SubscriptionDashboard } from '../components/subscription/SubscriptionDashboard';

export function SubscriptionDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/settings" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Settings</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Subscription Management</h1>
            <p className="text-lg text-gray-600">
              Manage your subscription and usage
            </p>
          </div>
        </div>
      </div>
      
      {/* Subscription Dashboard */}
      <SubscriptionDashboard />
    </div>
  );
}