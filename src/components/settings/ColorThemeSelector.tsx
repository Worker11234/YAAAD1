import React, { useState } from 'react';
import { Check, Palette } from 'lucide-react';
import { TouchOptimized } from '../ui/TouchOptimized';

interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
}

export function ColorThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState('sage');

  const colorThemes: ColorTheme[] = [
    {
      id: 'sage',
      name: 'Sage Garden',
      primary: '#2d5738',
      secondary: '#e8f5e8',
      accent: '#4a7c59'
    },
    {
      id: 'lavender',
      name: 'Lavender Dreams',
      primary: '#7c3aed',
      secondary: '#f3e8ff',
      accent: '#a78bfa'
    },
    {
      id: 'ocean',
      name: 'Ocean Blue',
      primary: '#1e40af',
      secondary: '#dbeafe',
      accent: '#3b82f6'
    },
    {
      id: 'sunset',
      name: 'Warm Sunset',
      primary: '#b45309',
      secondary: '#fef3c7',
      accent: '#f59e0b'
    },
    {
      id: 'rose',
      name: 'Rose Garden',
      primary: '#be185d',
      secondary: '#fce7f3',
      accent: '#ec4899'
    },
    {
      id: 'forest',
      name: 'Deep Forest',
      primary: '#064e3b',
      secondary: '#d1fae5',
      accent: '#10b981'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-2">
        <Palette className="w-5 h-5 text-sage-600" />
        <p className="text-sm font-medium text-gray-700">Select a color theme for the app</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {colorThemes.map(theme => (
          <TouchOptimized key={theme.id}>
            <button
              onClick={() => setSelectedTheme(theme.id)}
              className={`relative p-4 rounded-lg border-2 transition-colors ${
                selectedTheme === theme.id
                  ? 'border-sage-500'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex space-x-2 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.secondary }}></div>
              </div>
              <p className="text-sm font-medium text-gray-900">{theme.name}</p>
              
              {selectedTheme === theme.id && (
                <div className="absolute top-2 right-2 bg-sage-600 text-white p-1 rounded-full">
                  <Check size={12} />
                </div>
              )}
            </button>
          </TouchOptimized>
        ))}
      </div>
      
      <p className="text-xs text-gray-500 mt-2">
        Theme changes will apply the next time you restart the app
      </p>
    </div>
  );
}