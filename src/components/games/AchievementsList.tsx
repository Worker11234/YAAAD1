import React from 'react';
import { Award, Star, Calendar, Clock, Trophy } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  earned: boolean;
  date?: string;
  progress?: number;
  total?: number;
}

interface AchievementsListProps {
  achievements: Achievement[];
  compact?: boolean;
}

export function AchievementsList({ achievements, compact = false }: AchievementsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-3">
      {achievements.map(achievement => (
        <TouchOptimized key={achievement.id}>
          <div 
            className={`
              rounded-lg border transition-all
              ${achievement.earned 
                ? 'bg-white border-yellow-200' 
                : 'bg-gray-50 border-gray-200'
              }
              ${compact ? 'p-3' : 'p-4'}
            `}
          >
            <div className="flex items-center space-x-3">
              <div className={`${achievement.color} p-2 rounded-lg`}>
                <achievement.icon className="w-5 h-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${compact ? 'text-sm' : 'text-base'} text-gray-900`}>
                    {achievement.title}
                  </h3>
                  {achievement.earned && (
                    <div className="bg-yellow-100 px-2 py-1 rounded-full flex items-center space-x-1">
                      <Star size={12} className="text-yellow-600 fill-current" />
                      <span className="text-xs font-medium text-yellow-700">Earned</span>
                    </div>
                  )}
                </div>
                
                <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mt-1`}>
                  {achievement.description}
                </p>
                
                {achievement.earned && achievement.date && (
                  <p className="text-xs text-gray-500 mt-1">
                    Earned on {formatDate(achievement.date)}
                  </p>
                )}
                
                {!achievement.earned && achievement.progress !== undefined && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-purple-600">
                        {achievement.progress} / {achievement.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-600 h-1.5 rounded-full"
                        style={{ width: `${(achievement.progress / achievement.total!) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TouchOptimized>
      ))}
    </div>
  );
}