import React, { useState } from 'react';
import { PersonalProfileStep } from './steps/PersonalProfileStep';
import { FamilyCircleStep } from './steps/FamilyCircleStep';
import { FirstMemoryStep } from './steps/FirstMemoryStep';
import { FeatureTourStep } from './steps/FeatureTourStep';
import { OnboardingProgress } from './OnboardingProgress';
import { useAuth } from '../../hooks/useAuth';

export interface OnboardingData {
  profile: {
    name: string;
    age: string;
    relationship: string;
    language: string;
    timezone: string;
    accessibilityNeeds: string[];
    profilePhoto?: string;
  };
  family: {
    action: 'create' | 'join';
    familyName?: string;
    joinCode?: string;
    invitations: string[];
    privacyLevel: 'private' | 'family-only' | 'extended';
  };
  firstMemory?: {
    file?: File;
    title: string;
    description: string;
    tags: string[];
  };
  tourCompleted: boolean;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    profile: {
      name: '',
      age: '',
      relationship: '',
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      accessibilityNeeds: [],
    },
    family: {
      action: 'create',
      invitations: [],
      privacyLevel: 'family-only',
    },
    tourCompleted: false,
  });

  const { user } = useAuth();
  const totalSteps = 4;

  const updateData = (stepData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(data);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipToEnd = () => {
    onComplete({ ...data, tourCompleted: true });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalProfileStep
            data={data.profile}
            onUpdate={(profile) => updateData({ profile })}
            onNext={nextStep}
            userEmail={user?.email || ''}
          />
        );
      case 2:
        return (
          <FamilyCircleStep
            data={data.family}
            onUpdate={(family) => updateData({ family })}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <FirstMemoryStep
            data={data.firstMemory}
            onUpdate={(firstMemory) => updateData({ firstMemory })}
            onNext={nextStep}
            onBack={prevStep}
            onSkip={nextStep}
          />
        );
      case 4:
        return (
          <FeatureTourStep
            onComplete={() => {
              updateData({ tourCompleted: true });
              onComplete({ ...data, tourCompleted: true });
            }}
            onBack={prevStep}
            onSkip={skipToEnd}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <OnboardingProgress 
          currentStep={currentStep} 
          totalSteps={totalSteps}
          onSkip={currentStep === 4 ? skipToEnd : undefined}
        />
        
        <div className="mt-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}