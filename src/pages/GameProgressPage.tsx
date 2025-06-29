import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, TrendingUp, Calendar, BarChart2, Brain, 
  Clock, Award, Filter, ChevronDown, Download, Share2
} from 'lucide-react';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { GameProgressChart } from '../components/games/GameProgressChart';
import { CognitiveSkillsRadar } from '../components/games/CognitiveSkillsRadar';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function GameProgressPage() {
  const { isMobile } = useDeviceDetection();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [gameFilter, setGameFilter] = useState<string>('all');
  
  // Mock data - in a real app, this would come from your API
  const progressData = {
    week: [
      { date: '2024-12-14', score: 65 },
      { date: '2024-12-15', score: 70 },
      { date: '2024-12-16', score: 68 },
      { date: '2024-12-17', score: 75 },
      { date: '2024-12-18', score: 72 },
      { date: '2024-12-19', score: 80 },
      { date: '2024-12-20', score: 85 }
    ],
    month: [
      { date: '2024-11-20', score: 60 },
      { date: '2024-11-27', score: 65 },
      { date: '2024-12-04', score: 70 },
      { date: '2024-12-11', score: 75 },
      { date: '2024-12-18', score: 80 }
    ],
    year: [
      { date: '2024-01-01', score: 50 },
      { date: '2024-03-01', score: 55 },
      { date: '2024-06-01', score: 65 },
      { date: '2024-09-01', score: 75 },
      { date: '2024-12-01', score: 85 }
    ]
  };

  const cognitiveSkills = {
    current: [
      { name: 'Recognition', value: 85 },
      { name: 'Short-term Memory', value: 70 },
      { name: 'Long-term Memory', value: 75 },
      { name: 'Attention', value: 65 },
      { name: 'Processing Speed', value: 60 }
    ],
    previous: [
      { name: 'Recognition', value: 75 },
      { name: 'Short-term Memory', value: 60 },
      { name: 'Long-term Memory', value: 70 },
      { name: 'Attention', value: 55 },
      { name: 'Processing Speed', value: 50 }
    ]
  };

  const gameStats = [
    {
      id: 'photo-recognition',
      name: 'Who is This?',
      plays: 24,
      avgScore: 76,
      improvement: 15,
      lastPlayed: '2024-12-20'
    },
    {
      id: 'date-guessing',
      name: 'When Was This?',
      plays: 18,
      avgScore: 68,
      improvement: 8,
      lastPlayed: '2024-12-18'
    },
    {
      id: 'location-matching',
      name: 'Where Was This?',
      plays: 15,
      avgScore: 72,
      improvement: 12,
      lastPlayed: '2024-12-15'
    },
    {
      id: 'story-completion',
      name: 'Complete the Story',
      plays: 12,
      avgScore: 85,
      improvement: 20,
      lastPlayed: '2024-12-19'
    }
  ];

  const playHistory = [
    {
      date: '2024-12-20',
      game: 'Who is This?',
      score: 85,
      duration: '4m 32s'
    },
    {
      date: '2024-12-19',
      game: 'Complete the Story',
      score: 90,
      duration: '5m 15s'
    },
    {
      date: '2024-12-18',
      game: 'When Was This?',
      score: 75,
      duration: '3m 48s'
    },
    {
      date: '2024-12-17',
      game: 'Who is This?',
      score: 80,
      duration: '4m 10s'
    },
    {
      date: '2024-12-16',
      game: 'Where Was This?',
      score: 70,
      duration: '3m 22s'
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement >= 15) return 'text-green-600';
    if (improvement >= 5) return 'text-blue-600';
    if (improvement >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/games" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Games</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-green-600 p-3 rounded-xl">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Memory Progress</h1>
            <p className="text-lg text-gray-600">
              Track your cognitive improvement over time
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-gray-600" />
          <span className="text-gray-700 font-medium">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last 12 Months</option>
          </select>
          
          <select
            value={gameFilter}
            onChange={(e) => setGameFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-700"
          >
            <option value="all">All Games</option>
            <option value="photo-recognition">Who is This?</option>
            <option value="date-guessing">When Was This?</option>
            <option value="location-matching">Where Was This?</option>
            <option value="story-completion">Complete the Story</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <TouchOptimized>
            <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
              <Download size={20} />
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors">
              <Share2 size={20} />
            </button>
          </TouchOptimized>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left and Center */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Performance Trend</h2>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>
                  {timeRange === 'week' ? 'Last 7 Days' : 
                   timeRange === 'month' ? 'Last 30 Days' : 'Last 12 Months'}
                </span>
              </div>
            </div>
            
            <GameProgressChart 
              data={progressData[timeRange]} 
              height={250}
            />
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Key Insights</h3>
                <span className="text-sm text-gray-500">Based on your play history</span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium text-purple-800">Improvement</h4>
                  </div>
                  <p className="text-sm text-purple-700">
                    Your scores have improved by <span className="font-bold">20%</span> in the last {timeRange}.
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Brain className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Strongest Skill</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Recognition is your strongest cognitive skill at <span className="font-bold">85%</span>.
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Achievement</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    You're on track to earn the <span className="font-bold">Memory Master</span> badge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Game Statistics */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Game Statistics</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Sort by:</span>
                <select className="px-2 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>Most Played</option>
                  <option>Highest Score</option>
                  <option>Most Improved</option>
                  <option>Recently Played</option>
                </select>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Game</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Plays</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Avg. Score</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Improvement</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Last Played</th>
                  </tr>
                </thead>
                <tbody>
                  {gameStats.map(game => (
                    <tr key={game.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link 
                          to={`/games/${game.id}`}
                          className="font-medium text-purple-600 hover:text-purple-700"
                        >
                          {game.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-center">{game.plays}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={getScoreColor(game.avgScore)}>
                          {game.avgScore}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={getImprovementColor(game.improvement)}>
                          +{game.improvement}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatDate(game.lastPlayed)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Play History */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Recent Play History</h2>
              </div>
              
              <TouchOptimized>
                <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  View All
                </button>
              </TouchOptimized>
            </div>
            
            <div className="space-y-3">
              {playHistory.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{session.game}</div>
                    <div className="text-xs text-gray-600">{formatDate(session.date)}</div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className={`font-bold ${getScoreColor(session.score)}`}>{session.score}%</div>
                      <div className="text-xs text-gray-600">Score</div>
                    </div>
                    
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{session.duration}</div>
                      <div className="text-xs text-gray-600">Time</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Cognitive Skills */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Cognitive Skills</h2>
              </div>
              
              <div className="text-xs text-gray-500">
                vs. Previous {timeRange}
              </div>
            </div>
            
            <CognitiveSkillsRadar data={cognitiveSkills.current} />
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3">Skill Breakdown</h3>
              
              <div className="space-y-4">
                {cognitiveSkills.current.map((skill, index) => {
                  const previous = cognitiveSkills.previous[index].value;
                  const change = skill.value - previous;
                  
                  return (
                    <div key={skill.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-purple-600">{skill.value}%</span>
                          {change !== 0 && (
                            <span className={`text-xs ${
                              change > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {change > 0 ? '+' : ''}{change}%
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Recommended Focus</h2>
            
            <div className="space-y-3">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <div className="flex items-start space-x-3">
                  <Brain className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-800 mb-1">Processing Speed</h3>
                    <p className="text-sm text-yellow-700">
                      This is your lowest scoring skill. Try games that focus on quick decision making.
                    </p>
                    <TouchOptimized>
                      <Link 
                        to="/games?skill=processing-speed"
                        className="inline-flex items-center space-x-1 text-yellow-800 font-medium text-sm mt-2"
                      >
                        <span>View Games</span>
                        <ChevronDown size={14} />
                      </Link>
                    </TouchOptimized>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Recognition Strength</h3>
                    <p className="text-sm text-blue-700">
                      Your facial recognition skills are strong. Keep practicing to maintain this ability.
                    </p>
                    <TouchOptimized>
                      <Link 
                        to="/games?skill=recognition"
                        className="inline-flex items-center space-x-1 text-blue-800 font-medium text-sm mt-2"
                      >
                        <span>View Games</span>
                        <ChevronDown size={14} />
                      </Link>
                    </TouchOptimized>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Caregiver Report */}
          <div className="bg-gradient-to-r from-sage-50 to-sage-100 rounded-xl p-6 border border-sage-200">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-sage-700" />
              <h2 className="text-lg font-semibold text-gray-900">Caregiver Report</h2>
            </div>
            
            <p className="text-gray-700 text-sm mb-4">
              Generate a detailed cognitive assessment report to share with healthcare providers.
            </p>
            
            <TouchOptimized>
              <button className="w-full bg-sage-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-sage-800 transition-colors">
                Generate Report
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    </div>
  );
}