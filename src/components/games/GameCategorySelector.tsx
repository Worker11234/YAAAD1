import React from 'react';
import { TouchOptimized } from '../ui/TouchOptimized';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface GameCategorySelectorProps {
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function GameCategorySelector({
  categories,
  activeCategory,
  onSelectCategory,
  className = ''
}: GameCategorySelectorProps) {
  const { isMobile } = useDeviceDetection();

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Game Categories</h2>
      </div>
      
      <div className="flex overflow-x-auto pb-2 space-x-3">
        {categories.map(category => (
          <TouchOptimized key={category.id}>
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon size={isMobile ? 16 : 20} />
              <span className="font-medium">{category.name}</span>
            </button>
          </TouchOptimized>
        ))}
      </div>
    </div>
  );
}