import { supabase, isSupabaseConfigured } from './supabase';
import { db } from '../db/database';

const SYNC_INTERVAL = 30000; // 30 seconds
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 5000; // 5 seconds

class SyncService {
  constructor() {
    this.syncInterval = null;
    this.isSyncing = false;
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.syncQueue = [];
    this.retryCount = new Map();

    // Listen to online/offline events
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  /**
   * Add a listener for sync status changes
   * @param {Function} callback - Called with sync status updates
   * @returns {Function} Unsubscribe function
   */
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * Notify all listeners of status change
   * @param {Object} status - Status object
   */
  notifyListeners(status) {
    this.listeners.forEach(listener => listener(status));
  }

  /**
   * Handle coming online
   */
  handleOnline() {
    console.log('Connection restored');
    this.isOnline = true;
    this.notifyListeners({ online: true, syncing: false });
    this.flushSyncQueue();
  }

  /**
   * Handle going offline
   */
  handleOffline() {
    console.log('Connection lost');
    this.isOnline = false;
    this.notifyListeners({ online: false, syncing: false });
  }

  /**
   * Start background sync
   * @param {string} userId - Current user ID
   */
  startBackgroundSync(userId) {
    if (!isSupabaseConfigured() || !userId) {
      return;
    }

    // Clear any existing interval
    this.stopBackgroundSync();

    // Initial sync
    this.flushSyncQueue();

    // Set up periodic sync
    this.syncInterval = setInterval(() => {
      this.flushSyncQueue();
    }, SYNC_INTERVAL);

    console.log('Background sync started');
  }

  /**
   * Stop background sync
   */
  stopBackgroundSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Background sync stopped');
    }
  }

  /**
   * Queue a sync operation
   * @param {Object} operation - Operation to queue
   */
  queueSync(operation) {
    this.syncQueue.push({
      ...operation,
      timestamp: Date.now(),
    });

    // Try immediate sync if online
    if (this.isOnline && !this.isSyncing) {
      this.flushSyncQueue();
    }
  }

  /**
   * Flush the sync queue
   */
  async flushSyncQueue() {
    if (!isSupabaseConfigured() || !this.isOnline || this.isSyncing || this.syncQueue.length === 0) {
      return;
    }

    this.isSyncing = true;
    this.notifyListeners({ online: true, syncing: true });

    const queue = [...this.syncQueue];
    this.syncQueue = [];

    for (const operation of queue) {
      try {
        await this.executeSync(operation);
        // Reset retry count on success
        this.retryCount.delete(operation.id);
      } catch (error) {
        console.error('Sync error:', error);

        // Track retry attempts
        const retries = (this.retryCount.get(operation.id) || 0) + 1;
        this.retryCount.set(operation.id, retries);

        if (retries < MAX_RETRY_ATTEMPTS) {
          // Re-queue with delay
          setTimeout(() => {
            this.syncQueue.push(operation);
          }, RETRY_DELAY * retries);
        } else {
          console.error('Max retry attempts reached for operation:', operation);
          this.retryCount.delete(operation.id);
        }
      }
    }

    this.isSyncing = false;
    this.notifyListeners({ online: true, syncing: false });
  }

  /**
   * Execute a single sync operation
   * @param {Object} operation - Operation to execute
   */
  async executeSync(operation) {
    switch (operation.type) {
      case 'UPDATE_PROGRESS':
        await this.syncProgress(operation.data);
        break;
      default:
        console.warn('Unknown sync operation type:', operation.type);
    }
  }

  /**
   * Sync card progress to Supabase
   * @param {Object} data - Progress data
   */
  async syncProgress(data) {
    const { userId, cardId, scoreDelta, viewDelta } = data;

    if (!userId || !cardId) {
      console.error('Missing userId or cardId in sync data');
      return;
    }

    const { data: result, error } = await supabase
      .rpc('increment_card_progress', {
        p_user_id: userId,
        p_card_id: cardId,
        p_score_delta: scoreDelta || 0,
        p_view_delta: viewDelta || 1,
      });

    if (error) {
      throw error;
    }

    return result;
  }

  /**
   * Fetch all cards with user progress
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Cards with merged progress
   */
  async fetchCardsWithProgress(userId) {
    if (!isSupabaseConfigured()) {
      return [];
    }

    try {
      // Fetch all cards
      const { data: cards, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .order('word');

      if (cardsError) {
        throw cardsError;
      }

      // Fetch user progress
      const { data: progress, error: progressError } = await supabase
        .from('user_card_progress')
        .select('*')
        .eq('user_id', userId);

      if (progressError) {
        throw progressError;
      }

      // Create progress map
      const progressMap = {};
      progress.forEach(p => {
        progressMap[p.card_id] = p;
      });

      // Merge cards with progress
      const cardsWithProgress = cards.map(card => ({
        ...card,
        cardScore: progressMap[card.id]?.card_score || 0,
        viewCount: progressMap[card.id]?.view_count || 0,
        lastPracticedAt: progressMap[card.id]?.last_practiced_at || null,
      }));

      return cardsWithProgress;
    } catch (error) {
      console.error('Error fetching cards with progress:', error);
      throw error;
    }
  }

  /**
   * Update local cache with Supabase data
   * @param {string} userId - User ID
   */
  async updateLocalCache(userId) {
    if (!isSupabaseConfigured()) {
      return;
    }

    try {
      const cards = await this.fetchCardsWithProgress(userId);

      // Clear existing cards
      await db.cards.clear();

      // Add cards to local cache
      for (const card of cards) {
        // Map Supabase schema to IndexedDB schema
        await db.cards.add({
          id: card.id,
          word: card.word,
          definition: card.definition,
          type: card.type,
          level: card.level,
          collection: card.collection,
          tags: card.tags || [],
          gender: card.gender,
          plural: card.plural,
          examples: card.examples,
          context: card.context,
          cardScore: card.cardScore,
          viewCount: card.viewCount,
          lastPracticedAt: card.lastPracticedAt,
          createdDate: card.created_at,
        });
      }

      console.log(`Updated local cache with ${cards.length} cards`);
    } catch (error) {
      console.error('Error updating local cache:', error);
      throw error;
    }
  }

  /**
   * Get sync status
   * @returns {Object} Current sync status
   */
  getStatus() {
    return {
      online: this.isOnline,
      syncing: this.isSyncing,
      queueSize: this.syncQueue.length,
    };
  }
}

// Export singleton instance
export const syncService = new SyncService();
