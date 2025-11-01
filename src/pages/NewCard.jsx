import CardForm from '../components/CardForm';

function NewCard() {
  return (
    <div className="page-container">
      <h1>Add New Card</h1>
      <p className="page-description">Create a new vocabulary card for your collection.</p>
      <CardForm mode="new" />
    </div>
  );
}

export default NewCard;
