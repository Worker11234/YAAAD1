import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Search, Bell, User, ChevronDown, LogOut, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { TouchOptimized } from '../ui/TouchOptimized';
import { NotificationBadge } from '../navigation/NotificationBadge';

interface ResponsiveHeaderProps {
  onSearchSubmit?: (query: string) => void;
  onNotificationClick?: () => void;
}

export function ResponsiveHeader({ onSearchSubmit, onNotificationClick }: ResponsiveHeaderProps) {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3); // This would come from your state/API
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSubmit) {
      onSearchSubmit(searchQuery);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-sage-100 sticky top-0 z-40 safe-area-inset-top">
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
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-base border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-colors bg-white"
                placeholder="Search memories, people, or dates..."
                aria-label="Search memories"
              />
            </form>
          </div>

          {/* Right Section - Notifications & User Menu */}
          <div className="flex items-center space-x-4">
            {/* Messages */}
            <Link
              to="/messaging"
              className="hidden sm:block p-2 rounded-lg text-sage-600 hover:text-sage-700 hover:bg-sage-50 transition-colors"
              aria-label="Messages"
            >
              <MessageCircle size={20} />
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
                  <ChevronDown size={16} className="hidden sm:block text-gray-500" />
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