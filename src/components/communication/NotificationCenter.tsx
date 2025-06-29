import React, { useState, useEffect } from 'react';
import { 
  Bell, Settings, Filter, Check, X, Clock, 
  Upload, MessageCircle, Heart, User, Gamepad2, 
  Eye, Calendar, Tag, Share2, Pin, Trash2, AtSign,
  Mail, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Notification {
  id: string;
  type: 'upload' | 'comment' | 'like' | 'mention' | 'join' | 'game' | 'view' | 'tag' | 'share' | 'invite';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  isPinned: boolean;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  memory?: {
    id: string;
    title: string;
    thumbnail?: string;
  };
  link?: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsClick: () => void;
}

export function NotificationCenter({ 
  isOpen, 
  onClose,
  onSettingsClick
}: NotificationCenterProps) {
  const { isMobile } = useDeviceDetection();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedTab, setSelectedTab] = useState<'all' | 'family' | 'memories' | 'system'>('all');

  // Fetch notifications
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, filter, selectedTab]);

  const fetchNotifications = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'upload',
        title: 'New Photos Uploaded',
        message: 'Sarah uploaded 5 new photos to "Summer Vacation 2024"',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        isRead: false,
        isPinned: true,
        actor: {
          id: 'user1',
          name: 'Sarah',
          avatar: undefined
        },
        memory: {
          id: 'mem1',
          title: 'Summer Vacation 2024',
          thumbnail: 'https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        link: '/memory/mem1'
      },
      {
        id: '2',
        type: 'comment',
        title: 'New Comment',
        message: 'Dad commented on your Christmas photo: "What a wonderful day that was!"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        isRead: false,
        isPinned: false,
        actor: {
          id: 'user2',
          name: 'Dad',
          avatar: undefined
        },
        memory: {
          id: 'mem2',
          title: 'Christmas Morning 2024',
          thumbnail: 'https://images.pexels.com/photos/1303081/pexels-photo-1303081.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        link: '/memory/mem2#comments'
      },
      {
        id: '3',
        type: 'mention',
        title: 'You were mentioned',
        message: 'Mom mentioned you in a comment: "Look at @you in this photo!"',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user3',
          name: 'Mom',
          avatar: undefined
        },
        memory: {
          id: 'mem3',
          title: 'Family Reunion',
          thumbnail: 'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        link: '/memory/mem3#comments'
      },
      {
        id: '4',
        type: 'like',
        title: 'New Like',
        message: 'Grandma liked your story about the family vacation',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user4',
          name: 'Grandma',
          avatar: undefined
        },
        memory: {
          id: 'mem4',
          title: 'Family Vacation Story',
          thumbnail: undefined
        },
        link: '/memory/mem4'
      },
      {
        id: '5',
        type: 'game',
        title: 'Memory Game Completed',
        message: 'Uncle John completed the "Family Faces" memory game with a high score!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user5',
          name: 'Uncle John',
          avatar: undefined
        },
        link: '/games/family-faces'
      },
      {
        id: '6',
        type: 'join',
        title: 'New Family Member',
        message: 'Cousin Mike joined your family circle',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user6',
          name: 'Cousin Mike',
          avatar: undefined
        },
        link: '/family'
      },
      {
        id: '7',
        type: 'invite',
        title: 'Invitation Accepted',
        message: 'Aunt Lisa accepted your invitation to join the family',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(), // 4 days ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user7',
          name: 'Aunt Lisa',
          avatar: undefined
        },
        link: '/family'
      },
      {
        id: '8',
        type: 'tag',
        title: 'You were tagged',
        message: 'Dad tagged you in 3 childhood photos',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
        isRead: true,
        isPinned: false,
        actor: {
          id: 'user2',
          name: 'Dad',
          avatar: undefined
        },
        memory: {
          id: 'mem5',
          title: 'Childhood Memories',
          thumbnail: 'https://images.pexels.com/photos/1257110/pexels-photo-1257110.jpeg?auto=compress&cs=tinysrgb&w=400'
        },
        link: '/memory/mem5'
      }
    ];
    
    // Apply filters
    let filtered = [...mockNotifications];
    
    // Filter by read status
    if (filter === 'unread') {
      filtered = filtered.filter(notification => !notification.isRead);
    }
    
    // Filter by tab
    if (selectedTab === 'family') {
      filtered = filtered.filter(notification => 
        ['join', 'invite'].includes(notification.type)
      );
    } else if (selectedTab === 'memories') {
      filtered = filtered.filter(notification => 
        ['upload', 'comment', 'like', 'mention', 'tag', 'share'].includes(notification.type)
      );
    } else if (selectedTab === 'system') {
      filtered = filtered.filter(notification => 
        ['game', 'view'].includes(notification.type)
      );
    }
    
    // Sort by pinned first, then by timestamp
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    
    setNotifications(filtered);
    setLoading(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleTogglePin = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isPinned: !notification.isPinned } 
          : notification
      )
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'upload': return Upload;
      case 'comment': return MessageCircle;
      case 'like': return Heart;
      case 'mention': return AtSign;
      case 'join': return User;
      case 'game': return Gamepad2;
      case 'view': return Eye;
      case 'tag': return Tag;
      case 'share': return Share2;
      case 'invite': return Mail;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'upload': return 'bg-blue-100 text-blue-600';
      case 'comment': return 'bg-green-100 text-green-600';
      case 'like': return 'bg-red-100 text-red-600';
      case 'mention': return 'bg-purple-100 text-purple-600';
      case 'join': return 'bg-indigo-100 text-indigo-600';
      case 'game': return 'bg-orange-100 text-orange-600';
      case 'view': return 'bg-gray-100 text-gray-600';
      case 'tag': return 'bg-yellow-100 text-yellow-600';
      case 'share': return 'bg-teal-100 text-teal-600';
      case 'invite': return 'bg-pink-100 text-pink-600';
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
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) return null;

  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className={`
        absolute right-0 top-0 bottom-0 
        ${isMobile ? 'w-full' : 'w-96'} 
        bg-white shadow-xl flex flex-col
        transform transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-sage-600" />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <TouchOptimized>
              <button
                onClick={onSettingsClick}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Notification settings"
              >
                <Settings size={20} />
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close notifications"
              >
                <X size={20} />
              </button>
            </TouchOptimized>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <TouchOptimized>
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'all'
                  ? 'border-sage-500 text-sage-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setSelectedTab('family')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'family'
                  ? 'border-sage-500 text-sage-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Family
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setSelectedTab('memories')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'memories'
                  ? 'border-sage-500 text-sage-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Memories
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setSelectedTab('system')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                selectedTab === 'system'
                  ? 'border-sage-500 text-sage-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              System
            </button>
          </TouchOptimized>
        </div>
        
        {/* Filters */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TouchOptimized>
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'all'
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filter === 'unread'
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Unread
              </button>
            </TouchOptimized>
          </div>
          
          {unreadCount > 0 && (
            <TouchOptimized>
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-sage-600 hover:text-sage-700 font-medium"
              >
                Mark all as read
              </button>
            </TouchOptimized>
          )}
        </div>
        
        {/* Notification List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            // Loading state
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="p-4 border-b border-gray-100 animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            // Empty state
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? "You've read all your notifications."
                  : selectedTab !== 'all'
                  ? `No ${selectedTab} notifications to show.`
                  : "You don't have any notifications yet."}
              </p>
            </div>
          ) : (
            // Notification items
            notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`
                  p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors
                  ${notification.isRead ? '' : 'bg-sage-50'}
                  ${notification.isPinned ? 'border-l-4 border-l-sage-500' : ''}
                `}
              >
                <div className="flex items-start space-x-3">
                  {/* Icon or Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {notification.actor ? (
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          {notification.actor.avatar ? (
                            <img 
                              src={notification.actor.avatar} 
                              alt={notification.actor.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                      ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                          {React.createElement(getNotificationIcon(notification.type), { size: 20 })}
                        </div>
                      )}
                      
                      {/* Type Indicator */}
                      {notification.actor && (
                        <div className={`absolute -bottom-1 -right-1 p-1 rounded-full ${getNotificationColor(notification.type)}`}>
                          {React.createElement(getNotificationIcon(notification.type), { size: 12 })}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {notification.title}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-1 ml-2">
                        {!notification.isRead && (
                          <TouchOptimized>
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-sage-600 hover:bg-sage-50 rounded-full transition-colors"
                              aria-label="Mark as read"
                            >
                              <Check size={16} />
                            </button>
                          </TouchOptimized>
                        )}
                        
                        <TouchOptimized>
                          <button
                            onClick={() => handleTogglePin(notification.id)}
                            className={`p-1 rounded-full transition-colors ${
                              notification.isPinned
                                ? 'text-sage-600 hover:text-sage-700 hover:bg-sage-50'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                            }`}
                            aria-label={notification.isPinned ? "Unpin notification" : "Pin notification"}
                          >
                            <Pin size={16} />
                          </button>
                        </TouchOptimized>
                        
                        <TouchOptimized>
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            aria-label="Delete notification"
                          >
                            <Trash2 size={16} />
                          </button>
                        </TouchOptimized>
                      </div>
                    </div>
                    
                    {/* Memory Preview */}
                    {notification.memory && (
                      <TouchOptimized>
                        <Link
                          to={notification.link || '#'}
                          className="mt-2 flex items-center space-x-3 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {notification.memory.thumbnail ? (
                            <img 
                              src={notification.memory.thumbnail} 
                              alt={notification.memory.title}
                              className="w-12 h-12 object-cover rounded"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-500" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-gray-900 truncate">
                              {notification.memory.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              View memory
                            </p>
                          </div>
                        </Link>
                      </TouchOptimized>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <Link
            to="/notifications/settings"
            className="flex items-center justify-center space-x-2 text-sage-600 hover:text-sage-700 font-medium"
            onClick={onSettingsClick}
          >
            <Settings size={16} />
            <span>Notification Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}