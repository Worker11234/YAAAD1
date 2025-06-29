import React, { useState } from 'react';
import { colors, typography, spacing, borderRadius } from '../tokens';

interface TabItem {
  id: string;
  label: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface TabsProps {
  /**
   * Array of tab items
   */
  tabs: TabItem[];
  
  /**
   * Default active tab ID
   */
  defaultActiveTab?: string;
  
  /**
   * Controlled active tab ID
   */
  activeTab?: string;
  
  /**
   * Function to call when a tab is selected
   */
  onChange?: (tabId: string) => void;
  
  /**
   * Tabs variant
   */
  variant?: 'default' | 'pills' | 'underline';
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function Tabs({
  tabs,
  defaultActiveTab,
  activeTab: controlledActiveTab,
  onChange,
  variant = 'default',
  className = '',
  ...props
}: TabsProps) {
  // Use controlled or uncontrolled active tab
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  const activeTabId = controlledActiveTab !== undefined ? controlledActiveTab : internalActiveTab;
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    if (controlledActiveTab === undefined) {
      setInternalActiveTab(tabId);
    }
    onChange?.(tabId);
  };
  
  // Variant classes
  const variantClasses = {
    default: {
      container: 'border-b border-gray-200',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-medium
        ${isActive 
          ? 'border-b-2 border-sage-500 text-sage-600' 
          : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    pills: {
      container: 'space-x-2',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-medium rounded-full
        ${isActive 
          ? 'bg-sage-100 text-sage-700' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: (isActive: boolean, isDisabled: boolean) => `
        px-4 py-2 text-sm font-medium
        ${isActive 
          ? 'text-sage-700 border-b-2 border-sage-500' 
          : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `,
    },
  };
  
  // Active tab content
  const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];
  
  return (
    <div className={className} {...props}>
      {/* Tab List */}
      <div className={`flex ${variantClasses[variant].container}`} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={`
              flex items-center transition-colors duration-200
              ${variantClasses[variant].tab(activeTabId === tab.id, !!tab.disabled)}
            `}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
            {tab.badge && <span className="ml-2">{tab.badge}</span>}
          </button>
        ))}
      </div>
      
      {/* Tab Panel */}
      <div
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.id}`}
        id={`panel-${activeTab.id}`}
        className="py-4"
      >
        {activeTab.content}
      </div>
    </div>
  );
}