import { Link } from 'react-router-dom';

function NewCard() {
  return (
    <div>
      <h1>Add New Card</h1>
      <p>Card creation form will appear here...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/manage">
          <button>Back to Card List</button>
        </Link>
      </div>
    </div>
  );
}

export default NewCard;
