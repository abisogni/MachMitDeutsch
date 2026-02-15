import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmail,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  migrateLocalData,
  checkLocalDataForMigration,
  clearLocalData
} from '../lib/authService';
import { isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMigrationPrompt, setShowMigrationPrompt] = useState(false);
  const [migrationStats, setMigrationStats] = useState({ hasData: false, count: 0 });

  useEffect(() => {
    // Only set up auth if Supabase is configured
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Check for existing session
    getCurrentUser().then(({ user }) => {
      setUser(user);
      setLoading(false);

      // Check for local data that needs migration
      if (user) {
        checkForMigration();
      }
    });

    // Listen to auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);

      if (event === 'SIGNED_IN' && session?.user) {
        // Check for local data when user signs in
        await checkForMigration();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const checkForMigration = async () => {
    const stats = await checkLocalDataForMigration();
    setMigrationStats(stats);

    if (stats.hasData) {
      setShowMigrationPrompt(true);
    }
  };

  const handleMigration = async (shouldMigrate) => {
    setShowMigrationPrompt(false);

    if (shouldMigrate && user) {
      try {
        const result = await migrateLocalData(user.id);

        if (result.success) {
          console.log(`Migration complete: ${result.migrated} records migrated`);
          // Optionally clear local data after successful migration
          // await clearLocalData();
        } else {
          console.error(`Migration failed: ${result.errors} errors`);
        }

        return result;
      } catch (error) {
        console.error('Migration error:', error);
        return { success: false, migrated: 0, errors: 1 };
      }
    }

    return { success: true, migrated: 0, errors: 0 };
  };

  const login = async (email) => {
    const { error } = await signInWithEmail(email);
    return { error };
  };

  const logout = async () => {
    const { error } = await signOut();
    if (!error) {
      setUser(null);
    }
    return { error };
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isSupabaseConfigured: isSupabaseConfigured(),
    login,
    logout,
    showMigrationPrompt,
    migrationStats,
    handleMigration,
    dismissMigrationPrompt: () => setShowMigrationPrompt(false),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
