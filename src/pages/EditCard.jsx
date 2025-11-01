import { Link, useParams } from 'react-router-dom';

function EditCard() {
  const { id } = useParams();

  return (
    <div>
      <h1>Edit Card</h1>
      <p>Editing card ID: {id}</p>
      <p>Card edit form will appear here...</p>
      <div style={{ marginTop: '1rem' }}>
        <Link to="/manage">
          <button>Back to Card List</button>
        </Link>
      </div>
    </div>
  );
}

export default EditCard;
