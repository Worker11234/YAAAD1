import React, { useState } from 'react';
import { 
  Bell, X, Upload, MessageCircle, Heart, User, 
  Gamepad2, Eye, Tag, Share2, Mail, Clock, Save,
  AlertTriangle, Check, AtSign, Info, Layers
} from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface NotificationCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NotificationChannel {
  id: string;
  name: string;
  description: string;
}

interface NotificationSetting {
  categoryId: string;
  channelId: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: NotificationSetting[]) => Promise<void>;
}

export function NotificationSettings({
  isOpen,
  onClose,
  onSave
}: NotificationSettingsProps) {
  const { isMobile } = useDeviceDetection();
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [doNotDisturbEnabled, setDoNotDisturbEnabled] = useState(false);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState('22:00');
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState('08:00');
  const [emailDigestEnabled, setEmailDigestEnabled] = useState(true);
  const [emailDigestFrequency, setEmailDigestFrequency] = useState('daily');

  // Categories of notifications
  const categories: NotificationCategory[] = [
    { id: 'uploads', name: 'Uploads', description: 'New photos, videos, and stories', icon: Upload },
    { id: 'comments', name: 'Comments', description: 'Comments on memories', icon: MessageCircle },
    { id: 'likes', name: 'Likes & Reactions', description: 'When someone likes your memories', icon: Heart },
    { id: 'mentions', name: 'Mentions', description: 'When someone mentions you', icon: AtSign },
    { id: 'members', name: 'Family Members', description: 'New members and invitations', icon: User },
    { id: 'games', name: 'Memory Games', description: 'Game completions and high scores', icon: Gamepad2 },
    { id: 'views', name: 'Memory Views', description: 'When memories get significant views', icon: Eye },
    { id: 'tags', name: 'Tags', description: 'When you are tagged in memories', icon: Tag },
    { id: 'shares', name: 'Shares', description: 'When memories are shared with you', icon: Share2 },
    { id: 'system', name: 'System', description: 'Important account updates', icon: Bell }
  ];

  // Notification channels
  const channels: NotificationChannel[] = [
    { id: 'inapp', name: 'In-App', description: 'Notifications within Yaadein' },
    { id: 'email', name: 'Email', description: 'Receive emails for important updates' },
    { id: 'push', name: 'Push', description: 'Notifications on your device when app is closed' }
  ];

  // Fetch current settings
  React.useEffect(() => {
    if (isOpen) {
      fetchSettings();
    }
  }, [isOpen]);

  const fetchSettings = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in a real app, this would come from your API
    const mockSettings: NotificationSetting[] = [];
    
    // Generate default settings for all combinations
    categories.forEach(category => {
      channels.forEach(channel => {
        // Default most things to enabled, with some exceptions
        let defaultEnabled = true;
        
        // Make email notifications more selective by default
        if (channel.id === 'email') {
          defaultEnabled = ['uploads', 'mentions', 'members', 'system'].includes(category.id);
        }
        
        // Make push notifications more selective by default
        if (channel.id === 'push') {
          defaultEnabled = ['uploads', 'mentions', 'comments', 'members', 'system'].includes(category.id);
        }
        
        mockSettings.push({
          categoryId: category.id,
          channelId: channel.id,
          enabled: defaultEnabled
        });
      });
    });
    
    setSettings(mockSettings);
    setLoading(false);
  };

  const handleToggleSetting = (categoryId: string, channelId: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.categoryId === categoryId && setting.channelId === channelId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleToggleAllForCategory = (categoryId: string, enabled: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.categoryId === categoryId
          ? { ...setting, enabled }
          : setting
      )
    );
  };

  const handleToggleAllForChannel = (channelId: string, enabled: boolean) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.channelId === channelId
          ? { ...setting, enabled }
          : setting
      )
    );
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save settings
      await onSave(settings);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving notification settings:', error);
      setSaveError('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const isCategoryEnabled = (categoryId: string) => {
    const categorySettings = settings.filter(setting => setting.categoryId === categoryId);
    return categorySettings.every(setting => setting.enabled);
  };

  const isCategoryPartiallyEnabled = (categoryId: string) => {
    const categorySettings = settings.filter(setting => setting.categoryId === categoryId);
    const enabledCount = categorySettings.filter(setting => setting.enabled).length;
    return enabledCount > 0 && enabledCount < categorySettings.length;
  };

  const isChannelEnabled = (channelId: string) => {
    const channelSettings = settings.filter(setting => setting.channelId === channelId);
    return channelSettings.every(setting => setting.enabled);
  };

  const isChannelPartiallyEnabled = (channelId: string) => {
    const channelSettings = settings.filter(setting => setting.channelId === channelId);
    const enabledCount = channelSettings.filter(setting => setting.enabled).length;
    return enabledCount > 0 && enabledCount < channelSettings.length;
  };

  const isSettingEnabled = (categoryId: string, channelId: string) => {
    return settings.find(
      setting => setting.categoryId === categoryId && setting.channelId === channelId
    )?.enabled || false;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className={`
        absolute right-0 top-0 bottom-0 
        ${isMobile ? 'w-full' : 'w-[600px]'} 
        bg-white shadow-xl flex flex-col
        transform transition-transform duration-300 ease-in-out
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-6 h-6 text-sage-600" />
            <h2 className="text-xl font-bold text-gray-900">Notification Settings</h2>
          </div>
          
          <TouchOptimized>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close notification settings"
            >
              <X size={20} />
            </button>
          </TouchOptimized>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            // Loading state
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                    <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Do Not Disturb */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-sage-600" />
                  Do Not Disturb
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-700">Pause notifications during specific hours</p>
                    <p className="text-sm text-gray-500 mt-1">
                      You'll still receive notifications, but they won't make sounds or appear as alerts
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={doNotDisturbEnabled}
                      onChange={() => setDoNotDisturbEnabled(!doNotDisturbEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                  </label>
                </div>
                
                {doNotDisturbEnabled && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={doNotDisturbStart}
                        onChange={(e) => setDoNotDisturbStart(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={doNotDisturbEnd}
                        onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Email Digest */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-sage-600" />
                  Email Digest
                </h3>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-gray-700">Receive a summary of activity by email</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Instead of individual emails, get a digest of all activity
                    </p>
                  </div>
                  
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={emailDigestEnabled}
                      onChange={() => setEmailDigestEnabled(!emailDigestEnabled)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
                  </label>
                </div>
                
                {emailDigestEnabled && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={emailDigestFrequency}
                      onChange={(e) => setEmailDigestFrequency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                )}
              </div>
              
              {/* Notification Matrix */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 w-1/3">
                          Category
                        </th>
                        {channels.map(channel => (
                          <th key={channel.id} className="py-3 px-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200">
                            <div className="flex flex-col items-center">
                              <span>{channel.name}</span>
                              <div className="mt-2">
                                <TouchOptimized>
                                  <button
                                    onClick={() => handleToggleAllForChannel(
                                      channel.id, 
                                      !isChannelEnabled(channel.id) && (!isChannelPartiallyEnabled(channel.id) || isChannelEnabled(channel.id))
                                    )}
                                    className={`w-5 h-5 border rounded ${
                                      isChannelEnabled(channel.id)
                                        ? 'bg-sage-600 border-sage-600 text-white'
                                        : isChannelPartiallyEnabled(channel.id)
                                        ? 'bg-sage-200 border-sage-300'
                                        : 'bg-white border-gray-300'
                                    } flex items-center justify-center`}
                                    aria-label={`Toggle all ${channel.name} notifications`}
                                  >
                                    {isChannelEnabled(channel.id) && <Check size={12} />}
                                    {isChannelPartiallyEnabled(channel.id) && <div className="w-2 h-2 bg-sage-600 rounded-sm"></div>}
                                  </button>
                                </TouchOptimized>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map(category => (
                        <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${
                                category.id === 'uploads' ? 'bg-blue-100 text-blue-600' :
                                category.id === 'comments' ? 'bg-green-100 text-green-600' :
                                category.id === 'likes' ? 'bg-red-100 text-red-600' :
                                category.id === 'mentions' ? 'bg-purple-100 text-purple-600' :
                                category.id === 'members' ? 'bg-indigo-100 text-indigo-600' :
                                category.id === 'games' ? 'bg-orange-100 text-orange-600' :
                                category.id === 'views' ? 'bg-gray-100 text-gray-600' :
                                category.id === 'tags' ? 'bg-yellow-100 text-yellow-600' :
                                category.id === 'shares' ? 'bg-teal-100 text-teal-600' :
                                'bg-sage-100 text-sage-600'
                              }`}>
                                <category.icon size={16} />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-gray-900">{category.name}</span>
                                  <TouchOptimized>
                                    <button
                                      onClick={() => handleToggleAllForCategory(
                                        category.id, 
                                        !isCategoryEnabled(category.id) && (!isCategoryPartiallyEnabled(category.id) || isCategoryEnabled(category.id))
                                      )}
                                      className={`w-4 h-4 border rounded ${
                                        isCategoryEnabled(category.id)
                                          ? 'bg-sage-600 border-sage-600 text-white'
                                          : isCategoryPartiallyEnabled(category.id)
                                          ? 'bg-sage-200 border-sage-300'
                                          : 'bg-white border-gray-300'
                                      } flex items-center justify-center`}
                                      aria-label={`Toggle all ${category.name} notifications`}
                                    >
                                      {isCategoryEnabled(category.id) && <Check size={10} />}
                                      {isCategoryPartiallyEnabled(category.id) && <div className="w-1.5 h-1.5 bg-sage-600 rounded-sm"></div>}
                                    </button>
                                  </TouchOptimized>
                                </div>
                                <p className="text-xs text-gray-500">{category.description}</p>
                              </div>
                            </div>
                          </td>
                          {channels.map(channel => (
                            <td key={`${category.id}-${channel.id}`} className="py-3 px-4 text-center">
                              <TouchOptimized>
                                <button
                                  onClick={() => handleToggleSetting(category.id, channel.id)}
                                  className={`w-6 h-6 border rounded ${
                                    isSettingEnabled(category.id, channel.id)
                                      ? 'bg-sage-600 border-sage-600 text-white'
                                      : 'bg-white border-gray-300'
                                  } flex items-center justify-center mx-auto`}
                                  aria-label={`Toggle ${category.name} ${channel.name} notifications`}
                                >
                                  {isSettingEnabled(category.id, channel.id) && <Check size={14} />}
                                </button>
                              </TouchOptimized>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="flex items-center">
                    <Info className="w-4 h-4 mr-2 text-gray-500" />
                    In-App notifications always appear in the notification center.
                  </p>
                  <p className="flex items-center mt-2">
                    <Info className="w-4 h-4 mr-2 text-gray-500" />
                    Push notifications require permission from your browser or device.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          {saveSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <Check className="w-5 h-5 mr-2 text-green-600" />
              Settings saved successfully!
            </div>
          )}
          
          {saveError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
              {saveError}
            </div>
          )}
          
          <div className="flex justify-end space-x-3">
            <TouchOptimized>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </TouchOptimized>
            
            <TouchOptimized>
              <button
                onClick={handleSaveSettings}
                disabled={loading || saving}
                className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-lg hover:bg-sage-700 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
    </div>
  );
}