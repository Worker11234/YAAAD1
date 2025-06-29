import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { TouchOptimized } from './TouchOptimized';

interface TourStep {
  target: string;
  title: string;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface WelcomeTourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function WelcomeTour({
  steps,
  isOpen,
  onClose,
  onComplete,
}: WelcomeTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  
  // Find target element and calculate position
  useEffect(() => {
    if (!isOpen) return;
    
    const step = steps[currentStep];
    const element = document.querySelector(step.target) as HTMLElement;
    
    if (element) {
      setTargetElement(element);
      
      // Calculate position
      const rect = element.getBoundingClientRect();
      const position = step.position || 'bottom';
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = rect.top - 10 - 150; // 150px is the approximate height of the tooltip
          left = rect.left + rect.width / 2 - 150; // 150px is half the width of the tooltip
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2 - 150;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - 75;
          left = rect.left - 10 - 300; // 300px is the width of the tooltip
          break;
        case 'right':
          top = rect.top + rect.height / 2 - 75;
          left = rect.right + 10;
          break;
      }
      
      // Ensure the tooltip stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 20) left = 20;
      if (left + 300 > viewportWidth - 20) left = viewportWidth - 320;
      if (top < 20) top = 20;
      if (top + 150 > viewportHeight - 20) top = viewportHeight - 170;
      
      setTooltipPosition({ top, left });
      
      // Add highlight to target element
      element.classList.add('ring-4', 'ring-sage-500', 'ring-opacity-50', 'z-40');
      
      // Scroll element into view if needed
      if (
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom > viewportHeight ||
        rect.right > viewportWidth
      ) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
    
    return () => {
      // Remove highlight from previous target
      if (targetElement) {
        targetElement.classList.remove('ring-4', 'ring-sage-500', 'ring-opacity-50', 'z-40');
      }
    };
  }, [isOpen, currentStep, steps]);
  
  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  // Handle tour completion
  const handleComplete = () => {
    // Remove highlight from current target
    if (targetElement) {
      targetElement.classList.remove('ring-4', 'ring-sage-500', 'ring-opacity-50', 'z-40');
    }
    
    onComplete();
  };
  
  // Handle tour close
  const handleClose = () => {
    // Remove highlight from current target
    if (targetElement) {
      targetElement.classList.remove('ring-4', 'ring-sage-500', 'ring-opacity-50', 'z-40');
    }
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={handleClose} />
      
      {/* Tooltip */}
      <div
        className="fixed z-50 w-80 bg-white rounded-xl shadow-xl p-4 border border-sage-200"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
          <TouchOptimized>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </TouchOptimized>
        </div>
        
        <div className="text-gray-600 mb-4">
          {steps[currentStep].content}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`
                  w-2 h-2 rounded-full
                  ${index === currentStep ? 'bg-sage-600' : 'bg-gray-300'}
                `}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <TouchOptimized>
                <button
                  onClick={handlePrevious}
                  className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                >
                  <ChevronLeft size={18} />
                </button>
              </TouchOptimized>
            )}
            
            {currentStep < steps.length - 1 ? (
              <TouchOptimized>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-1 bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              </TouchOptimized>
            ) : (
              <TouchOptimized>
                <button
                  onClick={handleComplete}
                  className="flex items-center space-x-1 bg-sage-700 text-white px-3 py-2 rounded-lg hover:bg-sage-800"
                >
                  <CheckCircle size={18} />
                  <span>Finish</span>
                </button>
              </TouchOptimized>
            )}
          </div>
        </div>
      </div>
    </>
  );
}