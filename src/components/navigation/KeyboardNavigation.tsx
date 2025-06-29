import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  action: () => void;
  description: string;
}

export function KeyboardNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'h',
      altKey: true,
      action: () => navigate('/dashboard'),
      description: 'Go to Home/Dashboard'
    },
    {
      key: 't',
      altKey: true,
      action: () => navigate('/timeline'),
      description: 'Go to Timeline'
    },
    {
      key: 'u',
      altKey: true,
      action: () => navigate('/upload'),
      description: 'Go to Upload'
    },
    {
      key: 'f',
      altKey: true,
      action: () => navigate('/family'),
      description: 'Go to Family'
    },
    {
      key: 's',
      altKey: true,
      action: () => navigate('/search'),
      description: 'Go to Search'
    },
    {
      key: 'g',
      altKey: true,
      action: () => navigate('/games'),
      description: 'Go to Games'
    },
    {
      key: '/',
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      },
      description: 'Focus search'
    },
    {
      key: 'Escape',
      action: () => {
        // Close any open modals or menus
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement) {
          activeElement.blur();
        }
      },
      description: 'Close modals/menus'
    }
  ];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const shortcut = shortcuts.find(s => 
        s.key.toLowerCase() === event.key.toLowerCase() &&
        !!s.ctrlKey === event.ctrlKey &&
        !!s.altKey === event.altKey &&
        !!s.shiftKey === event.shiftKey
      );

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // This component doesn't render anything visible
  return null;
}