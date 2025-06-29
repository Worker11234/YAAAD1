import React, { useState, useEffect } from 'react';
import { ResponsiveHeader } from './ResponsiveHeader';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from '../ui/MobileNavigation';
import { BreadcrumbNavigation } from '../navigation/BreadcrumbNavigation';
import { OfflineIndicator } from '../ui/OfflineIndicator';
import { InstallPrompt } from '../ui/InstallPrompt';
import { KeyboardNavigation } from '../navigation/KeyboardNavigation';
import { useDeviceDetection } from '../../hooks/useDeviceDetection';
import { UploadButton } from '../upload/UploadButton';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import { WelcomeTour } from '../ui/WelcomeTour';
import { FeedbackForm } from '../ui/FeedbackForm';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { NotificationCenter } from '../communication/NotificationCenter';
import { NotificationSettings } from '../communication/NotificationSettings';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isMobile } = useDeviceDetection();
  const [showTour, setShowTour] = useLocalStorage('memorymesh_show_tour', true);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  
  // Show feedback form after 5 minutes of usage
  useEffect(() => {
    const timer = setTimeout(() => {
      const hasGivenFeedback = localStorage.getItem('memorymesh_feedback_given');
      if (!hasGivenFeedback) {
        setShowFeedback(true);
      }
    }, 5 * 60 * 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Tour steps
  const tourSteps = [
    {
      target: '.header-logo',
      title: 'Welcome to Yaadein',
      content: 'This is your family memory preservation platform. Let\'s take a quick tour to help you get started.',
      position: 'bottom'
    },
    {
      target: '.sidebar-nav',
      title: 'Navigation',
      content: 'Use the sidebar to navigate between different sections of the app.',
      position: 'right'
    },
    {
      target: '.upload-button',
      title: 'Upload Memories',
      content: 'Click here to add new photos, videos, audio recordings, or written stories.',
      position: 'bottom'
    },
    {
      target: '.search-bar',
      title: 'Search',
      content: 'Quickly find memories by searching for people, places, dates, or tags.',
      position: 'bottom'
    },
    {
      target: '.timeline-view',
      title: 'Timeline',
      content: 'View your family memories organized chronologically.',
      position: 'left'
    }
  ];
  
  const handleTourComplete = () => {
    setShowTour(false);
    localStorage.setItem('memorymesh_tour_completed', 'true');
  };
  
  const handleFeedbackSubmit = (feedback: { rating: number; comment: string; email?: string }) => {
    // In a real app, you would send this to your backend
    console.log('Feedback submitted:', feedback);
    localStorage.setItem('memorymesh_feedback_given', 'true');
  };

  const handleNotificationClick = () => {
    setShowNotifications(true);
  };

  const handleSaveNotificationSettings = async (settings: any) => {
    // In a real app, this would save the settings to your backend
    console.log('Saving notification settings:', settings);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Close settings
    setShowNotificationSettings(false);
  };

  return (
    <div className="min-h-screen bg-sage-50">
      {/* Global Components */}
      <OfflineIndicator />
      <InstallPrompt />
      <KeyboardNavigation />
      
      {/* Header */}
      <ResponsiveHeader 
        onSearchSubmit={(query) => console.log('Search:', query)}
        onNotificationClick={handleNotificationClick}
      />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-0" role="main">
          <div className={`p-4 sm:p-6 lg:p-8 ${isMobile ? 'pb-20' : ''}`}>
            {/* Breadcrumb Navigation */}
            <BreadcrumbNavigation />
            
            {/* Page Content */}
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Quick Action FAB */}
      <UploadButton variant="fab" className="upload-button" />
      
      {/* Welcome Tour */}
      {showTour && (
        <WelcomeTour
          steps={tourSteps}
          isOpen={showTour}
          onClose={() => setShowTour(false)}
          onComplete={handleTourComplete}
        />
      )}
      
      {/* Feedback Form */}
      {showFeedback && (
        <FeedbackForm
          isOpen={showFeedback}
          onClose={() => setShowFeedback(false)}
          onSubmit={handleFeedbackSubmit}
        />
      )}

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          onSettingsClick={() => {
            setShowNotifications(false);
            setShowNotificationSettings(true);
          }}
        />
      )}

      {/* Notification Settings */}
      {showNotificationSettings && (
        <NotificationSettings
          isOpen={showNotificationSettings}
          onClose={() => setShowNotificationSettings(false)}
          onSave={handleSaveNotificationSettings}
        />
      )}
    </div>
  );
}