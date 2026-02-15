import { createContext, useContext, useState, useEffect } from 'react';
import { syncService } from '../lib/syncService';
import { useAuth } from './AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

const SyncContext = createContext({});

export function SyncProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [syncStatus, setSyncStatus] = useState({
    online: navigator.onLine,
    syncing: false,
    queueSize: 0,
  });
  const [lastSyncTime, setLastSyncTime] = useState(null);

  useEffect(() => {
    // Only set up sync if Supabase is configured and user is authenticated
    if (!isSupabaseConfigured() || !isAuthenticated || !user) {
      return;
    }

    // Start background sync
    syncService.startBackgroundSync(user.id);

    // Listen to sync status changes
    const unsubscribe = syncService.addListener((status) => {
      setSyncStatus(status);

      if (!status.syncing && status.queueSize === 0) {
        setLastSyncTime(new Date());
      }
    });

    // Initial cache update
    syncService.updateLocalCache(user.id).catch(error => {
      console.error('Error updating cache:', error);
    });

    return () => {
      syncService.stopBackgroundSync();
      unsubscribe();
    };
  }, [isAuthenticated, user]);

  const queueProgressUpdate = (cardId, scoreDelta, viewDelta = 1) => {
    if (!user) {
      console.warn('Cannot queue progress update: user not authenticated');
      return;
    }

    syncService.queueSync({
      id: `progress-${cardId}-${Date.now()}`,
      type: 'UPDATE_PROGRESS',
      data: {
        userId: user.id,
        cardId,
        scoreDelta,
        viewDelta,
      },
    });
  };

  const forceSync = async () => {
    if (!user) {
      return;
    }

    await syncService.flushSyncQueue();
    await syncService.updateLocalCache(user.id);
  };

  const refreshCache = async () => {
    if (!user) {
      return;
    }

    await syncService.updateLocalCache(user.id);
  };

  const value = {
    syncStatus,
    lastSyncTime,
    isOnline: syncStatus.online,
    isSyncing: syncStatus.syncing,
    queueSize: syncStatus.queueSize,
    queueProgressUpdate,
    forceSync,
    refreshCache,
  };

  return (
    <SyncContext.Provider value={value}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync must be used within SyncProvider');
  }
  return context;
}
