import { Link } from 'react-router-dom';

function CardList() {
  return (
    <div>
      <h1>Manage Cards</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/manage/new">
          <button>Add New Card</button>
        </Link>
        <Link to="/manage/import" style={{ marginLeft: '1rem' }}>
          <button>Import Cards</button>
        </Link>
        <button style={{ marginLeft: '1rem' }}>Export Cards</button>
      </div>
      <p>Card list will appear here...</p>
    </div>
  );
}

export default CardList;
