import React from 'react';
import { Heart, SkipForward } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  onSkip?: () => void;
}

export function OnboardingProgress({ currentStep, totalSteps, onSkip }: OnboardingProgressProps) {
  const steps = [
    { number: 1, title: 'Personal Profile', description: 'Tell us about yourself' },
    { number: 2, title: 'Family Circle', description: 'Set up your family group' },
    { number: 3, title: 'First Memory', description: 'Upload your first memory' },
    { number: 4, title: 'Feature Tour', description: 'Discover what you can do' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-sage-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-sage-700 p-2 rounded-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-sage-800">Welcome to MemoryMesh</h1>
            <p className="text-sage-600">Let's get you started on your family memory journey</p>
          </div>
        </div>
        
        {onSkip && (
          <button
            onClick={onSkip}
            className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium transition-colors"
          >
            <SkipForward size={20} />
            <span>Skip Tour</span>
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-sage-600 to-sage-700 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`text-center p-3 rounded-xl transition-all duration-300 ${
              step.number === currentStep
                ? 'bg-sage-100 border-2 border-sage-300'
                : step.number < currentStep
                ? 'bg-sage-50 border border-sage-200'
                : 'bg-gray-50 border border-gray-200'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-bold ${
                step.number === currentStep
                  ? 'bg-sage-700 text-white'
                  : step.number < currentStep
                  ? 'bg-sage-500 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}
            >
              {step.number}
            </div>
            <h3 className={`text-sm font-semibold mb-1 ${
              step.number <= currentStep ? 'text-gray-900' : 'text-gray-500'
            }`}>
              {step.title}
            </h3>
            <p className={`text-xs ${
              step.number <= currentStep ? 'text-gray-600' : 'text-gray-400'
            }`}>
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}