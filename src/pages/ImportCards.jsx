import { Link } from 'react-router-dom';

function ImportCards() {
  return (
    <div>
      <h1>Import Cards</h1>
      <p>File upload and import interface will appear here...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/manage">
          <button>Back to Card List</button>
        </Link>
      </div>
    </div>
  );
}

export default ImportCards;
