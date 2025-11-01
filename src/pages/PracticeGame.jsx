import { Link } from 'react-router-dom';

function PracticeGame() {
  return (
    <div>
      <h1>Practice Game</h1>
      <p>Game interface will appear here...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/practice/setup">
          <button>Back to Setup</button>
        </Link>
      </div>
    </div>
  );
}

export default PracticeGame;
