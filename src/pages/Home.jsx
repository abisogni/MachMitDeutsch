import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { loadMockCards } from '../utils/mockData';
import '../styles/Home.css';

function Home() {
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    const cards = loadMockCards();
    setCardCount(cards.length);
  }, []);

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">MachMitDeutsch</h1>
        <p className="home-subtitle">
          Master German vocabulary with interactive flashcards and games
        </p>
        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-number">{cardCount}</div>
            <div className="stat-label">Vocabulary Cards</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2</div>
            <div className="stat-label">Game Modes</div>
          </div>
        </div>
      </div>

      <div className="home-actions">
        <Link to="/dashboard" className="action-card">
          <span className="action-icon">📊</span>
          <h2 className="action-title">Dashboard</h2>
          <p className="action-description">
            View your learning progress, score breakdowns by type, and identify cards needing practice.
          </p>
        </Link>

        <Link to="/manage" className="action-card">
          <span className="action-icon">📚</span>
          <h2 className="action-title">Manage Cards</h2>
          <p className="action-description">
            Add, edit, and organize your German vocabulary cards. Import existing collections or create new ones.
          </p>
        </Link>

        <Link to="/practice/setup" className="action-card">
          <span className="action-icon">🎯</span>
          <h2 className="action-title">Practice</h2>
          <p className="action-description">
            Test your knowledge with Word Up! and Define It! game modes. Track your progress with scoring.
          </p>
        </Link>
      </div>

      <div className="home-features">
        <h2 className="features-title">Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">📝</div>
            <div className="feature-content">
              <h3>Rich Card Types</h3>
              <p>Support for nouns (with gender), verbs, and phrases with contextual examples</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🎮</div>
            <div className="feature-content">
              <h3>Two Game Modes</h3>
              <p>German to English (Word Up!) and English to German (Define It!)</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <div className="feature-content">
              <h3>Smart Filtering</h3>
              <p>Filter by collection, type, tags, or score range for targeted practice</p>
            </div>
          </div>

          <div className="feature-item">
            <div className="feature-icon">📊</div>
            <div className="feature-content">
              <h3>Progress Tracking</h3>
              <p>Card scoring system tracks your performance over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
