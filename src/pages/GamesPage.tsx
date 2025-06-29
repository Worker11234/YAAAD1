import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, Brain, Users, Clock, Award, TrendingUp, 
  Calendar, Star, Trophy, Zap, BarChart2, Heart, 
  Play, Info, Settings, ChevronRight, Plus, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { GameCard } from '../components/games/GameCard';
import { GameProgressChart } from '../components/games/GameProgressChart';
import { AchievementsList } from '../components/games/AchievementsList';
import { DailyChallenge } from '../components/games/DailyChallenge';
import { CognitiveSkillsRadar } from '../components/games/CognitiveSkillsRadar';
import { GameCategorySelector } from '../components/games/GameCategorySelector';

export function GamesPage() {
  const { isMobile } = useDeviceDetection();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAchievements, setShowAchievements] = useState<boolean>(false);
  const [showProgress, setShowProgress] = useState<boolean>(!isMobile);

  // Mock data - in a real app, this would come from your API
  const games = [
    {
      id: 'photo-recognition',
      title: 'Who is This?',
      description: 'Test your ability to recognize family members in photos',
      category: 'recognition',
      difficulty: 'medium',
      icon: 'user',
      color: 'bg-blue-600',
      lastPlayed: '2024-12-20',
      progress: 72,
      recommended: true
    },
    {
      id: 'date-guessing',
      title: 'When Was This?',
      description: 'Guess when family photos were taken',
      category: 'memory',
      difficulty: 'hard',
      icon: 'calendar',
      color: 'bg-green-600',
      lastPlayed: '2024-12-18',
      progress: 45,
      recommended: false
    },
    {
      id: 'location-matching',
      title: 'Where Was This?',
      description: 'Identify locations from family memories',
      category: 'recognition',
      difficulty: 'medium',
      icon: 'map-pin',
      color: 'bg-orange-600',
      lastPlayed: '2024-12-15',
      progress: 60,
      recommended: true
    },
    {
      id: 'story-completion',
      title: 'Complete the Story',
      description: 'Fill in missing details from family stories',
      category: 'cognitive',
      difficulty: 'easy',
      icon: 'book-open',
      color: 'bg-purple-600',
      lastPlayed: '2024-12-19',
      progress: 85,
      recommended: false
    },
    {
      id: 'face-matching',
      title: 'Match the Faces',
      description: 'Match the same person across different photos',
      category: 'recognition',
      difficulty: 'medium',
      icon: 'users',
      color: 'bg-pink-600',
      lastPlayed: '2024-12-17',
      progress: 50,
      recommended: true
    },
    {
      id: 'memory-sequencing',
      title: 'Timeline Order',
      description: 'Put family events in chronological order',
      category: 'memory',
      difficulty: 'hard',
      icon: 'clock',
      color: 'bg-yellow-600',
      lastPlayed: '2024-12-16',
      progress: 30,
      recommended: false
    },
    {
      id: 'family-trivia',
      title: 'Family Trivia',
      description: 'Test your knowledge about family facts',
      category: 'family',
      difficulty: 'easy',
      icon: 'heart',
      color: 'bg-red-600',
      lastPlayed: '2024-12-14',
      progress: 90,
      recommended: true
    },
    {
      id: 'memory-pairs',
      title: 'Memory Pairs',
      description: 'Classic memory matching game with family photos',
      category: 'memory',
      difficulty: 'easy',
      icon: 'grid',
      color: 'bg-teal-600',
      lastPlayed: '2024-12-13',
      progress: 65,
      recommended: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Games', icon: Gamepad2 },
    { id: 'recognition', name: 'Recognition', icon: Brain },
    { id: 'memory', name: 'Memory', icon: Brain },
    { id: 'cognitive', name: 'Cognitive', icon: Zap },
    { id: 'family', name: 'Family Fun', icon: Users }
  ];

  const achievements = [
    { 
      id: 'memory-master', 
      title: 'Memory Master', 
      description: 'Complete 10 memory games with 80%+ accuracy',
      icon: Trophy,
      color: 'bg-yellow-500',
      earned: true,
      date: '2024-12-15'
    },
    { 
      id: 'recognition-pro', 
      title: 'Recognition Pro', 
      description: 'Correctly identify 50 family members',
      icon: Star,
      color: 'bg-purple-500',
      earned: true,
      date: '2024-12-10'
    },
    { 
      id: 'daily-streak', 
      title: 'Week Warrior', 
      description: 'Play games for 7 consecutive days',
      icon: Calendar,
      color: 'bg-green-500',
      earned: false,
      progress: 5,
      total: 7
    },
    { 
      id: 'family-historian', 
      title: 'Family Historian', 
      description: 'Correctly order 20 family events chronologically',
      icon: Clock,
      color: 'bg-blue-500',
      earned: false,
      progress: 12,
      total: 20
    },
    { 
      id: 'perfect-score', 
      title: 'Perfect Score', 
      description: 'Achieve 100% on any game',
      icon: Award,
      color: 'bg-red-500',
      earned: true,
      date: '2024-12-18'
    }
  ];

  const progressData = [
    { date: '2024-12-14', score: 65 },
    { date: '2024-12-15', score: 70 },
    { date: '2024-12-16', score: 68 },
    { date: '2024-12-17', score: 75 },
    { date: '2024-12-18', score: 72 },
    { date: '2024-12-19', score: 80 },
    { date: '2024-12-20', score: 85 }
  ];

  const cognitiveSkills = [
    { name: 'Recognition', value: 85 },
    { name: 'Short-term Memory', value: 70 },
    { name: 'Long-term Memory', value: 75 },
    { name: 'Attention', value: 65 },
    { name: 'Processing Speed', value: 60 }
  ];

  const dailyChallenge = {
    id: 'daily-challenge-1',
    title: 'Family Birthday Challenge',
    description: 'Match family members to their birthdays',
    reward: '50 points',
    icon: Calendar,
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    expiresIn: '14:30:45'
  };

  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory);

  const recommendedGames = games.filter(game => game.recommended);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-600 p-3 rounded-xl">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Games</h1>
            <p className="text-lg text-gray-600">
              Fun activities to strengthen memory and cognitive skills
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content - Left and Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Challenge */}
          <DailyChallenge challenge={dailyChallenge} />

          {/* Game Categories */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <GameCategorySelector 
              categories={categories} 
              activeCategory={activeCategory} 
              onSelectCategory={setActiveCategory} 
            />
          </div>

          {/* Recommended Games */}
          {activeCategory === 'all' && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                </div>
                <Link to="/games/recommended" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedGames.slice(0, 2).map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          )}

          {/* All Games */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === 'all' ? 'All Games' : `${categories.find(c => c.id === activeCategory)?.name} Games`}
              </h2>
              <div className="flex items-center space-x-2">
                <TouchOptimized>
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                    <Settings size={20} />
                  </button>
                </TouchOptimized>
                <TouchOptimized>
                  <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
                    <Info size={20} />
                  </button>
                </TouchOptimized>
              </div>
            </div>
            
            <ResponsiveGrid minItemWidth={isMobile ? 140 : 240} gap={16}>
              {filteredGames.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </ResponsiveGrid>
            
            {filteredGames.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Gamepad2 className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Games Found</h3>
                <p className="text-gray-600 mb-4">
                  There are no games in this category yet.
                </p>
                <TouchOptimized>
                  <button 
                    onClick={() => setActiveCategory('all')}
                    className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <span>View All Games</span>
                    <ChevronRight size={16} />
                  </button>
                </TouchOptimized>
              </div>
            )}
          </div>

          {/* Mobile Progress Section */}
          {isMobile && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
                </div>
                <TouchOptimized>
                  <button 
                    onClick={() => setShowProgress(!showProgress)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    {showProgress ? 'Hide' : 'Show'}
                  </button>
                </TouchOptimized>
              </div>
              
              {showProgress && (
                <div className="space-y-4">
                  <GameProgressChart data={progressData} />
                  
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-3">Cognitive Skills</h3>
                    <CognitiveSkillsRadar data={cognitiveSkills} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile Achievements Section */}
          {isMobile && (
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                </div>
                <TouchOptimized>
                  <button 
                    onClick={() => setShowAchievements(!showAchievements)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    {showAchievements ? 'Hide' : 'Show'}
                  </button>
                </TouchOptimized>
              </div>
              
              {showAchievements && (
                <AchievementsList achievements={achievements} />
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - Progress & Achievements */}
        <div className="hidden lg:block space-y-6">
          {/* Progress Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
              </div>
              <Link to="/games/progress" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View Details
              </Link>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Weekly Performance</h3>
                <GameProgressChart data={progressData} />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">Cognitive Skills</h3>
                <CognitiveSkillsRadar data={cognitiveSkills} />
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Current Streak</h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                    5 Days
                  </span>
                </div>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                    <div 
                      key={day} 
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        day <= 5 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
              </div>
              <Link to="/games/achievements" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All
              </Link>
            </div>
            
            <AchievementsList achievements={achievements} />
          </div>

          {/* Caregiver Section */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 border border-sage-200">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-sage-700" />
              <h2 className="text-lg font-semibold text-gray-900">Caregiver Features</h2>
            </div>
            
            <p className="text-gray-700 mb-4 text-sm">
              Monitor cognitive health and track progress with detailed reports and insights.
            </p>
            
            <TouchOptimized>
              <Link 
                to="/games/caregiver"
                className="flex items-center justify-between w-full p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <BarChart2 className="w-5 h-5 text-sage-600" />
                  <span className="font-medium text-gray-900">Progress Reports</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>

      {/* Create Custom Game Button (Mobile) */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-30">
          <TouchOptimized>
            <Link
              to="/games/create"
              className="flex items-center justify-center w-12 h-12 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={24} />
            </Link>
          </TouchOptimized>
        </div>
      )}
    </div>
  );
}