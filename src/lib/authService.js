import { supabase, isSupabaseConfigured } from './supabase';
import { db } from '../db/database';

/**
 * Sign in with email magic link
 * @param {string} email - User's email address
 * @returns {Promise<{error: Error|null}>}
 */
export async function signInWithEmail(email) {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin,
    },
  });

  return { error };
}

/**
 * Sign out current user
 * @returns {Promise<{error: Error|null}>}
 */
export async function signOut() {
  if (!isSupabaseConfigured()) {
    return { error: new Error('Supabase not configured') };
  }

  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Get current user session
 * @returns {Promise<{session: Session|null, user: User|null}>}
 */
export async function getSession() {
  if (!isSupabaseConfigured()) {
    return { session: null, user: null };
  }

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return { session: null, user: null };
  }

  return { session, user: session?.user || null };
}

/**
 * Get current user
 * @returns {Promise<{user: User|null, error: Error|null}>}
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return { user: null, error: null };
  }

  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Called with (event, session)
 * @returns {Object} Subscription object with unsubscribe method
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured()) {
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Migrate local IndexedDB data to Supabase for a newly authenticated user
 * @param {string} userId - User ID from Supabase auth
 * @returns {Promise<{success: boolean, migrated: number, errors: number}>}
 */
export async function migrateLocalData(userId) {
  if (!isSupabaseConfigured()) {
    return { success: false, migrated: 0, errors: 0 };
  }

  try {
    // Get all local cards with progress data (cardScore > 0 or viewCount > 0)
    const localCards = await db.cards
      .filter(card => (card.cardScore && card.cardScore !== 0) || (card.viewCount && card.viewCount !== 0))
      .toArray();

    if (localCards.length === 0) {
      console.log('No local progress to migrate');
      return { success: true, migrated: 0, errors: 0 };
    }

    console.log(`Found ${localCards.length} cards with progress to migrate`);

    let migrated = 0;
    let errors = 0;

    // Get all cards from Supabase to map words to card IDs
    const { data: supabaseCards, error: fetchError } = await supabase
      .from('cards')
      .select('id, word');

    if (fetchError) {
      console.error('Error fetching Supabase cards:', fetchError);
      return { success: false, migrated: 0, errors: localCards.length };
    }

    // Create word -> card_id mapping
    const wordToCardId = {};
    supabaseCards.forEach(card => {
      wordToCardId[card.word] = card.id;
    });

    // Prepare progress records
    const progressRecords = [];

    for (const localCard of localCards) {
      const cardId = wordToCardId[localCard.word];

      if (!cardId) {
        console.warn(`Card not found in Supabase: ${localCard.word}`);
        errors++;
        continue;
      }

      progressRecords.push({
        user_id: userId,
        card_id: cardId,
        card_score: localCard.cardScore || 0,
        view_count: localCard.viewCount || 0,
        last_practiced_at: localCard.lastPracticedAt || new Date().toISOString(),
      });
    }

    // Batch insert progress records
    if (progressRecords.length > 0) {
      const { error: insertError } = await supabase
        .from('user_card_progress')
        .upsert(progressRecords, {
          onConflict: 'user_id,card_id',
          ignoreDuplicates: false,
        });

      if (insertError) {
        console.error('Error migrating progress:', insertError);
        errors += progressRecords.length;
      } else {
        migrated = progressRecords.length;
        console.log(`Successfully migrated ${migrated} progress records`);
      }
    }

    return { success: errors === 0, migrated, errors };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, migrated: 0, errors: 0 };
  }
}

/**
 * Check if local data exists that needs migration
 * @returns {Promise<{hasData: boolean, count: number}>}
 */
export async function checkLocalDataForMigration() {
  try {
    const localCards = await db.cards
      .filter(card => (card.cardScore && card.cardScore !== 0) || (card.viewCount && card.viewCount !== 0))
      .toArray();

    return { hasData: localCards.length > 0, count: localCards.length };
  } catch (error) {
    console.error('Error checking local data:', error);
    return { hasData: false, count: 0 };
  }
}

/**
 * Clear local data after successful migration
 * @returns {Promise<void>}
 */
export async function clearLocalData() {
  try {
    // Clear all cards from IndexedDB
    await db.cards.clear();
    console.log('Local data cleared after migration');
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
}
