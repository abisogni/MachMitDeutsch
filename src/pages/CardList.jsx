import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { loadMockCards, getCollections, getTypes } from '../utils/mockData';
import '../styles/CardList.css';

function CardList() {
  const allCards = useMemo(() => loadMockCards(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCollection, setFilterCollection] = useState('');
  const [sortBy, setSortBy] = useState('word');
  const [sortOrder, setSortOrder] = useState('asc');

  const collections = useMemo(() => getCollections(allCards), [allCards]);
  const types = useMemo(() => getTypes(), []);

  // Filter cards
  const filteredCards = useMemo(() => {
    return allCards.filter(card => {
      const matchesSearch = searchTerm === '' ||
        card.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.definition.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === '' || card.type === filterType;
      const matchesCollection = filterCollection === '' || card.collection === filterCollection;

      return matchesSearch && matchesType && matchesCollection;
    });
  }, [allCards, searchTerm, filterType, filterCollection]);

  // Sort cards
  const sortedCards = useMemo(() => {
    const sorted = [...filteredCards];
    sorted.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === 'cardScore' || sortBy === 'viewCount') {
        aVal = Number(aVal);
        bVal = Number(bVal);
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCards, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'noun': return '📝';
      case 'verb': return '⚡';
      case 'phrase': return '💬';
      default: return '📄';
    }
  };

  return (
    <div className="card-list-container">
      <div className="header">
        <h1>Manage Cards</h1>
        <div className="stats">
          <span className="stat-badge">{allCards.length} total cards</span>
          <span className="stat-badge">{filteredCards.length} shown</span>
        </div>
      </div>

      <div className="actions">
        <Link to="/manage/new">
          <button className="btn-primary">➕ Add New Card</button>
        </Link>
        <Link to="/manage/import">
          <button className="btn-secondary">📥 Import Cards</button>
        </Link>
        <button className="btn-secondary">📤 Export Cards</button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="🔍 Search cards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="">All Types</option>
          {types.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          className="filter-select"
        >
          <option value="">All Collections</option>
          {collections.map(collection => (
            <option key={collection} value={collection}>{collection}</option>
          ))}
        </select>

        {(searchTerm || filterType || filterCollection) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('');
              setFilterCollection('');
            }}
            className="btn-clear"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="cards-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('type')} className="sortable">
                Type {sortBy === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('word')} className="sortable">
                German {sortBy === 'word' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('definition')} className="sortable">
                English {sortBy === 'definition' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('collection')} className="sortable">
                Collection {sortBy === 'collection' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('cardScore')} className="sortable">
                Score {sortBy === 'cardScore' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('viewCount')} className="sortable">
                Views {sortBy === 'viewCount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCards.map(card => (
              <tr key={card.id}>
                <td>
                  <span className={`type-badge type-${card.type}`}>
                    {getTypeIcon(card.type)} {card.type}
                  </span>
                </td>
                <td className="word-cell">{card.word}</td>
                <td className="definition-cell">{card.definition}</td>
                <td className="collection-cell">{card.collection}</td>
                <td className="score-cell">{card.cardScore}</td>
                <td className="views-cell">{card.viewCount}</td>
                <td className="actions-cell">
                  <Link to={`/manage/edit/${card.id}`}>
                    <button className="btn-small">Edit</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredCards.length === 0 && (
        <div className="no-results">
          <p>No cards found matching your filters.</p>
          <button onClick={() => {
            setSearchTerm('');
            setFilterType('');
            setFilterCollection('');
          }}>
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default CardList;
