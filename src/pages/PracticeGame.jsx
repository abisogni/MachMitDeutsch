import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { updateCard } from '../db/database';
import '../styles/PracticeGame.css';

function PracticeGame() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get data passed from setup screen
  const { cards, gameMode, difficulty, allCards } = location.state || {};

  // State
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answerOptions, setAnswerOptions] = useState([]);
  const [isLastCard, setIsLastCard] = useState(false);
  const [cardStats, setCardStats] = useState({});
  const [flaggedCards, setFlaggedCards] = useState(new Set()); // Cards flagged for review
  const [incorrectCards, setIncorrectCards] = useState(new Set()); // Cards answered incorrectly
  const [showTagPrompt, setShowTagPrompt] = useState(false);
  const [tagName, setTagName] = useState('');

  // Redirect if no cards provided
  useEffect(() => {
    if (!cards || cards.length === 0) {
      navigate('/practice/setup');
    }
  }, [cards, navigate]);

  // Fisher-Yates shuffle for true randomization
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate answer options when card changes
  useEffect(() => {
    if (!cards || cards.length === 0) return;

    const currentCard = cards[currentCardIndex];
    const options = generateAnswerOptions(currentCard);
    setAnswerOptions(options);
    setSelectedAnswer(null);
    setIsSubmitted(false);
  }, [currentCardIndex, cards, gameMode, allCards, difficulty]);

  const generateAnswerOptions = (currentCard) => {
    if (!currentCard || !allCards) return [];

    // Determine what to show based on game mode
    const isWordUp = gameMode === 'word-up';

    // Correct answer
    const correctAnswer = {
      text: isWordUp ? currentCard.definition : currentCard.word,
      isCorrect: true,
      cardId: currentCard.id
    };

    // Generate distractors from other cards
    let otherCards = allCards.filter(card => card.id !== currentCard.id);

    // In Type-Match mode, only use cards of the same type
    if (difficulty === 'type-match') {
      otherCards = otherCards.filter(card => card.type === currentCard.type);
    }

    // Properly shuffle and take 4 random distractors
    const shuffledOthers = shuffleArray(otherCards);

    // Take up to 4 distractors
    const distractors = shuffledOthers.slice(0, 4).map(card => ({
      text: isWordUp ? card.definition : card.word,
      isCorrect: false,
      cardId: card.id
    }));

    // Combine and shuffle all options with proper randomization
    const allOptions = [correctAnswer, ...distractors];
    return shuffleArray(allOptions);
  };

  const handleToggleFlag = () => {
    if (!cards || cards.length === 0) return;
    const currentCard = cards[currentCardIndex];

    // Ensure we're working with the specific card ID only
    const cardId = currentCard.id;

    setFlaggedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        // Only add this specific card ID
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    setIsSubmitted(true);

    const currentCard = cards[currentCardIndex];
    const selectedOption = answerOptions[selectedAnswer];
    const isCorrect = selectedOption.isCorrect;

    // Track incorrect answers
    if (!isCorrect) {
      setIncorrectCards(prev => {
        const newSet = new Set(prev);
        newSet.add(currentCard.id);
        return newSet;
      });
    }

    // Update card stats (in real app, this would update IndexedDB)
    const updatedStats = {
      ...cardStats,
      [currentCard.id]: {
        cardScore: (cardStats[currentCard.id]?.cardScore || currentCard.cardScore) + (isCorrect ? 1 : -1),
        viewCount: (cardStats[currentCard.id]?.viewCount || currentCard.viewCount) + 1
      }
    };
    setCardStats(updatedStats);

    // Auto-advance after 3 seconds
    setTimeout(() => {
      if (isLastCard || currentCardIndex === cards.length - 1) {
        // Check if there are incorrect cards to tag
        if (incorrectCards.size > 0) {
          setShowTagPrompt(true);
        } else {
          // Return to setup screen
          navigate('/practice/setup');
        }
      } else {
        // Check if we should show a flagged card (20% chance)
        const shouldShowFlagged = flaggedCards.size > 0 && Math.random() < 0.2;

        if (shouldShowFlagged) {
          // Pick a random flagged card
          const flaggedArray = Array.from(flaggedCards);
          const randomFlaggedId = flaggedArray[Math.floor(Math.random() * flaggedArray.length)];
          const flaggedCardIndex = cards.findIndex(card => card.id === randomFlaggedId);

          if (flaggedCardIndex !== -1 && flaggedCardIndex !== currentCardIndex) {
            // Show the flagged card
            setCurrentCardIndex(flaggedCardIndex);
            return;
          }
        }

        // Otherwise, move to next card normally
        setCurrentCardIndex(prev => prev + 1);
      }
    }, 3000);
  };

  const handleAnswerSelect = (index) => {
    if (!isSubmitted) {
      setSelectedAnswer(index);
    }
  };

  const getQuestionText = () => {
    if (!cards || cards.length === 0) return '';
    const currentCard = cards[currentCardIndex];
    return gameMode === 'word-up' ? currentCard.word : currentCard.definition;
  };

  const getAnswerClassName = (index) => {
    if (!isSubmitted) {
      return selectedAnswer === index ? 'selected' : '';
    }

    const option = answerOptions[index];
    if (option.isCorrect) {
      return 'correct';
    }
    if (selectedAnswer === index && !option.isCorrect) {
      return 'incorrect';
    }
    return '';
  };

  const getCurrentCardScore = () => {
    if (!cards || cards.length === 0) return 0;
    const currentCard = cards[currentCardIndex];
    return cardStats[currentCard.id]?.cardScore ?? currentCard.cardScore;
  };

  const handleSkipTagging = () => {
    setShowTagPrompt(false);
    navigate('/practice/setup');
  };

  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      alert('Please enter a tag name');
      return;
    }

    try {
      // Update each incorrect card with the new tag
      const incorrectCardIds = Array.from(incorrectCards);

      for (const cardId of incorrectCardIds) {
        const card = allCards.find(c => c.id === cardId);
        if (card) {
          // Add the new tag to existing tags (avoid duplicates)
          const existingTags = card.tags || [];
          const updatedTags = existingTags.includes(tagName.trim())
            ? existingTags
            : [...existingTags, tagName.trim()];

          await updateCard(cardId, { tags: updatedTags });
        }
      }

      // Success - navigate away
      setShowTagPrompt(false);
      navigate('/practice/setup');
    } catch (error) {
      console.error('Error tagging cards:', error);
      alert('Failed to tag cards. Please try again.');
    }
  };

  if (!cards || cards.length === 0) {
    return null; // Will redirect via useEffect
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <div className="practice-game-container">
      {/* Header with progress */}
      <div className="game-header">
        <div className="progress-info">
          <span className="card-counter">
            Card {currentCardIndex + 1} of {cards.length}
          </span>
          <span className="current-score">
            Score: {getCurrentCardScore()}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Game mode indicator */}
      <div className="game-mode-badge">
        {gameMode === 'word-up' ? '🇩🇪 Word Up!' : '🇬🇧 Define It!'}
        {' • '}
        {difficulty === 'type-match' ? '🔥 Type-Match' : '🎯 Mixed'}
      </div>

      {/* Question */}
      <div className="question-section">
        <div className="question-header">
          <div className="question-label">
            {gameMode === 'word-up' ? 'What does this mean?' : 'How do you say this in German?'}
          </div>
          <button
            className={`flag-button ${flaggedCards.has(currentCard.id) ? 'flagged' : ''}`}
            onClick={handleToggleFlag}
            disabled={isSubmitted}
            title={flaggedCards.has(currentCard.id) ? 'Remove from review queue' : 'Flag for extra review'}
          >
            {flaggedCards.has(currentCard.id) ? '⭐ Reviewing' : '☆ Flag for Review'}
          </button>
        </div>
        <div className="question-text">
          {getQuestionText()}
        </div>
        {flaggedCards.has(currentCard.id) && (
          <div className="flagged-indicator">
            This card is flagged for extra review (20% boost to reappear)
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="answers-section">
        {answerOptions.map((option, index) => (
          <button
            key={index}
            className={`answer-option ${getAnswerClassName(index)}`}
            onClick={() => handleAnswerSelect(index)}
            disabled={isSubmitted}
          >
            <div className="option-letter">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="option-text">
              {option.text}
            </div>
            {isSubmitted && option.isCorrect && (
              <div className="option-indicator correct-indicator">✓</div>
            )}
            {isSubmitted && selectedAnswer === index && !option.isCorrect && (
              <div className="option-indicator incorrect-indicator">✗</div>
            )}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="controls-section">
        <label className="last-card-checkbox">
          <input
            type="checkbox"
            checked={isLastCard}
            onChange={(e) => setIsLastCard(e.target.checked)}
            disabled={isSubmitted}
          />
          <span>Last Card (return to setup after this)</span>
        </label>

        <button
          className="btn-submit"
          onClick={handleSubmit}
          disabled={selectedAnswer === null || isSubmitted}
        >
          {isSubmitted ? 'Next card in 3s...' : 'Submit Answer'}
        </button>
      </div>

      {/* Feedback message */}
      {isSubmitted && (
        <div className={`feedback-message ${answerOptions[selectedAnswer]?.isCorrect ? 'correct' : 'incorrect'}`}>
          {answerOptions[selectedAnswer]?.isCorrect ? (
            <>
              <span className="feedback-icon">🎉</span>
              <span>Correct! +1 point</span>
            </>
          ) : (
            <>
              <span className="feedback-icon">💡</span>
              <span>Not quite. -1 point. The correct answer is highlighted above.</span>
            </>
          )}
        </div>
      )}

      {/* Tag Incorrect Cards Modal */}
      {showTagPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Tag Incorrect Cards</h2>
            <p>
              You answered <strong>{incorrectCards.size}</strong> card{incorrectCards.size !== 1 ? 's' : ''} incorrectly.
            </p>
            <p>
              Would you like to tag these cards for targeted practice later?
            </p>
            <div className="tag-input-group">
              <label htmlFor="tag-input">Tag name:</label>
              <input
                id="tag-input"
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder={`e.g., review-${new Date().toISOString().split('T')[0]}`}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveTag()}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={handleSkipTagging}>
                Skip
              </button>
              <button className="btn-primary" onClick={handleSaveTag}>
                Save Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PracticeGame;
