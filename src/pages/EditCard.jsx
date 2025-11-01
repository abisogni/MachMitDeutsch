import { useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { loadMockCards } from '../utils/mockData';
import CardForm from '../components/CardForm';

function EditCard() {
  const { id } = useParams();
  const cards = useMemo(() => loadMockCards(), []);
  const card = cards.find(c => c.id === id);

  if (!card) {
    return <Navigate to="/manage" replace />;
  }

  return (
    <div className="page-container">
      <h1>Edit Card</h1>
      <p className="page-description">
        Editing: <strong>{card.word}</strong>
      </p>
      <CardForm mode="edit" initialCard={card} />
    </div>
  );
}

export default EditCard;
