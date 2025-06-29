import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Award, Clock, Calendar, BarChart2, 
  Settings, Share2, Star, Users, Brain, Info, ChevronRight,
  Zap, TrendingUp, Heart
} from 'lucide-react';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { GameProgressChart } from '../components/games/GameProgressChart';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function GameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const { isMobile } = useDeviceDetection();
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  
  // Mock game data - in a real app, this would be fetched based on gameId
  const game = {
    id: gameId || 'photo-recognition',
    title: 'Who is This?',
    description: 'Test your ability to recognize family members in photos. This game helps strengthen facial recognition and associative memory by showing photos of your family members and asking you to identify them.',
    category: 'recognition',
    icon: User,
    color: 'bg-blue-600',
    lastPlayed: '2024-12-20',
    progress: 72,
    highScore: 85,
    totalPlays: 24,
    averageScore: 76,
    timeSpent: '3h 45m',
    benefits: [
      'Improves facial recognition',
      'Strengthens associative memory',
      'Helps maintain family connections',
      'Personalizes cognitive training'
    ],
    difficultyLevels: {
      easy: 'Shows clear, recent photos with name hints',
      medium: 'Uses various photos without hints',
      hard: 'Includes childhood photos and partial faces'
    },
    recentScores: [
      { date: '2024-12-14', score: 65 },
      { date: '2024-12-15', score: 70 },
      { date: '2024-12-16', score: 68 },
      { date: '2024-12-17', score: 75 },
      { date: '2024-12-18', score: 72 },
      { date: '2024-12-19', score: 80 },
      { date: '2024-12-20', score: 85 }
    ],
    relatedGames: [
      { id: 'face-matching', title: 'Match the Faces', category: 'recognition' },
      { id: 'family-trivia', title: 'Family Trivia', category: 'family' }
    ]
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/games" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Games</span>
        </Link>
        
        <div className={`${game.color} rounded-xl p-6 text-white`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <game.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{game.title}</h1>
              <div className="flex items-center space-x-2 text-white text-opacity-90">
                <span>Recognition Game</span>
                <span>•</span>
                <span>{game.totalPlays} plays</span>
              </div>
            </div>
          </div>
          
          <p className="text-white text-opacity-90 mb-6">{game.description}</p>
          
          <div className="flex flex-wrap gap-4">
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors">
                <Play size={20} />
                <span>Play Now</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-3 rounded-xl font-medium hover:bg-opacity-30 transition-colors">
                <Settings size={18} />
                <span>Options</span>
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-4 py-3 rounded-xl font-medium hover:bg-opacity-30 transition-colors">
                <Share2 size={18} />
                <span>Share</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left and Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Stats */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Game Statistics</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{game.highScore}%</div>
                <div className="text-xs text-gray-600">High Score</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{game.averageScore}%</div>
                <div className="text-xs text-gray-600">Average Score</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{game.totalPlays}</div>
                <div className="text-xs text-gray-600">Total Plays</div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">{game.timeSpent}</div>
                <div className="text-xs text-gray-600">Time Spent</div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Recent Performance</h3>
              <GameProgressChart data={game.recentScores} height={180} />
            </div>
          </div>

          {/* Difficulty Selector */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Difficulty Level</h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <Brain size={16} />
                <span className="text-sm">Adjusts game complexity</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {(['easy', 'medium', 'hard'] as const).map(difficulty => (
                <TouchOptimized key={difficulty}>
                  <button
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-center
                      ${selectedDifficulty === difficulty
                        ? `border-${difficulty === 'easy' ? 'green' : difficulty === 'medium' ? 'yellow' : 'red'}-500 ${getDifficultyColor(difficulty)}`
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="font-semibold text-gray-900 mb-1">
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </div>
                    <p className="text-xs text-gray-600">
                      {game.difficultyLevels[difficulty]}
                    </p>
                  </button>
                </TouchOptimized>
              ))}
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-purple-800 font-medium mb-1">Adaptive Difficulty</p>
                  <p className="text-xs text-purple-700">
                    This game automatically adjusts to your performance over time, 
                    ensuring the right balance of challenge and success.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cognitive Benefits */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">Cognitive Benefits</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {game.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Zap className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Games */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Related Games</h2>
              <Link to="/games" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {game.relatedGames.map(relatedGame => (
                <TouchOptimized key={relatedGame.id}>
                  <Link 
                    to={`/games/${relatedGame.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-lg">
                        <Play className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{relatedGame.title}</h3>
                        <p className="text-xs text-gray-600">{relatedGame.category} game</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                </TouchOptimized>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Play History */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-bold text-gray-900">Play History</h2>
            </div>
            
            <div className="space-y-3">
              {game.recentScores.slice(-3).reverse().map((score, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(score.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${
                      score.score >= 80 ? 'text-green-600' : 
                      score.score >= 60 ? 'text-yellow-600' : 
                      'text-orange-600'
                    }`}>
                      {score.score}%
                    </span>
                    {index === 0 && (
                      <div className="bg-purple-100 px-2 py-0.5 rounded-full">
                        <span className="text-xs font-medium text-purple-700">Latest</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <Link 
              to={`/games/${gameId}/history`}
              className="flex items-center justify-center space-x-1 text-purple-600 hover:text-purple-700 font-medium mt-4 text-sm"
            >
              <span>View Full History</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <Award className="w-5 h-5 text-yellow-600" />
              <h2 className="text-lg font-bold text-gray-900">Game Achievements</h2>
            </div>
            
            <div className="space-y-3">
              {[
                { 
                  id: 'perfect-score', 
                  title: 'Perfect Score', 
                  description: 'Score 100% on this game',
                  icon: Star,
                  color: 'bg-yellow-500',
                  earned: false,
                  progress: 85,
                  total: 100
                },
                { 
                  id: 'quick-thinker', 
                  title: 'Quick Thinker', 
                  description: 'Complete the game in under 2 minutes',
                  icon: Clock,
                  color: 'bg-blue-500',
                  earned: true,
                  date: '2024-12-15'
                },
                { 
                  id: 'memory-master', 
                  title: 'Memory Master', 
                  description: 'Play this game 25 times',
                  icon: Brain,
                  color: 'bg-purple-500',
                  earned: false,
                  progress: 24,
                  total: 25
                }
              ].map(achievement => (
                <div key={achievement.id} className={`
                  rounded-lg border p-3 transition-all
                  ${achievement.earned 
                    ? 'bg-white border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                  }
                `}>
                  <div className="flex items-center space-x-3">
                    <div className={`${achievement.color} p-2 rounded-lg`}>
                      <achievement.icon className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-sm text-gray-900">
                          {achievement.title}
                        </h3>
                        {achievement.earned && (
                          <div className="bg-yellow-100 px-2 py-0.5 rounded-full">
                            <Star size={10} className="text-yellow-600 fill-current inline mr-1" />
                            <span className="text-xs font-medium text-yellow-700">Earned</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-gray-600 mt-1">
                        {achievement.description}
                      </p>
                      
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
                              style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Caregiver Notes */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 border border-sage-200">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-sage-700" />
              <h2 className="text-lg font-semibold text-gray-900">Caregiver Notes</h2>
            </div>
            
            <p className="text-gray-700 text-sm mb-4">
              This game focuses on facial recognition, which is particularly beneficial for 
              maintaining personal connections and emotional memory.
            </p>
            
            <TouchOptimized>
              <Link 
                to={`/games/${gameId}/caregiver`}
                className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <BarChart2 className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">View Detailed Report</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>
    </div>
  );
}