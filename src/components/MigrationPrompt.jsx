import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/MigrationPrompt.css';

function MigrationPrompt() {
  const { showMigrationPrompt, migrationStats, handleMigration, dismissMigrationPrompt } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  if (!showMigrationPrompt) {
    return null;
  }

  const handleYes = async () => {
    setIsProcessing(true);
    const migrationResult = await handleMigration(true);
    setResult(migrationResult);
    setIsProcessing(false);

    if (migrationResult.success) {
      setTimeout(() => {
        setResult(null);
      }, 3000);
    }
  };

  const handleNo = () => {
    handleMigration(false);
  };

  return (
    <div className="migration-overlay">
      <div className="migration-modal">
        <h2>Local Data Found</h2>

        {!result && (
          <>
            <p>
              We found {migrationStats.count} vocabulary cards with learning progress
              on this device.
            </p>
            <p>
              Would you like to sync this progress to the cloud? This will allow you
              to access it from other devices.
            </p>

            <div className="migration-actions">
              <button
                onClick={handleYes}
                disabled={isProcessing}
                className="btn-primary"
              >
                {isProcessing ? 'Migrating...' : 'Yes, Sync Progress'}
              </button>
              <button
                onClick={handleNo}
                disabled={isProcessing}
                className="btn-secondary"
              >
                Skip for Now
              </button>
            </div>
          </>
        )}

        {result && (
          <div className={`migration-result ${result.success ? 'success' : 'error'}`}>
            {result.success ? (
              <>
                <p>Migration successful!</p>
                <p>{result.migrated} progress records synced to the cloud.</p>
              </>
            ) : (
              <>
                <p>Migration failed</p>
                <p>
                  {result.errors} errors occurred. Please try again later or
                  continue without migration.
                </p>
                <button onClick={dismissMigrationPrompt} className="btn-primary">
                  Continue
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MigrationPrompt;
