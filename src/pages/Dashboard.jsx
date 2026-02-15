import { useState, useEffect } from 'react';
import { getAllCards } from '../db/database';
import { useAuth } from '../contexts/AuthContext';
import { useSync } from '../contexts/SyncContext';
import '../styles/Dashboard.css';

function Dashboard() {
  const { user, isSupabaseConfigured, logout } = useAuth();
  const { syncStatus, lastSyncTime, refreshCache } = useSync();
  const [cards, setCards] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metrics, setMetrics] = useState({
    totalCards: 0,
    byType: {
      noun: { count: 0, avgScore: 0, totalScore: 0 },
      verb: { count: 0, avgScore: 0, totalScore: 0 },
      phrase: { count: 0, avgScore: 0, totalScore: 0 }
    },
    overallAvgScore: 0,
    strugglingCards: {
      noun: [],
      verb: [],
      phrase: []
    }
  });

  useEffect(() => {
    const loadCards = async () => {
      const loadedCards = await getAllCards();
      setCards(loadedCards);
      calculateMetrics(loadedCards);
    };
    loadCards();
  }, []);

  const calculateMetrics = (cardData) => {
    const totalCards = cardData.length;

    // Calculate by type
    const byType = {
      noun: { count: 0, totalScore: 0, avgScore: 0, cards: [] },
      verb: { count: 0, totalScore: 0, avgScore: 0, cards: [] },
      phrase: { count: 0, totalScore: 0, avgScore: 0, cards: [] }
    };

    cardData.forEach(card => {
      if (byType[card.type]) {
        byType[card.type].count++;
        byType[card.type].totalScore += card.cardScore;
        byType[card.type].cards.push(card);
      }
    });

    // Calculate averages
    Object.keys(byType).forEach(type => {
      if (byType[type].count > 0) {
        byType[type].avgScore = (byType[type].totalScore / byType[type].count).toFixed(1);
      }
    });

    // Overall average
    const totalScore = cardData.reduce((sum, card) => sum + card.cardScore, 0);
    const overallAvgScore = totalCards > 0 ? (totalScore / totalCards).toFixed(1) : 0;

    // Get struggling cards (lowest 5 scores per type)
    const strugglingCards = {};
    Object.keys(byType).forEach(type => {
      strugglingCards[type] = byType[type].cards
        .sort((a, b) => a.cardScore - b.cardScore)
        .slice(0, 5);
    });

    setMetrics({
      totalCards,
      byType,
      overallAvgScore,
      strugglingCards
    });
  };

  const getScoreColor = (score) => {
    if (score >= 5) return 'score-excellent';
    if (score >= 3) return 'score-good';
    if (score >= 1) return 'score-okay';
    if (score >= -2) return 'score-struggling';
    return 'score-needs-work';
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'noun': return '📝';
      case 'verb': return '⚡';
      case 'phrase': return '💬';
      default: return '📄';
    }
  };

  const handleRefresh = async () => {
    if (!user || !isSupabaseConfigured) return;

    setIsRefreshing(true);
    try {
      await refreshCache();
      const loadedCards = await getAllCards();
      setCards(loadedCards);
      calculateMetrics(loadedCards);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatSyncTime = (time) => {
    if (!time) return 'Never';
    const now = new Date();
    const diff = Math.floor((now - time) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return time.toLocaleDateString();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title-section">
          <h1>Performance Dashboard</h1>
          <p className="dashboard-subtitle">Track your German vocabulary learning progress</p>
        </div>
        <div className="dashboard-actions">
          {isSupabaseConfigured && user && (
            <>
              <div className="sync-status">
                <span className={`sync-indicator ${syncStatus.online ? 'online' : 'offline'}`}>
                  {syncStatus.syncing ? '🔄 Syncing...' : syncStatus.online ? '✓ Online' : '⚠ Offline'}
                </span>
                <span className="sync-time">
                  Last sync: {formatSyncTime(lastSyncTime)}
                </span>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn-refresh"
                title="Refresh data from cloud"
              >
                {isRefreshing ? '🔄' : '↻'}
              </button>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <div className="stat-value">{metrics.totalCards}</div>
            <div className="stat-label">Total Cards</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-value">{metrics.overallAvgScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <div className="stat-value">{metrics.byType.noun.count}</div>
            <div className="stat-label">Nouns</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <div className="stat-value">{metrics.byType.verb.count}</div>
            <div className="stat-label">Verbs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <div className="stat-value">{metrics.byType.phrase.count}</div>
            <div className="stat-label">Phrases</div>
          </div>
        </div>
      </div>

      {/* Score Breakdown by Type */}
      <section className="section-container">
        <h2 className="section-title">Score Breakdown by Type</h2>
        <div className="score-breakdown-grid">
          {Object.entries(metrics.byType).map(([type, data]) => (
            <div key={type} className="type-breakdown-card">
              <div className="type-header">
                <span className="type-icon">{getTypeIcon(type)}</span>
                <h3>{type.charAt(0).toUpperCase() + type.slice(1)}s</h3>
              </div>
              <div className="type-stats">
                <div className="type-stat-row">
                  <span className="type-stat-label">Cards:</span>
                  <span className="type-stat-value">{data.count}</span>
                </div>
                <div className="type-stat-row">
                  <span className="type-stat-label">Total Score:</span>
                  <span className="type-stat-value">{data.totalScore}</span>
                </div>
                <div className="type-stat-row">
                  <span className="type-stat-label">Average Score:</span>
                  <span className={`type-stat-value ${getScoreColor(parseFloat(data.avgScore))}`}>
                    {data.avgScore}
                  </span>
                </div>
              </div>
              <div className="type-progress-bar">
                <div
                  className="type-progress-fill"
                  style={{
                    width: `${Math.min(100, Math.max(0, (parseFloat(data.avgScore) + 5) * 10))}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Struggling Cards */}
      <section className="section-container">
        <h2 className="section-title">Cards Needing Practice</h2>
        <p className="section-description">Focus on these cards with the lowest scores</p>

        <div className="struggling-cards-grid">
          {Object.entries(metrics.strugglingCards).map(([type, typeCards]) => (
            <div key={type} className="struggling-type-section">
              <h3 className="struggling-type-title">
                {getTypeIcon(type)} {type.charAt(0).toUpperCase() + type.slice(1)}s
              </h3>
              {typeCards.length === 0 ? (
                <p className="no-cards-message">No cards to display</p>
              ) : (
                <div className="struggling-cards-list">
                  {typeCards.map((card, index) => (
                    <div key={card.id} className="struggling-card">
                      <div className="struggling-card-rank">#{index + 1}</div>
                      <div className="struggling-card-content">
                        <div className="struggling-card-word">{card.word}</div>
                        <div className="struggling-card-definition">{card.definition}</div>
                      </div>
                      <div className={`struggling-card-score ${getScoreColor(card.cardScore)}`}>
                        {card.cardScore}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Practice Recommendations */}
      <section className="section-container">
        <h2 className="section-title">Recommendations</h2>
        <div className="recommendations-grid">
          <div className="recommendation-card">
            <div className="recommendation-icon">🎯</div>
            <h3>Focus on Low Scores</h3>
            <p>Practice cards with scores below 0 to improve your weakest areas</p>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">🔥</div>
            <h3>Use Type-Match Mode</h3>
            <p>Challenge yourself with Type-Match difficulty for better retention</p>
          </div>
          <div className="recommendation-card">
            <div className="recommendation-icon">⭐</div>
            <h3>Flag Difficult Cards</h3>
            <p>Use the flag feature during practice to review struggling cards immediately</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
