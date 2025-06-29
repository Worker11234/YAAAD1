import React, { useState } from 'react';
import { 
  Settings, User, Bell, Shield, Accessibility, 
  Database, Users, Palette, Search, ChevronRight, 
  Camera, Globe, Clock, Moon, Sun, Smartphone, LogOut, Trash2, Download, Lock, Mail,
  Save, AlertTriangle, Check, X, Loader2
} from 'lucide-react';
import { ArrowLeft } from '../components/ui/ArrowLeft';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { Grid } from '../components/ui/Grid';
import { List } from '../components/ui/List';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';
import { ProfilePhotoUploader } from '../components/settings/ProfilePhotoUploader';
import { LanguageSelector } from '../components/settings/LanguageSelector';
import { ColorThemeSelector } from '../components/settings/ColorThemeSelector';
import { Link, useNavigate } from 'react-router-dom';
import { SettingsProfileSection } from '../components/settings/SettingsProfileSection';
import { DeleteAccountSection } from '../components/settings/DeleteAccountSection';

export function SettingsPage() {
  const { isMobile } = useDeviceDetection();
  const { user, signOut } = useAuth();
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
  
  const settingsSections = [
    {
      id: 'profile',
      title: 'User Profile',
      icon: User,
      description: 'Manage your personal information and preferences'
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
  
  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Notification Settings</h2>
      
      {/* Email Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Notifications
          </label>
          <p className="text-xs text-gray-500">
            Receive updates and alerts via email
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Push Notifications */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Push Notifications
          </label>
          <p className="text-xs text-gray-500">
            Receive alerts on your device
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={pushNotifications}
            onChange={() => setPushNotifications(!pushNotifications)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Family Activity Alerts */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Family Activity Alerts
          </label>
          <p className="text-xs text-gray-500">
            Get notified when family members add memories
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={familyActivityAlerts}
            onChange={() => setFamilyActivityAlerts(!familyActivityAlerts)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Memory Game Reminders */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Memory Game Reminders
          </label>
          <p className="text-xs text-gray-500">
            Reminders to play cognitive wellness games
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={gameReminders}
            onChange={() => setGameReminders(!gameReminders)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Weekly Summary Emails */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Weekly Summary Emails
          </label>
          <p className="text-xs text-gray-500">
            Receive a weekly digest of family activity
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={weeklySummary}
            onChange={() => setWeeklySummary(!weeklySummary)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Do Not Disturb */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Do Not Disturb
            </label>
            <p className="text-xs text-gray-500">
              Pause notifications during specific hours
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={doNotDisturb}
              onChange={() => setDoNotDisturb(!doNotDisturb)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
          </label>
        </div>
        
        {doNotDisturb && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label htmlFor="dndStart" className="block text-xs text-gray-600 mb-1">
                Start Time
              </label>
              <input
                id="dndStart"
                type="time"
                value={doNotDisturbStart}
                onChange={(e) => setDoNotDisturbStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
            </div>
            <div>
              <label htmlFor="dndEnd" className="block text-xs text-gray-600 mb-1">
                End Time
              </label>
              <input
                id="dndEnd"
                type="time"
                value={doNotDisturbEnd}
                onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Accessibility Settings</h2>
      
      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Font Size
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'small', label: 'Small' },
            { id: 'medium', label: 'Medium' },
            { id: 'large', label: 'Large' },
            { id: 'x-large', label: 'Extra Large' }
          ].map((size) => (
            <TouchOptimized key={size.id}>
              <button
                onClick={() => setFontSize(size.id as any)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  fontSize === size.id
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <span className={`
                  ${size.id === 'small' ? 'text-sm' : 
                    size.id === 'medium' ? 'text-base' : 
                    size.id === 'large' ? 'text-lg' : 'text-xl'}
                `}>
                  {size.label}
                </span>
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>
      
      {/* High Contrast Mode */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            High Contrast Mode
          </label>
          <p className="text-xs text-gray-500">
            Increase contrast for better visibility
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={highContrast}
            onChange={() => setHighContrast(!highContrast)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Color Blind Friendly */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Color Blind Friendly Mode
          </label>
          <p className="text-xs text-gray-500">
            Optimize colors for color vision deficiencies
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={colorBlindMode}
            onChange={() => setColorBlindMode(!colorBlindMode)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Reduce Motion */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reduce Motion
          </label>
          <p className="text-xs text-gray-500">
            Minimize animations and transitions
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={reduceMotion}
            onChange={() => setReduceMotion(!reduceMotion)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* Screen Reader Optimization */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Screen Reader Optimization
          </label>
          <p className="text-xs text-gray-500">
            Enhance compatibility with screen readers
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={screenReaderOptimized}
            onChange={() => setScreenReaderOptimized(!screenReaderOptimized)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
    </div>
  );
  
  const renderMemorySettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Memory Management</h2>
      
      {/* Storage Usage */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Storage Usage</h3>
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Used: 2.4 GB</span>
            <span>Total: 10 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-sage-600 h-2.5 rounded-full" style={{ width: '24%' }}></div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-600">
          <div>
            <p className="font-medium text-gray-900">1.2 GB</p>
            <p>Photos</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">0.8 GB</p>
            <p>Videos</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">0.4 GB</p>
            <p>Audio</p>
          </div>
        </div>
      </div>
      
      {/* Auto Backup */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Auto Backup
          </label>
          <p className="text-xs text-gray-500">
            Automatically backup memories to the cloud
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={autoBackup}
            onChange={() => setAutoBackup(!autoBackup)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
      
      {/* AI Tagging Sensitivity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Tagging Sensitivity
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'low', label: 'Low' },
            { id: 'medium', label: 'Medium' },
            { id: 'high', label: 'High' }
          ].map((level) => (
            <TouchOptimized key={level.id}>
              <button
                onClick={() => setAiTaggingSensitivity(level.id as any)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  aiTaggingSensitivity === level.id
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {level.label}
              </button>
            </TouchOptimized>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Higher sensitivity may identify more people and objects but with potentially lower accuracy
        </p>
      </div>
      
      {/* Location Services */}
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Location Services
          </label>
          <p className="text-xs text-gray-500">
            Allow app to access your location for tagging
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={locationServices}
            onChange={() => setLocationServices(!locationServices)}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
        </label>
      </div>
    </div>
  );
  
  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">App Preferences</h2>
      
      {/* Theme Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'light', label: 'Light', icon: Sun },
            { id: 'dark', label: 'Dark', icon: Moon },
            { id: 'system', label: 'System', icon: Smartphone }
          ].map((themeOption) => (
            <TouchOptimized key={themeOption.id}>
              <button
                onClick={() => setTheme(themeOption.id as any)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  theme === themeOption.id
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <themeOption.icon size={20} className="mb-1" />
                  <span>{themeOption.label}</span>
                </div>
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>
      
      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Color Theme
        </label>
        <ColorThemeSelector />
      </div>
      
      {/* Layout Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Layout
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'grid', label: 'Grid View', icon: Grid },
            { id: 'list', label: 'List View', icon: List }
          ].map((layoutOption) => (
            <TouchOptimized key={layoutOption.id}>
              <button
                onClick={() => setLayout(layoutOption.id as any)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  layout === layoutOption.id
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex flex-col items-center">
                  <layoutOption.icon size={20} className="mb-1" />
                  <span>{layoutOption.label}</span>
                </div>
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>
      
      {/* Card Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memory Card Size
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'small', label: 'Small' },
            { id: 'medium', label: 'Medium' },
            { id: 'large', label: 'Large' }
          ].map((sizeOption) => (
            <TouchOptimized key={sizeOption.id}>
              <button
                onClick={() => setCardSize(sizeOption.id as any)}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  cardSize === sizeOption.id
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {sizeOption.label}
              </button>
            </TouchOptimized>
          ))}
        </div>
      </div>
    </div>
  );
  
  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Account Settings</h2>
      
      {/* Account Info */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
            {user?.user_metadata?.avatar_url ? (
              <img 
                src={user.user_metadata.avatar_url} 
                alt={user.user_metadata?.full_name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-sage-600" />
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.user_metadata?.full_name || 'User'}</p>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          <p>Account created: {new Date(user?.created_at || Date.now()).toLocaleDateString()}</p>
          <p>Last login: {new Date(user?.last_sign_in_at || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>
      
      {/* Logout */}
      <div>
        <TouchOptimized>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center space-x-2 w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </TouchOptimized>
      </div>
      
      {/* Delete Account */}
      <DeleteAccountSection />
    </div>
  );
  
  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'accessibility':
        return renderAccessibilitySettings();
      case 'memory':
        return renderMemorySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'account':
        return renderAccountSettings();
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
      {activeSection && activeSection !== 'account' && activeSection !== 'profile' && (
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