import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, BarChart2, Trophy } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  isNew: boolean;
  isRecommended: boolean;
  lastPlayed: string | null;
  progress: number;
  thumbnail: string | null;
}

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className = '' }: GameCardProps) {
  const { isMobile } = useDeviceDetection();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <TouchOptimized>
      <Link 
        to={`/games/${game.id}`}
        className={`block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${className}`}
      >
        <div className="relative">
          {/* Game Thumbnail or Icon */}
          <div className={`aspect-video ${game.color} flex items-center justify-center`}>
            {game.thumbnail ? (
              <img 
                src={game.thumbnail} 
                alt={game.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <game.icon className="w-12 h-12 text-white" />
            )}
            
            {/* Overlay for progress */}
            {game.progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-1 bg-green-500" 
                  style={{ width: `${game.progress}%` }}
                />
              </div>
            )}
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col space-y-1">
            {game.isNew && (
              <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                NEW
              </span>
            )}
            {game.isRecommended && (
              <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center">
                <Star className="w-3 h-3 mr-1" />
                <span>TOP PICK</span>
              </span>
            )}
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900">{game.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(game.difficulty)}`}>
              {game.difficulty}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {game.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            {game.lastPlayed ? (
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Played {game.lastPlayed}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <Trophy className="w-3 h-3" />
                <span>Not played yet</span>
              </div>
            )}
            
            {game.progress > 0 && (
              <div className="flex items-center space-x-1">
                <BarChart2 className="w-3 h-3" />
                <span>{game.progress}% complete</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </TouchOptimized>
  );
}