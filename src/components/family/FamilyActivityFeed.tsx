import React, { useState, useEffect } from 'react';
import { 
  Clock, Heart, MessageCircle, Upload, User, 
  Gamepad2, Eye, Tag, Share2, RefreshCw
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface ActivityItem {
  id: string;
  family_id: string;
  activity_type: string;
  actor_id: string | null;
  target_memory_id: string | null;
  target_profile_id: string | null;
  target_family_id: string | null;
  content: string | null;
  created_at: string;
  actor?: {
    full_name: string;
    avatar_url: string | null;
    relationship: string | null;
  };
  memory?: {
    title: string;
    thumbnail_url: string | null;
  };
}

interface FamilyActivityFeedProps {
  familyId: string;
  limit?: number;
  className?: string;
}

export function FamilyActivityFeed({
  familyId,
  limit = 5,
  className = ''
}: FamilyActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, [familyId]);

  const loadActivities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Mock data instead of Supabase query
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          family_id: familyId,
          activity_type: 'upload',
          actor_id: 'user1',
          target_memory_id: 'mem1',
          target_profile_id: null,
          target_family_id: null,
          content: 'uploaded 3 new photos from Christmas',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          actor: {
            full_name: 'Sarah',
            avatar_url: null,
            relationship: 'Daughter'
          },
          memory: {
            title: 'Christmas Morning 2024',
            thumbnail_url: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        },
        {
          id: '2',
          family_id: familyId,
          activity_type: 'comment',
          actor_id: 'user2',
          target_memory_id: 'mem2',
          target_profile_id: null,
          target_family_id: null,
          content: 'commented on your beach vacation photos',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          actor: {
            full_name: 'Dad',
            avatar_url: null,
            relationship: 'Father'
          },
          memory: {
            title: 'Summer Beach Vacation',
            thumbnail_url: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400'
          }
        },
        {
          id: '3',
          family_id: familyId,
          activity_type: 'game_played',
          actor_id: 'user3',
          target_memory_id: null,
          target_profile_id: null,
          target_family_id: null,
          content: 'completed a memory matching game with a high score',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
          actor: {
            full_name: 'Grandma',
            avatar_url: null,
            relationship: 'Grandmother'
          }
        }
      ];
      
      setActivities(mockActivities);
    } catch (err) {
      console.error('Unexpected error loading activities:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-5 h-5 text-blue-600" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-green-600" />;
      case 'like': return <Heart className="w-5 h-5 text-red-600" />;
      case 'join': return <User className="w-5 h-5 text-purple-600" />;
      case 'game_played': return <Gamepad2 className="w-5 h-5 text-orange-600" />;
      case 'memory_request': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'view': return <Eye className="w-5 h-5 text-gray-600" />;
      case 'tag': return <Tag className="w-5 h-5 text-indigo-600" />;
      case 'share': return <Share2 className="w-5 h-5 text-teal-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getActivityIconBg = (type: string) => {
    switch (type) {
      case 'upload': return 'bg-blue-100';
      case 'comment': return 'bg-green-100';
      case 'like': return 'bg-red-100';
      case 'join': return 'bg-purple-100';
      case 'game_played': return 'bg-orange-100';
      case 'memory_request': return 'bg-yellow-100';
      case 'view': return 'bg-gray-100';
      case 'tag': return 'bg-indigo-100';
      case 'share': return 'bg-teal-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Family Activity</h3>
          <TouchOptimized>
            <button
              onClick={loadActivities}
              className="p-1 text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-full transition-colors"
              aria-label="Refresh activity feed"
            >
              <RefreshCw size={18} />
            </button>
          </TouchOptimized>
        </div>
      </div>
      
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading activities...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-red-600">{error}</p>
          <TouchOptimized>
            <button
              onClick={loadActivities}
              className="mt-2 text-sage-600 hover:text-sage-700 font-medium"
            >
              Try Again
            </button>
          </TouchOptimized>
        </div>
      ) : activities.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Activity Yet</h4>
          <p className="text-gray-600">
            When family members interact with memories, you'll see their activity here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {activities.map(activity => (
            <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-3">
                {/* Actor Avatar */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      {activity.actor?.avatar_url ? (
                        <img 
                          src={activity.actor.avatar_url} 
                          alt={activity.actor.full_name || 'User'}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getActivityIconBg(activity.activity_type)}`}>
                      {getActivityIcon(activity.activity_type)}
                    </div>
                  </div>
                </div>
                
                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{activity.actor?.full_name || 'Unknown User'}</span>
                    {activity.actor?.relationship && (
                      <span className="text-xs text-gray-500 ml-1">
                        ({activity.actor.relationship})
                      </span>
                    )}
                    {' '}{activity.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(activity.created_at)}
                  </p>
                  
                  {/* Memory Preview */}
                  {activity.memory && (
                    <div className="mt-2 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg">
                      {activity.memory.thumbnail_url ? (
                        <img 
                          src={activity.memory.thumbnail_url} 
                          alt={activity.memory.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Eye className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {activity.memory.title}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 0 && (
        <div className="p-3 border-t border-gray-200 text-center">
          <TouchOptimized>
            <button
              onClick={() => {
                // In a real app, this would navigate to a full activity page
                console.log('View all activities');
              }}
              className="text-sm text-sage-600 hover:text-sage-700 font-medium"
            >
              View All Activity
            </button>
          </TouchOptimized>
        </div>
      )}
    </div>
  );
}