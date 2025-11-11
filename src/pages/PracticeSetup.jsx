import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCards, getCollections, getTags } from '../db/database';
import '../styles/PracticeSetup.css';

function PracticeSetup() {
  const navigate = useNavigate();
  const [allCards, setAllCards] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tags, setTags] = useState([]);

  // Filter state
  const [selectedCollection, setSelectedCollection] = useState('');
  const [selectedTypes, setSelectedTypes] = useState({
    noun: true,
    verb: true,
    phrase: true
  });
  const [scoreMin, setScoreMin] = useState('');
  const [scoreMax, setScoreMax] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Game mode state
  const [gameMode, setGameMode] = useState('word-up'); // 'word-up' or 'define-it'

  // Difficulty mode state
  const [difficulty, setDifficulty] = useState('mixed'); // 'mixed' or 'type-match'

  // Filtered cards count
  const [filteredCount, setFilteredCount] = useState(0);
  const [typeBreakdown, setTypeBreakdown] = useState({ noun: 0, verb: 0, phrase: 0 });

  // Load cards on mount
  useEffect(() => {
    const loadData = async () => {
      const cards = await getAllCards();
      const cols = await getCollections();
      const allTags = await getTags();
      setAllCards(cards);
      setCollections(cols);
      setTags(allTags);
      setFilteredCount(cards.length);
    };
    loadData();
  }, []);

  // Helper function to filter cards locally
  const filterCards = (cards, filters) => {
    return cards.filter(card => {
      // Collection filter
      if (filters.collection && card.collection !== filters.collection) {
        return false;
      }

      // Types filter
      if (filters.types && filters.types.length > 0 && !filters.types.includes(card.type)) {
        return false;
      }

      // Score range filters
      if (filters.scoreMin !== undefined && card.cardScore < filters.scoreMin) {
        return false;
      }
      if (filters.scoreMax !== undefined && card.cardScore > filters.scoreMax) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!card.tags || !filters.tags.some(tag => card.tags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  };

  // Update filtered count whenever filters change
  useEffect(() => {
    const filters = buildFilters();
    const filtered = filterCards(allCards, filters);
    setFilteredCount(filtered.length);

    // Calculate breakdown by type
    const breakdown = {
      noun: filtered.filter(card => card.type === 'noun').length,
      verb: filtered.filter(card => card.type === 'verb').length,
      phrase: filtered.filter(card => card.type === 'phrase').length
    };
    setTypeBreakdown(breakdown);
  }, [allCards, selectedCollection, selectedTypes, scoreMin, scoreMax, selectedTags]);

  const buildFilters = () => {
    const filters = {};

    if (selectedCollection) {
      filters.collection = selectedCollection;
    }

    // Build type filter from checkboxes
    const selectedTypeArray = Object.keys(selectedTypes).filter(type => selectedTypes[type]);
    if (selectedTypeArray.length > 0 && selectedTypeArray.length < 3) {
      // Only filter if not all types selected
      filters.types = selectedTypeArray;
    }

    if (scoreMin !== '') {
      filters.scoreMin = parseInt(scoreMin, 10);
    }

    if (scoreMax !== '') {
      filters.scoreMax = parseInt(scoreMax, 10);
    }

    if (selectedTags.length > 0) {
      filters.tags = selectedTags;
    }

    return filters;
  };

  // Fisher-Yates shuffle for true randomization
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleStartPractice = () => {
    if (filteredCount === 0) {
      alert('No cards match your filters. Please adjust your selection.');
      return;
    }

    if (filteredCount < 5) {
      alert('You need at least 5 cards to practice (1 correct answer + 4 distractors).');
      return;
    }

    // Type-Match mode validation
    if (difficulty === 'type-match') {
      const insufficientTypes = [];
      if (selectedTypes.noun && typeBreakdown.noun > 0 && typeBreakdown.noun < 5) {
        insufficientTypes.push(`Nouns (${typeBreakdown.noun})`);
      }
      if (selectedTypes.verb && typeBreakdown.verb > 0 && typeBreakdown.verb < 5) {
        insufficientTypes.push(`Verbs (${typeBreakdown.verb})`);
      }
      if (selectedTypes.phrase && typeBreakdown.phrase > 0 && typeBreakdown.phrase < 5) {
        insufficientTypes.push(`Phrases (${typeBreakdown.phrase})`);
      }

      if (insufficientTypes.length > 0) {
        alert(
          `Type-Match mode requires at least 5 cards per type.\n\n` +
          `Insufficient cards for: ${insufficientTypes.join(', ')}\n\n` +
          `Switch to Mixed mode or adjust your filters.`
        );
        return;
      }
    }

    // Build filters and navigate to game
    const filters = buildFilters();
    const filtered = filterCards(allCards, filters);

    // Properly shuffle cards with Fisher-Yates algorithm
    const shuffled = shuffleArray(filtered);

    // Pass to game screen via state
    navigate('/practice/game', {
      state: {
        cards: shuffled,
        gameMode: gameMode,
        difficulty: difficulty,
        allCards: allCards // For generating distractors
      }
    });
  };

  const handleClearFilters = () => {
    setSelectedCollection('');
    setSelectedTypes({ noun: true, verb: true, phrase: true });
    setScoreMin('');
    setScoreMax('');
    setSelectedTags([]);
  };

  // Check for Type-Match warnings
  const getTypeMatchWarnings = () => {
    if (difficulty !== 'type-match') return null;
    const warnings = [];
    if (selectedTypes.noun && typeBreakdown.noun > 0 && typeBreakdown.noun < 5) {
      warnings.push('nouns');
    }
    if (selectedTypes.verb && typeBreakdown.verb > 0 && typeBreakdown.verb < 5) {
      warnings.push('verbs');
    }
    if (selectedTypes.phrase && typeBreakdown.phrase > 0 && typeBreakdown.phrase < 5) {
      warnings.push('phrases');
    }
    return warnings.length > 0 ? warnings : null;
  };

  const typeMatchWarnings = getTypeMatchWarnings();

  return (
    <div className="practice-setup-container">
      <div className="header">
        <h1>Practice Setup</h1>
        <div className="card-count-badge">
          {filteredCount} card{filteredCount !== 1 ? 's' : ''} available
          {selectedTypes.noun && typeBreakdown.noun > 0 && (
            <span className="type-count"> • 📝 {typeBreakdown.noun}</span>
          )}
          {selectedTypes.verb && typeBreakdown.verb > 0 && (
            <span className="type-count"> • ⚡ {typeBreakdown.verb}</span>
          )}
          {selectedTypes.phrase && typeBreakdown.phrase > 0 && (
            <span className="type-count"> • 💬 {typeBreakdown.phrase}</span>
          )}
        </div>
      </div>

      {/* Start Button at Top */}
      <div className="start-section-top">
        <button
          onClick={handleStartPractice}
          className="btn-start"
          disabled={filteredCount === 0 || (filteredCount < 5)}
        >
          Start Practice ({filteredCount} cards)
        </button>
        {filteredCount < 5 && filteredCount > 0 && (
          <p className="warning-text">
            Need at least 5 cards to practice
          </p>
        )}
        {typeMatchWarnings && (
          <p className="warning-text">
            Type-Match mode needs 5+ cards per type. Insufficient: {typeMatchWarnings.join(', ')}
          </p>
        )}
      </div>

      <div className="setup-sections">
        {/* Filters Section */}
        <section className="filter-section">
          <h2>Filter Cards</h2>

          {/* Collection Filter */}
          <div className="filter-group">
            <label htmlFor="collection">Collection</label>
            <select
              id="collection"
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="select-input"
            >
              <option value="">All Collections</option>
              {collections.map(collection => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div className="filter-group">
            <label>Card Type</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.noun}
                  onChange={() => handleTypeChange('noun')}
                />
                <span>📝 Nouns</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.verb}
                  onChange={() => handleTypeChange('verb')}
                />
                <span>⚡ Verbs</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedTypes.phrase}
                  onChange={() => handleTypeChange('phrase')}
                />
                <span>💬 Phrases</span>
              </label>
            </div>
          </div>

          {/* Score Range Filter */}
          <div className="filter-group">
            <label>Score Range</label>
            <div className="score-range">
              <input
                type="number"
                placeholder="Min"
                value={scoreMin}
                onChange={(e) => setScoreMin(e.target.value)}
                className="score-input"
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                placeholder="Max"
                value={scoreMax}
                onChange={(e) => setScoreMax(e.target.value)}
                className="score-input"
              />
            </div>
          </div>

          {/* Tags Filter */}
          <div className="filter-group">
            <label>Tags</label>
            <div className="tags-container">
              {tags.length === 0 ? (
                <p className="text-secondary">No tags available</p>
              ) : (
                tags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))
              )}
            </div>
          </div>

          <button onClick={handleClearFilters} className="btn-secondary">
            Clear All Filters
          </button>
        </section>

        {/* Game Mode Section */}
        <section className="gamemode-section">
          <h2>Game Mode</h2>

          <div className="gamemode-options">
            <label className={`gamemode-card ${gameMode === 'word-up' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gamemode"
                value="word-up"
                checked={gameMode === 'word-up'}
                onChange={() => setGameMode('word-up')}
              />
              <div className="gamemode-content">
                <div className="gamemode-title">🇩🇪 Word Up!</div>
                <div className="gamemode-description">
                  See the German word, choose the English translation
                </div>
              </div>
            </label>

            <label className={`gamemode-card ${gameMode === 'define-it' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="gamemode"
                value="define-it"
                checked={gameMode === 'define-it'}
                onChange={() => setGameMode('define-it')}
              />
              <div className="gamemode-content">
                <div className="gamemode-title">🇬🇧 Define It!</div>
                <div className="gamemode-description">
                  See the English definition, choose the German word
                </div>
              </div>
            </label>
          </div>

          <h2 style={{ marginTop: '2rem' }}>Difficulty</h2>

          <div className="gamemode-options">
            <label className={`gamemode-card ${difficulty === 'mixed' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="difficulty"
                value="mixed"
                checked={difficulty === 'mixed'}
                onChange={() => setDifficulty('mixed')}
              />
              <div className="gamemode-content">
                <div className="gamemode-title">🎯 Mixed</div>
                <div className="gamemode-description">
                  Distractors from any card type (easier - use context clues)
                </div>
              </div>
            </label>

            <label className={`gamemode-card ${difficulty === 'type-match' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="difficulty"
                value="type-match"
                checked={difficulty === 'type-match'}
                onChange={() => setDifficulty('type-match')}
              />
              <div className="gamemode-content">
                <div className="gamemode-title">🔥 Type-Match</div>
                <div className="gamemode-description">
                  Distractors only from same type (harder - no pattern clues)
                </div>
              </div>
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}

export default PracticeSetup;
