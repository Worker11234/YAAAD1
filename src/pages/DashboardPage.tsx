import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, Users, Calendar, Gamepad2, Plus, Heart, Upload, UserPlus, 
  Settings, TrendingUp, Clock, Star, ArrowRight, Sparkles, Image,
  Video, Mic, FileText, Eye, MessageCircle, ThumbsUp
} from 'lucide-react';
import { ResponsiveGrid } from '../components/ui/ResponsiveGrid';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { SwipeGestures } from '../components/ui/SwipeGestures';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';

export function DashboardPage() {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(0);

  // Mock data - in real app this would come from your API/state
  const stats = {
    totalMemories: 47,
    familyMembers: 5,
    recentActivity: 12,
    gamesPlayed: 8
  };

  const quickActions = [
    {
      title: 'View Timeline',
      description: 'Browse all family memories chronologically',
      icon: Calendar,
      href: '/timeline',
      color: 'bg-blue-600 hover:bg-blue-700',
      isPrimary: true
    },
    {
      title: 'Upload Memory',
      description: 'Add photos, videos, or stories',
      icon: Upload,
      href: '/upload',
      color: 'bg-sage-700 hover:bg-sage-800',
      isPrimary: false
    },
    {
      title: 'Invite Family',
      description: 'Add more family members',
      icon: UserPlus,
      href: '/family/invite',
      color: 'bg-green-600 hover:bg-green-700',
      isPrimary: false
    },
    {
      title: 'Memory Games',
      description: 'Fun cognitive activities',
      icon: Gamepad2,
      href: '/games',
      color: 'bg-purple-600 hover:bg-purple-700',
      isPrimary: false
    }
  ];

  const recentMemories = [
    {
      id: 1,
      title: 'Christmas Morning 2024',
      type: 'video',
      date: '2024-12-25',
      author: 'Mom',
      thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 12,
      likes: 8,
      comments: 3
    },
    {
      id: 2,
      title: 'Family Reunion Group Photo',
      type: 'photo',
      date: '2024-12-15',
      author: 'Uncle John',
      thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 25,
      likes: 15,
      comments: 7
    },
    {
      id: 3,
      title: 'Grandma\'s Birthday Story',
      type: 'audio',
      date: '2024-12-10',
      author: 'Sarah',
      thumbnail: null,
      views: 8,
      likes: 12,
      comments: 5
    },
    {
      id: 4,
      title: 'Dad\'s Army Days',
      type: 'story',
      date: '2024-12-05',
      author: 'Family',
      thumbnail: null,
      views: 18,
      likes: 10,
      comments: 4
    },
    {
      id: 5,
      title: 'Summer Vacation Beach',
      type: 'photo',
      date: '2024-07-20',
      author: 'Dad',
      thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 32,
      likes: 20,
      comments: 9
    },
    {
      id: 6,
      title: 'Baby\'s First Steps',
      type: 'video',
      date: '2024-06-15',
      author: 'Mom',
      thumbnail: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400',
      views: 45,
      likes: 30,
      comments: 12
    }
  ];

  const familyActivity = [
    {
      id: 1,
      user: 'Mom',
      action: 'uploaded',
      item: 'Christmas Morning 2024',
      time: '2 hours ago',
      avatar: '👩'
    },
    {
      id: 2,
      user: 'Uncle John',
      action: 'commented on',
      item: 'Family Reunion Photo',
      time: '5 hours ago',
      avatar: '👨'
    },
    {
      id: 3,
      user: 'Sarah',
      action: 'liked',
      item: 'Grandma\'s Birthday Story',
      time: '1 day ago',
      avatar: '👧'
    },
    {
      id: 4,
      user: 'Dad',
      action: 'uploaded',
      item: 'Summer Vacation Beach',
      time: '2 days ago',
      avatar: '👨‍🦳'
    }
  ];

  const featuredMemory = recentMemories[0];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo': return Image;
      case 'video': return Video;
      case 'audio': return Mic;
      case 'story': return FileText;
      default: return Camera;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'photo': return 'bg-blue-100 text-blue-700';
      case 'video': return 'bg-purple-100 text-purple-700';
      case 'audio': return 'bg-green-100 text-green-700';
      case 'story': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-sage-700 via-sage-600 to-sage-700 rounded-2xl lg:rounded-3xl p-6 lg:p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white rounded-full"></div>
        </div>
        
        <div className="relative">
          <div className="flex items-center space-x-3 lg:space-x-4 mb-4 lg:mb-6">
            <Heart className="w-8 h-8 lg:w-10 lg:h-10" />
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold">
                Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'Friend'}!
              </h1>
              <p className="text-sage-100 text-base lg:text-lg opacity-90">
                Your family's memories are growing beautifully
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <Camera className="w-6 h-6 lg:w-8 lg:h-8" />
                <div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.totalMemories}</p>
                  <p className="text-sage-100 text-sm lg:text-base opacity-90">Memories</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 lg:w-8 lg:h-8" />
                <div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.familyMembers}</p>
                  <p className="text-sage-100 text-sm lg:text-base opacity-90">Family</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8" />
                <div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.recentActivity}</p>
                  <p className="text-sage-100 text-sm lg:text-base opacity-90">This Week</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 lg:p-6">
              <div className="flex items-center space-x-3">
                <Gamepad2 className="w-6 h-6 lg:w-8 lg:h-8" />
                <div>
                  <p className="text-2xl lg:text-3xl font-bold">{stats.gamesPlayed}</p>
                  <p className="text-sage-100 text-sm lg:text-base opacity-90">Games</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Memory of the Day */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-sage-100 overflow-hidden">
        <div className="p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-xl">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Memory of the Day</h2>
                <p className="text-gray-600">AI-suggested based on this date in history</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-4 py-2 rounded-full">
              <Sparkles className="w-5 h-5 text-orange-600 inline mr-2" />
              <span className="text-orange-700 font-medium text-sm">Featured</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="relative">
              {featuredMemory.thumbnail ? (
                <img
                  src={featuredMemory.thumbnail}
                  alt={featuredMemory.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-sage-100 rounded-xl flex items-center justify-center">
                  <Camera className="w-16 h-16 text-sage-400" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(featuredMemory.type)}`}>
                  {featuredMemory.type}
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">{featuredMemory.title}</h3>
              <p className="text-gray-600 text-lg">
                A beautiful memory from {featuredMemory.date} shared by {featuredMemory.author}. 
                This special moment has been loved by your family.
              </p>
              
              <div className="flex items-center space-x-6 text-gray-500">
                <div className="flex items-center space-x-2">
                  <Eye size={18} />
                  <span>{featuredMemory.views} views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ThumbsUp size={18} />
                  <span>{featuredMemory.likes} likes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle size={18} />
                  <span>{featuredMemory.comments} comments</span>
                </div>
              </div>

              <TouchOptimized>
                <Link
                  to={`/memory/${featuredMemory.id}`}
                  className="inline-flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-sage-800 transition-colors w-fit"
                >
                  <span>View Memory</span>
                  <ArrowRight size={18} />
                </Link>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-sage-100 p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Quick Actions</h2>
          <Link
            to="/settings"
            className="text-sage-600 hover:text-sage-700 transition-colors"
          >
            <Settings size={20} />
          </Link>
        </div>

        <ResponsiveGrid minItemWidth={isMobile ? 140 : 280}>
          {quickActions.map((action, index) => (
            <TouchOptimized key={index}>
              <Link
                to={action.href}
                className={`${action.color} text-white p-4 lg:p-6 rounded-xl lg:rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 block group ${
                  action.isPrimary ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="flex items-center space-x-3 lg:space-x-4 mb-3 lg:mb-4">
                  <action.icon className="w-6 h-6 lg:w-8 lg:h-8" />
                  <h3 className="text-base lg:text-lg font-semibold">{action.title}</h3>
                </div>
                <p className="text-xs lg:text-sm opacity-90 mb-3 lg:mb-4">{action.description}</p>
                <div className="flex items-center space-x-2 text-xs lg:text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                  <span>Get started</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            </TouchOptimized>
          ))}
        </ResponsiveGrid>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Memories Carousel */}
        <div className="lg:col-span-2 bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-sage-100 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Recent Memories</h2>
            <Link
              to="/timeline"
              className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium transition-colors"
            >
              <span>View All</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <SwipeGestures
            onSwipeLeft={() => setCurrentMemoryIndex(Math.min(currentMemoryIndex + 1, recentMemories.length - 3))}
            onSwipeRight={() => setCurrentMemoryIndex(Math.max(currentMemoryIndex - 1, 0))}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-300 ease-out"
              style={{ 
                transform: `translateX(-${currentMemoryIndex * (isMobile ? 100 : 33.333)}%)` 
              }}
            >
              {recentMemories.map((memory) => {
                const TypeIcon = getTypeIcon(memory.type);
                return (
                  <div
                    key={memory.id}
                    className={`${isMobile ? 'w-full' : 'w-1/3'} flex-shrink-0 px-2`}
                  >
                    <TouchOptimized>
                      <div className="bg-sage-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-gray-100 relative">
                          {memory.thumbnail ? (
                            <img
                              src={memory.thumbnail}
                              alt={memory.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <TypeIcon className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(memory.type)}`}>
                              {memory.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-1 text-sm lg:text-base line-clamp-2">
                            {memory.title}
                          </h3>
                          <p className="text-gray-500 text-xs lg:text-sm mb-2">
                            by {memory.author} • {memory.date}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Eye size={12} />
                              <span>{memory.views}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <ThumbsUp size={12} />
                              <span>{memory.likes}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </TouchOptimized>
                  </div>
                );
              })}
            </div>
          </SwipeGestures>

          {/* Carousel Indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {Array.from({ length: Math.max(1, recentMemories.length - (isMobile ? 0 : 2)) }).map((_, index) => (
              <TouchOptimized key={index}>
                <button
                  onClick={() => setCurrentMemoryIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentMemoryIndex ? 'bg-sage-700' : 'bg-gray-300'
                  }`}
                />
              </TouchOptimized>
            ))}
          </div>
        </div>

        {/* Family Activity Feed */}
        <div className="bg-white rounded-2xl lg:rounded-3xl shadow-lg border border-sage-100 p-6 lg:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Family Activity</h2>
            <Clock size={18} className="text-gray-400" />
          </div>

          <div className="space-y-4">
            {familyActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-sage-25 transition-colors">
                <div className="w-10 h-10 bg-sage-100 rounded-full flex items-center justify-center text-lg">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.user}</span>
                    {' '}{activity.action}{' '}
                    <span className="font-medium text-sage-700">{activity.item}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>

          <TouchOptimized>
            <Link
              to="/activity"
              className="block text-center text-sage-600 hover:text-sage-700 font-medium mt-4 py-2 transition-colors"
            >
              View All Activity
            </Link>
          </TouchOptimized>
        </div>
      </div>
    </div>
  );
}