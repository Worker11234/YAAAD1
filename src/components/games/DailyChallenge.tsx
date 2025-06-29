import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface Challenge {
  title: string;
  description: string;
  reward: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  expiresIn: string;
}

interface DailyChallengeProps {
  challenge: Challenge;
  className?: string;
}

export function DailyChallenge({ challenge, className = '' }: DailyChallengeProps) {
  return (
    <div className={`${challenge.color} rounded-2xl shadow-lg overflow-hidden ${className}`}>
      <div className="p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <challenge.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Daily Challenge</h2>
              <div className="flex items-center space-x-1 text-white text-opacity-90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Expires in {challenge.expiresIn}</span>
              </div>
            </div>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-sm font-semibold">+{challenge.reward} points</span>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
          <p className="text-white text-opacity-90">{challenge.description}</p>
        </div>
        
        <TouchOptimized>
          <Link 
            to="/games/daily-challenge" 
            className="inline-flex items-center space-x-2 bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            <span>Start Challenge</span>
            <ChevronRight size={18} />
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
}