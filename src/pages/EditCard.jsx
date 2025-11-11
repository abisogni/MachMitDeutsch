import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getCard } from '../db/database';
import CardForm from '../components/CardForm';

function EditCard() {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadCard = async () => {
      try {
        const foundCard = await getCard(parseInt(id));
        if (foundCard) {
          setCard(foundCard);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error loading card:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    loadCard();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading card...</p>
      </div>
    );
  }

  if (notFound || !card) {
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
