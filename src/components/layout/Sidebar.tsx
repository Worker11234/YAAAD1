import React from 'react';
import { X, Heart, Camera } from 'lucide-react';
import { NavigationMenu } from '../navigation/NavigationMenu';
import { TouchOptimized } from '../ui/TouchOptimized';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-80 bg-white border-r-2 border-sage-100 transform transition-transform duration-300 ease-in-out shadow-xl
          lg:translate-x-0 lg:static lg:inset-0 lg:w-64 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main navigation sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b-2 border-sage-100 lg:hidden">
            <div className="flex items-center space-x-3">
              <div className="bg-sage-700 p-3 rounded-xl">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-sage-800 app-name">Yaadein</span>
                <p className="text-sm text-sage-600 -mt-1">Family Memories</p>
              </div>
            </div>
            <TouchOptimized>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-sage-600 hover:text-sage-700 hover:bg-sage-50 transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500"
                aria-label="Close navigation menu"
              >
                <X size={24} />
              </button>
            </TouchOptimized>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <NavigationMenu isOpen={isOpen} onClose={onClose} />
          </nav>

          {/* Footer */}
          <div className="p-6 border-t-2 border-sage-100">
            <div className="bg-gradient-to-r from-sage-100 to-sage-50 rounded-xl p-4 border border-sage-200">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-sage-700 p-2 rounded-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-sage-800">Preserve Memories</h4>
                  <p className="text-xs text-sage-600">Keep stories alive</p>
                </div>
              </div>
              <p className="text-xs text-sage-600 leading-relaxed">
                Every memory you add helps preserve your family's story for generations to come.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}