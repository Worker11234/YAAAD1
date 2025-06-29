import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, LogOut, Settings, Bell, Search, Plus, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from '../ui/TouchOptimized';
import { NotificationBadge } from '../navigation/NotificationBadge';
import { UploadButton } from '../upload/UploadButton';
import SearchComponent from '../ui/animated-glowing-search-bar';

interface ResponsiveHeaderProps {
  onSearchSubmit?: (query: string) => void;
  onNotificationClick?: () => void;
  onMenuToggle?: () => void;
}

export function ResponsiveHeader({ onSearchSubmit, onNotificationClick, onMenuToggle }: ResponsiveHeaderProps) {
  const { user, signOut } = useAuth();
  const { isMobile } = useDeviceDetection();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileData, setProfileData] = useState<any>(null);
  const [logoError, setLogoError] = useState(false);

  React.useEffect(() => {
    // Fetch profile data if user is logged in
    if (user) {
      // In a real app with Supabase, we'd fetch from the database
      // For now, we'll use localStorage
      const storedProfile = localStorage.getItem('memorymesh_profile');
      if (storedProfile) {
        try {
          setProfileData(JSON.parse(storedProfile));
        } catch (error) {
          console.error('Error parsing stored profile:', error);
        }
      }
    }
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLogoError = () => {
    console.log('Logo failed to load, showing fallback');
    setLogoError(true);
  };

  const notificationCount = 3; // This would come from your state/API

  return (
    <header className="bg-white shadow-lg border-b-2 border-sage-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Left Section - Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <TouchOptimized>
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-xl text-sage-600 hover:text-sage-700 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500 lg:hidden transition-colors"
                aria-label="Toggle navigation menu"
                aria-expanded="false"
              >
                <Menu size={24} />
              </button>
            </TouchOptimized>

            <Link
              to="/dashboard"
              className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg"
            >
              {/* Custom Logo Container */}
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl shadow-md overflow-hidden bg-white border-2 border-sage-100 flex items-center justify-center">
                {!logoError ? (
                  <img
                    src="/logo.png"
                    alt="Yaadein Logo"
                    className="w-8 h-8 lg:w-10 lg:h-10 object-contain"
                    onError={handleLogoError}
                    onLoad={() => console.log('Logo loaded successfully')}
                  />
                ) : (
                  <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-sage-700" />
                )}
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold text-sage-800 app-name">Yaadein</span>
                <p className="text-xs lg:text-sm text-sage-600 -mt-1">Family Memories</p>
              </div>
            </Link>
          </div>

          {/* Center Section - Search Bar (Desktop) */}
          {!isMobile && (
            <div className="flex-1 max-w-2xl mx-8">
              <SearchComponent />
            </div>
          )}

          {/* Right Section - Actions and User Menu */}
          {user && (
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Add Memory Button */}
              <UploadButton
                variant={isMobile ? "icon" : "full"}
                label="Add Memory"
                className="shadow-md"
              />

              {/* Search Button (Mobile) */}
              {isMobile && (
                <TouchOptimized>
                  <Link
                    to="/search"
                    className="p-2 lg:p-3 rounded-xl text-sage-600 hover:text-sage-700 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
                    aria-label="Search memories"
                  >
                    <Search size={20} />
                  </Link>
                </TouchOptimized>
              )}

              {/* Privacy Button */}
              <TouchOptimized>
                <Link
                  to="/privacy"
                  className="p-2 lg:p-3 rounded-xl text-sage-600 hover:text-sage-700 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
                  aria-label="Privacy controls"
                >
                  <Shield size={20} />
                </Link>
              </TouchOptimized>

              {/* Notifications */}
              <TouchOptimized>
                <Link
                  to="/notifications"
                  className="relative p-2 lg:p-3 rounded-xl text-sage-600 hover:text-sage-700 hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
                  aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <NotificationBadge count={notificationCount} />
                  )}
                </Link>
              </TouchOptimized>

              {/* User Menu */}
              <div className="relative">
                <TouchOptimized>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 lg:space-x-3 p-2 lg:p-3 rounded-xl hover:bg-sage-50 focus:outline-none focus:ring-2 focus:ring-sage-500 transition-colors"
                    aria-label="User menu"
                    aria-expanded={showUserMenu}
                    aria-haspopup="true"
                  >
                    <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sage-100 rounded-full flex items-center justify-center overflow-hidden">
                      {profileData?.avatar_url ? (
                        <img
                          src={profileData.avatar_url}
                          alt={profileData?.full_name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={isMobile ? 16 : 20} className="text-sage-700" />
                      )}
                    </div>
                    {!isMobile && (
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">
                          {profileData?.full_name || user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    )}
                  </button>
                </TouchOptimized>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-sage-100 py-2 z-20"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      <div className="px-4 py-3 border-b border-sage-100">
                        <p className="text-base font-semibold text-gray-900">
                          {profileData?.full_name || user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>

                      <div className="py-2">
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sage-50 transition-colors focus:outline-none focus:bg-sage-50"
                          role="menuitem"
                        >
                          <User size={18} />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          to="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sage-50 transition-colors focus:outline-none focus:bg-sage-50"
                          role="menuitem"
                        >
                          <Settings size={18} />
                          <span>Settings</span>
                        </Link>

                        <Link
                          to="/privacy"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-sage-50 transition-colors focus:outline-none focus:bg-sage-50"
                          role="menuitem"
                        >
                          <Shield size={18} />
                          <span>Privacy & Data</span>
                        </Link>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            handleSignOut();
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:bg-red-50"
                          role="menuitem"
                        >
                          <LogOut size={18} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}