import React from 'react';
import { WifiOff, Wifi, Clock } from 'lucide-react';
import { useOfflineSync } from '../../hooks/useOfflineSync';

export function OfflineIndicator() {
  const { isOnline, pendingSync } = useOfflineSync();

  if (isOnline && pendingSync === 0) return null;

  return (
    <div className={`
      fixed top-4 right-4 z-50 px-3 py-2 rounded-lg shadow-lg text-sm font-medium
      ${isOnline 
        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' 
        : 'bg-red-100 text-red-800 border border-red-200'
      }
    `}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <>
            <Clock size={16} />
            <span>Syncing {pendingSync} items...</span>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <span>Offline - {pendingSync} pending</span>
          </>
        )}
      </div>
    </div>
  );
}