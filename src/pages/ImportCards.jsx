import { useState } from 'react';
import { Link } from 'react-router-dom';
import { importCards, getStats } from '../db/database';
import '../styles/ImportCards.css';

function ImportCards() {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [isImporting, setIsImporting] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError(null);
    setParsedData(null);
    setPreview([]);
    setImportResults(null);

    if (selectedFile) {
      // Read and parse the file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target.result);

          // Validate JSON structure
          if (!json.cards || !Array.isArray(json.cards)) {
            setError('Invalid JSON format: Missing "cards" array');
            return;
          }

          // Validate each card has required fields
          const invalidCards = json.cards.filter(
            card => !card.word || !card.definition || !card.type
          );

          if (invalidCards.length > 0) {
            setError(`${invalidCards.length} card(s) missing required fields (word, definition, type)`);
            return;
          }

          // Successfully parsed
          setParsedData(json);
          setPreview(json.cards.slice(0, 5)); // Show first 5 cards as preview
        } catch (err) {
          setError('Failed to parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Handle import confirmation
  const handleImport = async () => {
    if (!parsedData) return;

    setIsImporting(true);
    setError(null);

    try {
      const results = await importCards(parsedData.cards, { checkDuplicates: true });
      setImportResults(results);
      setParsedData(null); // Clear parsed data after import
    } catch (err) {
      setError('Import failed: ' + err.message);
    } finally {
      setIsImporting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFile(null);
    setParsedData(null);
    setError(null);
    setPreview([]);
    setImportResults(null);
  };

  return (
    <div className="import-container">
      <div className="import-header">
        <h1>Import Vocabulary Cards</h1>
        <p className="import-subtitle">
          Upload a JSON file to import your German vocabulary cards
        </p>
      </div>

      {/* File Upload Section */}
      {!parsedData && !importResults && (
        <div className="import-card">
          <div className="upload-area">
            <div className="upload-icon">📤</div>
            <h2>Choose a JSON file</h2>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="file-input"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-primary upload-btn">
              Select File
            </label>
            {file && <p className="file-name">Selected: {file.name}</p>}
          </div>

          <div className="format-info">
            <h3>Expected JSON Format:</h3>
            <pre className="format-example">
{`{
  "version": "1.0",
  "cards": [
    {
      "word": "das Haus",
      "definition": "the house",
      "type": "noun",
      "level": "A1",
      "collection": "Basic Vocabulary",
      "tags": ["buildings"],
      "gender": "das",
      "plural": "Häuser"
    }
  ]
}`}
            </pre>
            <p className="format-note">
              <strong>Required fields:</strong> word, definition, type<br />
              <strong>Optional fields:</strong> level, collection, tags, gender, plural, etc.
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
          <button onClick={handleReset} className="btn-secondary">
            Try Again
          </button>
        </div>
      )}

      {/* Preview Section */}
      {parsedData && !importResults && (
        <div className="import-card">
          <div className="preview-section">
            <h2>Import Preview</h2>
            <div className="preview-stats">
              <span className="stat-badge">📝 {parsedData.cards.length} cards to import</span>
            </div>

            <div className="preview-cards">
              <h3>Preview (first 5 cards):</h3>
              {preview.map((card, index) => (
                <div key={index} className="preview-card">
                  <div className="preview-card-header">
                    <span className="type-badge">{getTypeIcon(card.type)} {card.type}</span>
                    <span className="level-badge">{card.level || 'N/A'}</span>
                  </div>
                  <div className="preview-card-content">
                    <div className="preview-word">{card.word}</div>
                    <div className="preview-definition">{card.definition}</div>
                    {card.collection && (
                      <div className="preview-meta">Collection: {card.collection}</div>
                    )}
                    {card.tags && card.tags.length > 0 && (
                      <div className="preview-meta">Tags: {card.tags.join(', ')}</div>
                    )}
                  </div>
                </div>
              ))}
              {parsedData.cards.length > 5 && (
                <p className="preview-more">
                  ... and {parsedData.cards.length - 5} more cards
                </p>
              )}
            </div>

            <div className="import-actions">
              <button
                onClick={handleImport}
                className="btn-primary"
                disabled={isImporting}
              >
                {isImporting ? 'Importing...' : `Import ${parsedData.cards.length} Cards`}
              </button>
              <button onClick={handleReset} className="btn-secondary">
                Cancel
              </button>
            </div>

            <div className="import-note">
              <strong>Note:</strong> Duplicate cards (matching German word) will be skipped automatically.
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {importResults && (
        <div className="import-card">
          <div className="results-section">
            <div className="results-icon">✅</div>
            <h2>Import Complete!</h2>

            <div className="results-stats">
              <div className="result-stat success">
                <span className="result-number">{importResults.imported}</span>
                <span className="result-label">Cards Imported</span>
              </div>
              {importResults.duplicates > 0 && (
                <div className="result-stat warning">
                  <span className="result-number">{importResults.duplicates}</span>
                  <span className="result-label">Duplicates Skipped</span>
                </div>
              )}
              {importResults.errors > 0 && (
                <div className="result-stat error">
                  <span className="result-number">{importResults.errors}</span>
                  <span className="result-label">Errors</span>
                </div>
              )}
            </div>

            {importResults.duplicates > 0 && importResults.duplicateWords.length > 0 && (
              <div className="duplicates-list">
                <h3>Duplicate Words (Skipped):</h3>
                <div className="duplicate-words">
                  {importResults.duplicateWords.slice(0, 10).map((word, index) => (
                    <span key={index} className="duplicate-word">{word}</span>
                  ))}
                  {importResults.duplicateWords.length > 10 && (
                    <span className="duplicate-more">
                      ... and {importResults.duplicateWords.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="import-actions">
              <Link to="/manage" className="btn-primary">
                View All Cards
              </Link>
              <button onClick={handleReset} className="btn-secondary">
                Import More Cards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Back Link (when no operation in progress) */}
      {!parsedData && !importResults && !error && (
        <div className="import-actions">
          <Link to="/manage" className="btn-secondary">
            Back to Card List
          </Link>
        </div>
      )}
    </div>
  );
}

// Helper function to get type icon
function getTypeIcon(type) {
  switch (type) {
    case 'noun': return '📝';
    case 'verb': return '⚡';
    case 'phrase': return '💬';
    default: return '📄';
  }
}

export default ImportCards;
