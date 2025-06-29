import React from 'react';
import { colors, typography, spacing, borderRadius, shadows } from '../tokens';

interface GameQuestionCardProps {
  /**
   * Question text
   */
  question: string;
  
  /**
   * Question image URL (optional)
   */
  imageUrl?: string;
  
  /**
   * Answer options
   */
  options: string[];
  
  /**
   * Selected answer index
   */
  selectedAnswer?: number;
  
  /**
   * Correct answer index
   */
  correctAnswer?: number;
  
  /**
   * Whether to show the correct answer
   */
  showAnswer?: boolean;
  
  /**
   * Function to call when an option is selected
   */
  onSelectOption?: (index: number) => void;
  
  /**
   * Time remaining in seconds
   */
  timeRemaining?: number;
  
  /**
   * Question hint
   */
  hint?: string;
  
  /**
   * Whether to show the hint
   */
  showHint?: boolean;
  
  /**
   * Function to call when the hint button is clicked
   */
  onShowHint?: () => void;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function GameQuestionCard({
  question,
  imageUrl,
  options,
  selectedAnswer,
  correctAnswer,
  showAnswer = false,
  onSelectOption,
  timeRemaining,
  hint,
  showHint = false,
  onShowHint,
  className = '',
  ...props
}: GameQuestionCardProps) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-md overflow-hidden border border-gray-200
        ${className}
      `}
      {...props}
    >
      {/* Header */}
      {timeRemaining !== undefined && (
        <div className="bg-sage-50 p-3 border-b border-sage-100 flex items-center justify-between">
          <div className="text-sm font-medium text-sage-700">Time Remaining</div>
          <div className={`text-lg font-bold ${timeRemaining <= 10 ? 'text-red-600' : 'text-sage-700'}`}>
            {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
          </div>
        </div>
      )}
      
      {/* Question */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{question}</h3>
        
        {/* Image */}
        {imageUrl && (
          <div className="mb-6">
            <img
              src={imageUrl}
              alt="Question"
              className="w-full max-h-80 object-contain rounded-lg"
            />
          </div>
        )}
        
        {/* Hint */}
        {hint && showHint && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2 text-yellow-800">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Hint:</span>
            </div>
            <p className="mt-1 text-yellow-700">{hint}</p>
          </div>
        )}
        
        {/* Options */}
        <div className="space-y-3">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectOption && onSelectOption(index)}
              disabled={selectedAnswer !== undefined || !onSelectOption}
              className={`
                w-full p-4 rounded-xl border-2 text-left transition-colors
                ${selectedAnswer === index
                  ? showAnswer
                    ? index === correctAnswer
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-sage-500 bg-sage-50 text-sage-700'
                  : showAnswer && index === correctAnswer
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-sage-300 text-gray-700'}
                ${selectedAnswer !== undefined ? 'cursor-default' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showAnswer && index === correctAnswer && (
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showAnswer && selectedAnswer === index && index !== correctAnswer && (
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {/* Hint Button */}
        {hint && !showHint && onShowHint && (
          <button
            onClick={onShowHint}
            className="mt-4 text-yellow-600 hover:text-yellow-700 text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Show Hint
          </button>
        )}
      </div>
    </div>
  );
}