import { Link } from 'react-router-dom';

function PracticeSetup() {
  return (
    <div>
      <h1>Practice Setup</h1>
      <p>Filter and game mode selection will appear here...</p>
      <div style={{ marginTop: '1rem' }}>
        <button>Start Practice</button>
      </div>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

export default PracticeSetup;
