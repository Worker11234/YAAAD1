import React, { useState } from 'react';
import { Calendar, Users, Search, Gamepad2, Camera, Shield, ChevronLeft, ChevronRight, SkipBack as Skip, Sparkles, Heart, ArrowRight, CheckCircle } from 'lucide-react';
import { TouchOptimized } from '../../ui/TouchOptimized';

interface FeatureTourStepProps {
  onComplete: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function FeatureTourStep({ onComplete, onBack, onSkip }: FeatureTourStepProps) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Calendar,
      title: 'Memory Timeline',
      description: 'View all your family memories organized by date. Scroll through years of precious moments and watch your family story unfold.',
      benefits: [
        'Chronological organization',
        'Easy browsing by date',
        'Beautiful visual timeline',
        'Quick memory access'
      ],
      color: 'bg-blue-600'
    },
    {
      icon: Users,
      title: 'Family Collaboration',
      description: 'Invite family members to contribute memories. Everyone can add photos, videos, and stories to build your collective family history.',
      benefits: [
        'Multiple contributors',
        'Shared family albums',
        'Real-time updates',
        'Family notifications'
      ],
      color: 'bg-green-600'
    },
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find any memory instantly with our intelligent search. Search by people, places, dates, or even what\'s happening in photos.',
      benefits: [
        'AI-powered recognition',
        'Tag-based searching',
        'Date range filters',
        'Instant results'
      ],
      color: 'bg-purple-600'
    },
    {
      icon: Gamepad2,
      title: 'Memory Games',
      description: 'Engaging activities designed to help with memory recall and cognitive wellness. Perfect for family bonding and brain health.',
      benefits: [
        'Cognitive exercises',
        'Family photo games',
        'Memory challenges',
        'Progress tracking'
      ],
      color: 'bg-orange-600'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your family memories are protected with bank-level security. Control who sees what with granular privacy settings.',
      benefits: [
        'End-to-end encryption',
        'Privacy controls',
        'Secure cloud storage',
        'Family-only access'
      ],
      color: 'bg-red-600'
    }
  ];

  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(prev => prev + 1);
    }
  };

  const prevFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(prev => prev - 1);
    }
  };

  const feature = features[currentFeature];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-sage-100">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Discover MemoryMesh Features</h2>
            <p className="text-lg text-gray-600">Learn how to make the most of your family memory platform</p>
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Left Column - Feature Details */}
        <div className="space-y-6">
          <div className={`${feature.color} p-6 rounded-2xl text-white`}>
            <div className="flex items-center space-x-3 mb-4">
              <feature.icon className="w-8 h-8" />
              <h3 className="text-2xl font-bold">{feature.title}</h3>
            </div>
            <p className="text-lg opacity-90 leading-relaxed">
              {feature.description}
            </p>
          </div>

          <div className="bg-sage-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Key Benefits:</h4>
            <div className="space-y-3">
              {feature.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-sage-600 flex-shrink-0" />
                  <span className="text-base text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Visual Demo */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center">
          <div className="text-center">
            <div className={`${feature.color} p-8 rounded-full mb-6 mx-auto w-32 h-32 flex items-center justify-center`}>
              <feature.icon className="w-16 h-16 text-white" />
            </div>
            <h4 className="text-xl font-semibold text-gray-800 mb-2">
              {feature.title} Demo
            </h4>
            <p className="text-gray-600">
              Interactive demo coming soon
            </p>
          </div>
        </div>
      </div>

      {/* Feature Navigation */}
      <div className="mb-8">
        <div className="flex justify-center space-x-2 mb-4">
          {features.map((_, index) => (
            <TouchOptimized key={index}>
              <button
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentFeature 
                    ? 'bg-sage-700' 
                    : 'bg-gray-300 hover:bg-sage-400'
                }`}
              />
            </TouchOptimized>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <TouchOptimized>
            <button
              onClick={prevFeature}
              disabled={currentFeature === 0}
              className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
              <span>Previous</span>
            </button>
          </TouchOptimized>

          <span className="text-base text-gray-600">
            {currentFeature + 1} of {features.length}
          </span>

          <TouchOptimized>
            <button
              onClick={nextFeature}
              disabled={currentFeature === features.length - 1}
              className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>

      {/* Completion Message */}
      <div className="bg-gradient-to-r from-sage-700 to-sage-600 rounded-xl p-6 text-white mb-8">
        <div className="flex items-center space-x-3 mb-3">
          <Heart className="w-6 h-6" />
          <h3 className="text-xl font-semibold">You're All Set!</h3>
        </div>
        <p className="text-sage-100 text-lg leading-relaxed">
          Congratulations! You've completed the MemoryMesh onboarding. 
          Your family memory journey starts now. Remember, every memory you add 
          helps preserve your family's story for future generations.
        </p>
      </div>

      {/* Final Navigation */}
      <div className="flex justify-between">
        <TouchOptimized>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-semibold transition-colors"
          >
            <ChevronLeft size={20} />
            <span>Back</span>
          </button>
        </TouchOptimized>

        <div className="flex space-x-4">
          <TouchOptimized>
            <button
              onClick={onSkip}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-700 font-semibold transition-colors"
            >
              <Skip size={20} />
              <span>Skip Tour</span>
            </button>
          </TouchOptimized>

          <TouchOptimized>
            <button
              onClick={onComplete}
              className="flex items-center space-x-2 bg-sage-700 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-sage-800 focus:outline-none focus:ring-4 focus:ring-sage-300 transition-all duration-200 min-h-[56px]"
            >
              <span>Start Using MemoryMesh</span>
              <ArrowRight size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}