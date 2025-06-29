import React, { useState, useEffect } from 'react';
import { 
  Bell, Filter, Calendar, Clock, User, 
  Heart, MessageCircle, Upload, Eye, Tag, 
  Gamepad2, Share2, Download, Settings
} from 'lucide-react';
import { ActivityFeed } from '../components/activity/ActivityFeed';
import { NotificationSettings } from '../components/communication/NotificationSettings';
import { NotificationCenter } from '../components/communication/NotificationCenter';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

export function ActivityPage() {
  const { isMobile } = useDeviceDetection();
  const [activeTab, setActiveTab] = useState<'activity' | 'notifications'>('activity');
  const [filter, setFilter] = useState<'all' | 'uploads' | 'comments' | 'likes' | 'games' | 'members'>('all');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSaveNotificationSettings = async (settings: any) => {
    // In a real app, this would save the settings to your backend
    console.log('Saving notification settings:', settings);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close settings
    setShowSettings(false);
  };

  const filterOptions = [
    { id: 'all', label: 'All Activity', icon: Clock },
    { id: 'uploads', label: 'Uploads', icon: Upload },
    { id: 'comments', label: 'Comments', icon: MessageCircle },
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'members', label: 'Members', icon: User }
  ];

  const dateRangeOptions = [
    { id: 'all', label: 'All Time' },
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Bell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Family Activity</h1>
            <p className="text-lg text-gray-600">
              Stay updated on what's happening in your family
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <TouchOptimized>
            <button
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-sage-500 text-sage-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock size={20} />
                <span>Activity Feed</span>
              </div>
            </button>
          </TouchOptimized>
          
          <TouchOptimized>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-sage-500 text-sage-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Bell size={20} />
                <span>Notifications</span>
              </div>
            </button>
          </TouchOptimized>
        </div>
        
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-3">
            {/* Activity Type Filter */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-transparent border-none text-sm text-gray-700 focus:ring-0 focus:outline-none"
              >
                {filterOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date Range Filter */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="bg-transparent border-none text-sm text-gray-700 focus:ring-0 focus:outline-none"
              >
                {dateRangeOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Settings Button */}
            <div className="ml-auto">
              <TouchOptimized>
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings size={16} />
                  <span className="text-sm">Settings</span>
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="space-y-6">
        {activeTab === 'activity' ? (
          <ActivityFeed
            familyId="family1"
            filter={filter}
            showHeader={false}
            showFilters={false}
            className="min-h-[600px]"
          />
        ) : (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Notification Center</h2>
              <TouchOptimized>
                <button
                  onClick={() => setShowNotificationCenter(true)}
                  className="text-sage-600 hover:text-sage-700 font-medium text-sm"
                >
                  View All
                </button>
              </TouchOptimized>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Upload size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Uploads</p>
                    <p className="text-xs text-gray-500">Get notified when family members upload new memories</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <MessageCircle size={16} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Comments</p>
                    <p className="text-xs text-gray-500">Get notified when someone comments on your memories</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-100 p-2 rounded-full">
                    <Heart size={16} className="text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Likes & Reactions</p>
                    <p className="text-xs text-gray-500">Get notified when someone likes your memories</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-100 p-2 rounded-full">
                    <Tag size={16} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Tags</p>
                    <p className="text-xs text-gray-500">Get notified when you're tagged in memories</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                </label>
              </div>
              
              <TouchOptimized>
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full text-center text-sage-600 hover:text-sage-700 font-medium py-2"
                >
                  View All Notification Settings
                </button>
              </TouchOptimized>
            </div>
          </div>
        )}
        
        {/* Activity Stats */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Overview</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-sm text-gray-600">Uploads</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">128</p>
              <p className="text-sm text-gray-600">Comments</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-red-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">215</p>
              <p className="text-sm text-gray-600">Likes</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="bg-purple-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">1,432</p>
              <p className="text-sm text-gray-600">Views</p>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-base font-medium text-gray-900 mb-3">Most Active Family Members</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-700">Mom</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Upload size={14} />
                  <span>15 uploads</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-700">Dad</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <MessageCircle size={14} />
                  <span>24 comments</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm text-gray-700">Grandma</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Heart size={14} />
                  <span>42 likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification Settings Modal */}
      {showSettings && (
        <NotificationSettings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveNotificationSettings}
        />
      )}
      
      {/* Notification Center Modal */}
      {showNotificationCenter && (
        <NotificationCenter
          isOpen={showNotificationCenter}
          onClose={() => setShowNotificationCenter(false)}
          onSettingsClick={() => {
            setShowNotificationCenter(false);
            setShowSettings(true);
          }}
        />
      )}
    </div>
  );
}