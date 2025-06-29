import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Upload, User, Gamepad2, Eye, 
  Clock, Filter, Bell, X, Settings, ChevronDown, 
  Calendar, RefreshCw, Pin, Star, Play, Share, Tag, 
  FileText, Mic
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useAuth } from '../../hooks/useAuth';

interface ActivityItem {
  id: string;
  type: 'upload' | 'comment' | 'like' | 'join' | 'game' | 'view' | 'share' | 'tag';
  actor: {
    id: string;
    name: string;
    avatar?: string;
    relationship?: string;
  };
  timestamp: string;
  content: string;
  memory?: {
    id: string;
    title: string;
    thumbnail?: string;
    type: 'photo' | 'video' | 'audio' | 'story';
  };
  count?: number;
  isNew?: boolean;
  isHighlighted?: boolean;
}

interface ActivityFeedProps {
  familyId: string;
  filter?: 'all' | 'uploads' | 'comments' | 'likes' | 'games' | 'members';
  limit?: number;
  showHeader?: boolean;
  showFilters?: boolean;
  className?: string;
  onItemClick?: (item: ActivityItem) => void;
}

export function ActivityFeed({ 
  familyId, 
  filter = 'all', 
  limit = 10,
  showHeader = true,
  showFilters = true,
  className = '',
  onItemClick
}: ActivityFeedProps) {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>(filter);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [hasNewActivities, setHasNewActivities] = useState(false);

  // Mock data - in a real app, this would come from your API
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'upload',
          actor: {
            id: 'user1',
            name: 'Sarah',
            relationship: 'Daughter',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          content: 'uploaded 3 new photos from Christmas',
          memory: {
            id: 'mem1',
            title: 'Christmas Morning 2024',
            thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400',
            type: 'photo'
          },
          count: 3,
          isNew: true,
          isHighlighted: true
        },
        {
          id: '2',
          type: 'comment',
          actor: {
            id: 'user2',
            name: 'Dad',
            relationship: 'Father',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          content: 'commented on your beach vacation photos',
          memory: {
            id: 'mem2',
            title: 'Summer Beach Vacation',
            thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400',
            type: 'photo'
          },
          isNew: true
        },
        {
          id: '3',
          type: 'game',
          actor: {
            id: 'user3',
            name: 'Grandma',
            relationship: 'Grandmother',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
          content: 'completed a memory matching game with a high score',
          isNew: false
        },
        {
          id: '4',
          type: 'join',
          actor: {
            id: 'user4',
            name: 'Cousin Mike',
            relationship: 'Cousin',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
          content: 'joined the family circle',
          isNew: false
        },
        {
          id: '5',
          type: 'view',
          actor: {
            id: 'user5',
            name: 'Mom',
            relationship: 'Mother',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
          content: 'viewed your anniversary album',
          memory: {
            id: 'mem3',
            title: 'Anniversary Celebration',
            thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400',
            type: 'photo'
          },
          count: 15,
          isNew: false
        },
        {
          id: '6',
          type: 'like',
          actor: {
            id: 'user6',
            name: 'Uncle John',
            relationship: 'Uncle',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
          content: 'liked your family reunion video',
          memory: {
            id: 'mem4',
            title: 'Family Reunion 2024',
            thumbnail: undefined,
            type: 'video'
          },
          isNew: false
        },
        {
          id: '7',
          type: 'share',
          actor: {
            id: 'user1',
            name: 'Sarah',
            relationship: 'Daughter',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
          content: 'shared a memory collection with the whole family',
          memory: {
            id: 'mem5',
            title: 'Summer Memories 2024',
            thumbnail: undefined,
            type: 'photo'
          },
          isNew: false
        },
        {
          id: '8',
          type: 'tag',
          actor: {
            id: 'user2',
            name: 'Dad',
            relationship: 'Father',
            avatar: undefined
          },
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
          content: 'tagged you in 5 childhood photos',
          memory: {
            id: 'mem6',
            title: 'Childhood Memories',
            thumbnail: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400',
            type: 'photo'
          },
          count: 5,
          isNew: false
        }
      ];
      
      // Filter activities based on the active filter
      let filteredActivities = mockActivities;
      if (activeFilter !== 'all') {
        filteredActivities = mockActivities.filter(activity => activity.type === activeFilter);
      }
      
      // Apply limit
      filteredActivities = filteredActivities.slice(0, limit);
      
      setActivities(filteredActivities);
      setLoading(false);
    };
    
    fetchActivities();
    
    // Set up polling for new activities (in a real app, this would be a WebSocket)
    const interval = setInterval(() => {
      // Simulate new activity
      const random = Math.random();
      if (random > 0.7) {
        setHasNewActivities(true);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, [familyId, activeFilter, limit]);

  const handleRefresh = () => {
    setLoading(true);
    setHasNewActivities(false);
    
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload': return Upload;
      case 'comment': return MessageCircle;
      case 'like': return Heart;
      case 'join': return User;
      case 'game': return Gamepad2;
      case 'view': return Eye;
      case 'share': return Share;
      case 'tag': return Tag;
      default: return Clock;
    }
  };

  const getActivityIconColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'upload': return 'bg-blue-100 text-blue-600';
      case 'comment': return 'bg-green-100 text-green-600';
      case 'like': return 'bg-red-100 text-red-600';
      case 'join': return 'bg-purple-100 text-purple-600';
      case 'game': return 'bg-orange-100 text-orange-600';
      case 'view': return 'bg-gray-100 text-gray-600';
      case 'share': return 'bg-indigo-100 text-indigo-600';
      case 'tag': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) {
      return 'just now';
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Activity', icon: Clock },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'members', label: 'Members', icon: User }
  ];

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-sage-600" />
              <h3 className="font-semibold text-gray-900">Family Activity</h3>
              {hasNewActivities && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {hasNewActivities && (
                <TouchOptimized>
                  <button
                    onClick={handleRefresh}
                    className="p-1 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-colors"
                    aria-label="Refresh activity feed"
                  >
                    <RefreshCw size={18} />
                  </button>
                </TouchOptimized>
              )}
              
              {showFilters && (
                <div className="relative">
                  <TouchOptimized>
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                      aria-label="Filter activity feed"
                      aria-expanded={showFilterMenu}
                    >
                      <Filter size={18} />
                    </button>
                  </TouchOptimized>
                  
                  {showFilterMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowFilterMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                        <div className="py-1">
                          {filterOptions.map(option => (
                            <TouchOptimized key={option.id}>
                              <button
                                onClick={() => {
                                  setActiveFilter(option.id);
                                  setShowFilterMenu(false);
                                }}
                                className={`w-full flex items-center space-x-2 px-4 py-2 text-sm ${
                                  activeFilter === option.id
                                    ? 'bg-sage-50 text-sage-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <option.icon size={16} />
                                <span>{option.label}</span>
                              </button>
                            </TouchOptimized>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
              
              <Link
                to="/notifications"
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="View all notifications"
              >
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          // Loading state
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          // Empty state
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h4>
            <p className="text-gray-600 mb-4">
              When family members interact with memories, you'll see their activity here.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
            >
              <Upload size={16} />
              <span>Upload your first memory</span>
            </Link>
          </div>
        ) : (
          // Activity items
          activities.map(activity => (
            <TouchOptimized 
              key={activity.id}
              onTap={() => onItemClick && onItemClick(activity)}
            >
              <div className={`p-4 hover:bg-gray-50 transition-colors ${activity.isNew ? 'bg-sage-50' : ''}`}>
                <div className="flex items-start space-x-3">
                  {/* Actor Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {activity.actor.avatar ? (
                          <img 
                            src={activity.actor.avatar} 
                            alt={activity.actor.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-gray-500" />
                        )}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getActivityIconColor(activity.type)}`}>
                        {React.createElement(getActivityIcon(activity.type), { size: 12 })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.actor.name}</span>
                          {activity.actor.relationship && (
                            <span className="text-xs text-gray-500 ml-1">
                              ({activity.actor.relationship})
                            </span>
                          )}
                          {' '}{activity.content}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                      
                      {activity.isHighlighted && (
                        <div className="flex-shrink-0 ml-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        </div>
                      )}
                    </div>
                    
                    {/* Memory Preview (if applicable) */}
                    {activity.memory && (
                      <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
                        {activity.memory.thumbnail ? (
                          <img 
                            src={activity.memory.thumbnail} 
                            alt={activity.memory.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            {activity.memory.type === 'video' && <Play className="w-5 h-5 text-gray-500" />}
                            {activity.memory.type === 'audio' && <Mic className="w-5 h-5 text-gray-500" />}
                            {activity.memory.type === 'story' && <FileText className="w-5 h-5 text-gray-500" />}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {activity.memory.title}
                          </p>
                          {activity.count && (
                            <p className="text-xs text-gray-500">
                              {activity.type === 'upload' && `${activity.count} items`}
                              {activity.type === 'view' && `${activity.count} views`}
                              {activity.type === 'tag' && `${activity.count} photos`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TouchOptimized>
          ))
        )}
      </div>
      
      {/* Footer */}
      {activities.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <Link
            to="/activity"
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            View All Activity
          </Link>
        </div>
      )}
    </div>
  );
}