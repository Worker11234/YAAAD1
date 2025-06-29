import React, { useState } from 'react';
import { 
  Shield, User, Download, Trash2, Lock, Eye, EyeOff, 
  FileText, Database, AlertTriangle, Check, X, Loader2
} from 'lucide-react';
import { ArrowLeft } from '../components/ui/ArrowLeft';
import { Link } from 'react-router-dom';
import { TouchOptimized } from '../components/ui/TouchOptimized';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { useAuth } from '../hooks/useAuth';

export function PrivacyControlsPage() {
  const { isMobile } = useDeviceDetection();
  const { user } = useAuth();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Privacy Settings
  const [dataSharing, setDataSharing] = useState({
    allowAnalytics: true,
    allowPersonalization: true,
    allowThirdPartySharing: false,
    allowFaceRecognition: true,
    allowLocationTagging: true,
    allowAITagging: true
  });
  
  // Data Retention Settings
  const [dataRetention, setDataRetention] = useState({
    keepSearchHistory: '90days',
    keepActivityLogs: '1year',
    keepDeletedItems: '30days'
  });
  
  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setSuccessMessage('Your data export has been initiated. You will receive an email with download instructions shortly.');
      setShowSuccessMessage(true);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setSuccessMessage('Your account deletion request has been processed. Your account and all associated data will be permanently deleted within 30 days.');
      setShowSuccessMessage(true);
      setShowDeleteConfirm(false);
      
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/settings" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <ArrowLeft size={18} />
          <span>Back to Settings</span>
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-sage-700 p-3 rounded-xl">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy & Data Controls</h1>
            <p className="text-lg text-gray-600">
              Manage your privacy settings and data
            </p>
          </div>
        </div>
      </div>
      
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6 flex items-start">
          <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="ml-3">
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}
      
      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-sage-600" />
          Privacy Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Allow Analytics
              </label>
              <p className="text-xs text-gray-500">
                Help us improve by allowing anonymous usage data collection
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dataSharing.allowAnalytics}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowAnalytics: !prev.allowAnalytics
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Personalized Experience
              </label>
              <p className="text-xs text-gray-500">
                Allow us to personalize your experience based on your activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dataSharing.allowPersonalization}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowPersonalization: !prev.allowPersonalization
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Third-Party Data Sharing
              </label>
              <p className="text-xs text-gray-500">
                Allow sharing your data with trusted third parties
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dataSharing.allowThirdPartySharing}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowThirdPartySharing: !prev.allowThirdPartySharing
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
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
                checked={dataSharing.allowFaceRecognition}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowFaceRecognition: !prev.allowFaceRecognition
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location Tagging
              </label>
              <p className="text-xs text-gray-500">
                Allow automatic location tagging for memories
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dataSharing.allowLocationTagging}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowLocationTagging: !prev.allowLocationTagging
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                AI-Powered Tagging
              </label>
              <p className="text-xs text-gray-500">
                Allow AI to automatically tag and organize your memories
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={dataSharing.allowAITagging}
                onChange={() => setDataSharing(prev => ({
                  ...prev,
                  allowAITagging: !prev.allowAITagging
                }))}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-600"></div>
            </label>
          </div>
        </div>
      </div>
      
      {/* Data Retention */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2 text-sage-600" />
          Data Retention
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep Search History
            </label>
            <select
              value={dataRetention.keepSearchHistory}
              onChange={(e) => setDataRetention(prev => ({
                ...prev,
                keepSearchHistory: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            >
              <option value="forever">Forever</option>
              <option value="1year">1 Year</option>
              <option value="90days">90 Days</option>
              <option value="30days">30 Days</option>
              <option value="7days">7 Days</option>
              <option value="off">Don't Save</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep Activity Logs
            </label>
            <select
              value={dataRetention.keepActivityLogs}
              onChange={(e) => setDataRetention(prev => ({
                ...prev,
                keepActivityLogs: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            >
              <option value="forever">Forever</option>
              <option value="1year">1 Year</option>
              <option value="90days">90 Days</option>
              <option value="30days">30 Days</option>
              <option value="off">Don't Save</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keep Deleted Items
            </label>
            <select
              value={dataRetention.keepDeletedItems}
              onChange={(e) => setDataRetention(prev => ({
                ...prev,
                keepDeletedItems: e.target.value
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500"
            >
              <option value="90days">90 Days</option>
              <option value="30days">30 Days</option>
              <option value="7days">7 Days</option>
              <option value="immediately">Delete Immediately</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Data Export & Deletion */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-sage-600" />
          Your Data
        </h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Your Data</h3>
            <p className="text-gray-600 mb-4">
              Download a copy of all your data, including memories, comments, and account information.
            </p>
            <TouchOptimized>
              <button
                onClick={handleExportData}
                disabled={isExporting}
                className="flex items-center space-x-2 bg-sage-700 text-white px-4 py-2 rounded-lg hover:bg-sage-800 disabled:opacity-50 transition-colors"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Download size={18} />
                    <span>Export All My Data</span>
                  </>
                )}
              </button>
            </TouchOptimized>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Your Account</h3>
            <p className="text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <TouchOptimized>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 size={18} />
                <span>Delete My Account</span>
              </button>
            </TouchOptimized>
          </div>
        </div>
      </div>
      
      {/* Privacy Policy */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-sage-600" />
          Privacy Policy
        </h2>
        
        <p className="text-gray-600 mb-4">
          Our privacy policy explains how we collect, use, and protect your personal information.
        </p>
        
        <TouchOptimized>
          <Link
            to="/privacy-policy"
            className="text-sage-600 hover:text-sage-700 font-medium"
          >
            Read our Privacy Policy
          </Link>
        </TouchOptimized>
      </div>
      
      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Account?</h3>
            </div>
            
            <p className="text-gray-700 mb-2">
              This action <span className="font-semibold">cannot be undone</span>. All your memories, comments, and account data will be permanently deleted.
            </p>
            
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete your account?
            </p>
            
            <div className="flex space-x-3">
              <TouchOptimized>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </TouchOptimized>
              
              <TouchOptimized>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="animate-spin" size={18} />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Delete Account'
                  )}
                </button>
              </TouchOptimized>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}