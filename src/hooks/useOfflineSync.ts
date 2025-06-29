import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface OfflineData {
  id: string;
  type: 'memory' | 'family_member';
  data: any;
  timestamp: number;
}

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingSync, setPendingSync] = useState<OfflineData[]>([]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending data from localStorage
    loadPendingData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingData = () => {
    try {
      const stored = localStorage.getItem('memorymesh_pending_sync');
      if (stored) {
        setPendingSync(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading pending sync data:', error);
    }
  };

  const savePendingData = (data: OfflineData[]) => {
    try {
      localStorage.setItem('memorymesh_pending_sync', JSON.stringify(data));
      setPendingSync(data);
    } catch (error) {
      console.error('Error saving pending sync data:', error);
    }
  };

  const addToSyncQueue = (type: 'memory' | 'family_member', data: any) => {
    const newItem: OfflineData = {
      id: crypto.randomUUID(),
      type,
      data,
      timestamp: Date.now()
    };

    const updated = [...pendingSync, newItem];
    savePendingData(updated);

    if (isOnline) {
      syncPendingData();
    }
  };

  const syncPendingData = async () => {
    if (!isOnline || pendingSync.length === 0) return;

    const successful: string[] = [];

    for (const item of pendingSync) {
      try {
        if (supabase) {
          if (item.type === 'memory') {
            await supabase.from('memories').insert(item.data);
          } else if (item.type === 'family_member') {
            await supabase.from('family_members').insert(item.data);
          }
        } else {
          // In a real app with Supabase, you would sync the data here
          console.log(`Syncing ${item.type}:`, item.data);
          
          // Simulate successful sync
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        successful.push(item.id);
      } catch (error) {
        console.error(`Failed to sync ${item.type}:`, error);
      }
    }

    // Remove successfully synced items
    const remaining = pendingSync.filter(item => !successful.includes(item.id));
    savePendingData(remaining);
  };

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToSyncQueue,
    syncPendingData
  };
}