import { Link } from 'react-router-dom';
import '../styles/ImportCards.css';

function ImportCards() {
  return (
    <div className="import-container">
      <div className="import-header">
        <h1>Import Vocabulary Cards</h1>
        <p className="import-subtitle">
          Upload a JSON file to import your German vocabulary cards
        </p>
      </div>

      <div className="import-card">
        <div className="upload-placeholder">
          <div className="upload-icon">📤</div>
          <h2>Import Feature Coming Soon</h2>
          <p>
            File upload and import functionality will be available once the IndexedDB backend is connected (Phase 3).
          </p>
          <p className="upload-format-info">
            Expected format: JSON with cards array containing word, definition, type, and optional metadata.
          </p>
        </div>
      </div>

      <div className="import-actions">
        <Link to="/manage" className="btn-secondary">
          Back to Card List
        </Link>
      </div>
    </div>
  );
}

export default ImportCards;
