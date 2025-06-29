import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Accessibility, 
  Database, Users, Palette, Search, ChevronRight, 
  Camera, Globe, Clock, Moon, Sun, Smartphone, LogOut, Trash2, Download, Lock, Mail,
  Save, AlertTriangle, Check, X, Loader2, CreditCard
} from 'lucide-react';
import { ArrowLeft } from '../ui/ArrowLeft';
import { TouchOptimized } from '../ui/TouchOptimized';
import { Grid } from '../ui/Grid';
import { List } from '../ui/List';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { useAuth } from '../../hooks/useAuth';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';
import { LanguageSelector } from './LanguageSelector';
import { ColorThemeSelector } from './ColorThemeSelector';
import { Link, useNavigate } from 'react-router-dom';
import { SettingsProfileSection } from './SettingsProfileSection';
import { DeleteAccountSection } from './DeleteAccountSection';
import { useSubscription } from '../../hooks/useSubscription';
import { SubscriptionTier } from '../../lib/revenuecat';

export function SettingsPage() {
  const { isMobile } = useDeviceDetection();
  const { user, signOut } = useAuth();
  const { subscriptionTier, isSubscribed } = useSubscription();
  const navigate = useNavigate();
  
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // User Profile Settings
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [relationship, setRelationship] = useState(user?.user_metadata?.relationship || '');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [language, setLanguage] = useState('en');
  
  // Privacy & Security Settings
  const [defaultVisibility, setDefaultVisibility] = useState<'private' | 'family' | 'public'>('family');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [locationTagging, setLocationTagging] = useState(true);
  const [faceRecognition, setFaceRecognition] = useState(true);
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [familyActivityAlerts, setFamilyActivityAlerts] = useState(true);
  const [gameReminders, setGameReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [doNotDisturb, setDoNotDisturb] = useState(false);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState('22:00');
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState('07:00');
  
  // Accessibility Settings
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'x-large'>('medium');
  const [highContrast, setHighContrast] = useState(false);
  const [colorBlindMode, setColorBlindMode] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReaderOptimized, setScreenReaderOptimized] = useState(false);
  
  // Memory Management Settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [aiTaggingSensitivity, setAiTaggingSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [locationServices, setLocationServices] = useState(true);
  
  // App Preferences
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect will happen automatically due to auth state change
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Get tier name
  const getTierName = (tier: SubscriptionTier) => {
    switch (tier) {
      case SubscriptionTier.FAMILY:
        return 'Family';
      case SubscriptionTier.PREMIUM:
        return 'Premium';
      case SubscriptionTier.CARE_PLUS:
        return 'Care+';
      default:
        return 'Free';
    }
  };
  
  const settingsSections = [
    {
      id: 'profile',
      title: 'User Profile',
      icon: User,
      description: 'Manage your personal information and preferences'
    },
    {
      id: 'subscription',
      title: 'Subscription',
      icon: CreditCard,
      description: 'Manage your subscription and usage'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      description: 'Control your data and security settings'
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      description: 'Manage how you receive updates and alerts'
    },
    {
      id: 'accessibility',
      title: 'Accessibility',
      icon: Accessibility,
      description: 'Customize your experience for better usability'
    },
    {
      id: 'memory',
      title: 'Memory Management',
      icon: Database,
      description: 'Control how your memories are stored and organized'
    },
    {
      id: 'family',
      title: 'Family & Sharing',
      icon: Users,
      description: 'Manage family circle and sharing preferences'
    },
    {
      id: 'appearance',
      title: 'App Preferences',
      icon: Palette,
      description: 'Customize the look and feel of MemoryMesh'
    },
    {
      id: 'account',
      title: 'Account',
      icon: User,
      description: 'Manage your account and sign out'
    }
  ];
  
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">User Profile</h2>
      
      <SettingsProfileSection />
      
      <div className="pt-4">
        <p className="text-sm text-gray-600 mb-4">
          Visit your profile page to update your personal information, photo, and preferences.
        </p>
        
        <TouchOptimized>
          <Link
            to="/profile"
            className="inline-flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
          >
            <User size={18} />
            <span>Go to Profile</span>
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
  
  const renderSubscriptionSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Subscription</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
            <p className="text-gray-600">
              {isSubscribed 
                ? `You are currently on the ${getTierName(subscriptionTier)} plan` 
                : 'You are currently on the Free plan'}
            </p>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isSubscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {getTierName(subscriptionTier)}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Storage Limit</span>
            <span className="font-medium text-gray-900">
              {subscriptionTier === SubscriptionTier.FREE ? '1 GB' :
               subscriptionTier === SubscriptionTier.FAMILY ? '50 GB' :
               subscriptionTier === SubscriptionTier.PREMIUM ? '200 GB' : '500 GB'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">AI Requests</span>
            <span className="font-medium text-gray-900">
              {subscriptionTier === SubscriptionTier.FREE ? '100/month' :
               subscriptionTier === SubscriptionTier.FAMILY ? '500/month' :
               subscriptionTier === SubscriptionTier.PREMIUM ? '2,000/month' : 'Unlimited'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Family Members</span>
            <span className="font-medium text-gray-900">
              {subscriptionTier === SubscriptionTier.FREE ? '5 members' : 'Unlimited'}
            </span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <TouchOptimized>
              <Link
                to="/subscription"
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors"
              >
                <CreditCard size={18} />
                <span>Manage Subscription</span>
              </Link>
            </TouchOptimized>
            
            <TouchOptimized>
              <Link
                to="/pricing"
                className={`
                  flex items-center justify-center space-x-2 px-4 py-2 rounded-lg
                  ${isSubscribed 
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                    : 'bg-sage-700 text-white hover:bg-sage-800'}
                  transition-colors
                `}
              >
                {isSubscribed ? 'Change Plan' : 'Upgrade Now'}
              </Link>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <p className="text-sm text-gray-600 mb-4">
          Visit the subscription dashboard for detailed usage information and billing history.
        </p>
        
        <TouchOptimized>
          <Link
            to="/subscription"
            className="inline-flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
          >
            <CreditCard size={18} />
            <span>Go to Subscription Dashboard</span>
          </Link>
        </TouchOptimized>
      </div>
    </div>
  );
  
  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Privacy & Security</h2>
      
      <div className="p-4 bg-sage-50 rounded-xl border border-sage-200 mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <Shield className="w-5 h-5 text-sage-700" />
          <h3 className="font-semibold text-sage-800">Enhanced Privacy Controls</h3>
        </div>
        <p className="text-sage-700 mb-3">
          For comprehensive privacy and data management options, visit our dedicated Privacy Controls page.
        </p>
        <TouchOptimized>
          <Link
            to="/privacy"
            className="inline-flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 transition-colors"
          >
            <Shield size={16} />
            <span>Privacy Controls</span>
          </Link>
        </TouchOptimized>
      </div>
      
      {/* Default Memory Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Memory Visibility
        </label>
        <div className="space-y-2">
          <TouchOptimized>
            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'private'}
                onChange={() => setDefaultVisibility('private')}
                className="text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Private</span>
                <p className="text-xs text-gray-500">Only you can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'family'}
                onChange={() => setDefaultVisibility('family')}
                className="text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Family Only</span>
                <p className="text-xs text-gray-500">Only your family members can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
          
          <TouchOptimized>
            <label className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="visibility"
                checked={defaultVisibility === 'public'}
                onChange={() => setDefaultVisibility('public')}
                className="text-sage-600 focus:ring-sage-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-900">Public</span>
                <p className="text-xs text-gray-500">Anyone with the link can see these memories</p>
              </div>
            </label>
          </TouchOptimized>
        </div>
      </div>
      
      {/* Two-Factor Authentication */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Two-Factor Authentication
            </label>
            <p className="text-xs text-gray-500">
              Add an extra layer of security to your account
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        {twoFactorEnabled && (
          <div className="mt-3 p-3 bg-sage-50 rounded-lg border border-sage-200">
            <p className="text-sm text-sage-700 mb-2">
              Two-factor authentication is enabled for your account.
            </p>
            <TouchOptimized>
              <button className="text-sm text-sage-700 font-medium">
                Manage 2FA Settings
              </button>
            </TouchOptimized>
          </div>
        )}
      </div>
      
      {/* Location Tagging */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Tagging
          </label>
          <p className="text-xs text-gray-500">
            Automatically add location data to your memories
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={locationTagging}
            onChange={() => setLocationTagging(!locationTagging)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Face Recognition */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Face Recognition
          </label>
          <p className="text-xs text-gray-500">
            Allow AI to recognize family members in photos
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={faceRecognition}
            onChange={() => setFaceRecognition(!faceRecognition)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Change Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <TouchOptimized>
          <button className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            <Lock size={18} />
            <span>Change Password</span>
          </button>
        </TouchOptimized>
      </div>
    </div>
  );
  
  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'subscription':
        return renderSubscriptionSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.map((section) => (
              <TouchOptimized key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-sage-100 p-3 rounded-lg">
                      <section.icon className="w-6 h-6 text-sage-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <p className="text-sm text-gray-600">{section.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </TouchOptimized>
            ))}
          </div>
        );
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-lg text-gray-600">
              Customize your MemoryMesh experience
            </p>
          </div>
        </div>
        
        {/* Search Settings (Desktop) */}
        {!isMobile && activeSection === null && (
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search settings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            />
          </div>
        )}
      </div>
      
      {/* Settings Content */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        {/* Back Button (when in a section) */}
        {activeSection && (
          <div className="mb-4">
            <TouchOptimized>
              <button
                onClick={() => setActiveSection(null)}
                className="flex items-center space-x-2 text-sage-600 hover:text-sage-700 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Settings</span>
              </button>
            </TouchOptimized>
          </div>
        )}
        
        {renderSettingsContent()}
      </div>
      
      {/* Save Button (when in a section) */}
      {activeSection && activeSection !== 'account' && activeSection !== 'profile' && activeSection !== 'subscription' && (
        <div className="flex justify-end mb-8">
          <TouchOptimized>
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center space-x-2 bg-sage-700 text-white px-6 py-3 rounded-xl font-medium hover:bg-sage-800 disabled:opacity-50 transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Settings</span>
                </>
              )}
            </button>
          </TouchOptimized>
        </div>
      )}
      
      {/* Success Message */}
      {saveSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50">
          <Check size={20} className="text-green-600" />
          <span>Settings saved successfully!</span>
        </div>
      )}
      
      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-sage-100 p-3 rounded-full">
                <LogOut className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Sign Out?</h3>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to sign out of your account?
            </p>
            
            <div className="flex space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleLogout}
                  className="flex-1 bg-sage-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-sage-800 transition-colors"
                >
                  Sign Out
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}