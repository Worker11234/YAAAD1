import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, User, LogOut, Settings, Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { TouchOptimized } from '../ui/TouchOptimized';
import { NotificationBadge } from '../navigation/NotificationBadge';
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
    <header className="bg-black shadow-lg border-b-2 border-sage-100 sticky top-0 z-40 safe-area-inset-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-sage-500 rounded-lg"
            aria-label="Yaadein - Home"
          >
            <div className="bg-sage-700 p-2 lg:p-3 rounded-xl shadow-md">
              <Heart className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div>
              <span className="text-xl lg:text-2xl font-bold text-sage-800 app-name">Yaadein</span>
              <p className="text-xs lg:text-sm text-sage-600 -mt-1">Family Memories</p>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchComponent />
          </div>

          {/* Right Section - Notifications & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon (Mobile) */}
            <Link
              to="/search"
              className="md:hidden p-2 rounded-lg text-sage-600 hover:text-sage-700 hover:bg-sage-50 transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </Link>

            {/* Notifications */}
            <TouchOptimized>
              <button
                onClick={onNotificationClick}
                className="relative p-2 rounded-lg text-sage-600 hover:text-sage-700 hover:bg-sage-50 transition-colors"
                aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
              >
                <Bell size={20} />
                {notificationCount > 0 && (
                  <NotificationBadge count={notificationCount} />
                )}
              </button>
            </TouchOptimized>

            {/* User Menu */}
            <div className="relative">
              <TouchOptimized>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-sage-50 transition-colors"
                  aria-label="User menu"
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-sage-100 rounded-full flex items-center justify-center overflow-hidden">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt={user?.user_metadata?.full_name || 'User'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={20} className="text-sage-700" />
                    )}
                  </div>
                  <span className="hidden sm:block text-gray-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
              </TouchOptimized>

              {/* Dropdown Menu */}
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
                        {user?.user_metadata?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
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
                      
                      <button
                        onClick={handleSignOut}
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
        </div>
      </div>
    </header>
  );
}