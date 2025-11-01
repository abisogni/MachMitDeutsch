import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CardForm.css';

function CardForm({ initialCard = null, mode = 'new' }) {
  const navigate = useNavigate();

  // Initialize form state
  const [formData, setFormData] = useState({
    word: initialCard?.word || '',
    definition: initialCard?.definition || '',
    type: initialCard?.type || 'noun',
    level: initialCard?.level || 'A1',  // Universal field for all types
    collection: initialCard?.collection || '',
    tags: initialCard?.tags?.join(', ') || '',
    // Noun-specific
    gender: initialCard?.gender || 'der',
    plural: initialCard?.plural || '',
    // Verb-specific
    verbType: initialCard?.verbType || 'regular',
    partizipII: initialCard?.partizipII || '',
    auxiliary: initialCard?.auxiliary || 'haben',
    separablePrefix: initialCard?.separablePrefix || '',
    exampleDe: initialCard?.examples?.de || '',
    exampleEn: initialCard?.examples?.en || '',
    // Phrase-specific
    context: initialCard?.context || ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.word.trim()) {
      newErrors.word = 'German word/phrase is required';
    }

    if (!formData.definition.trim()) {
      newErrors.definition = 'English definition is required';
    }

    if (!formData.collection.trim()) {
      newErrors.collection = 'Collection is required';
    }

    // Type-specific validation
    if (formData.type === 'noun' && !formData.plural.trim()) {
      newErrors.plural = 'Plural form is required';
    }

    if (formData.type === 'verb') {
      if (formData.exampleDe.trim() && !formData.exampleEn.trim()) {
        newErrors.exampleEn = 'English translation required if German example provided';
      }
      if (formData.exampleEn.trim() && !formData.exampleDe.trim()) {
        newErrors.exampleDe = 'German example required if English translation provided';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build card object
    const card = {
      word: formData.word.trim(),
      definition: formData.definition.trim(),
      type: formData.type,
      level: formData.level,
      collection: formData.collection.trim(),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    };

    // Add type-specific fields
    if (formData.type === 'noun') {
      card.gender = formData.gender;
      card.plural = formData.plural.trim();
    } else if (formData.type === 'verb') {
      card.verbType = formData.verbType;
      if (formData.partizipII.trim()) {
        card.partizipII = formData.partizipII.trim();
      }
      card.auxiliary = formData.auxiliary;
      if (formData.separablePrefix.trim()) {
        card.separablePrefix = formData.separablePrefix.trim();
      }
      if (formData.exampleDe.trim() && formData.exampleEn.trim()) {
        card.examples = {
          de: formData.exampleDe.trim(),
          en: formData.exampleEn.trim()
        };
      }
    } else if (formData.type === 'phrase') {
      if (formData.context.trim()) {
        card.context = formData.context.trim();
      }
    }

    console.log('Card to save:', card);
    // TODO: Save to database

    // Show success message and redirect
    alert(`Card ${mode === 'new' ? 'created' : 'updated'} successfully!`);
    navigate('/manage');
  };

  const handleCancel = () => {
    navigate('/manage');
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h2>Basic Information</h2>

        <div className="form-group">
          <label htmlFor="type">Card Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="form-input"
          >
            <option value="noun">📝 Noun</option>
            <option value="verb">⚡ Verb</option>
            <option value="phrase">💬 Phrase</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="word">
            German {formData.type === 'phrase' ? 'Phrase' : 'Word'} *
          </label>
          <input
            type="text"
            id="word"
            name="word"
            value={formData.word}
            onChange={handleChange}
            placeholder={
              formData.type === 'noun' ? 'e.g., der Benutzer' :
              formData.type === 'verb' ? 'e.g., integrieren' :
              'e.g., Können wir das bitte später besprechen?'
            }
            className={`form-input ${errors.word ? 'error' : ''}`}
          />
          {errors.word && <span className="error-message">{errors.word}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="definition">
            English {formData.type === 'phrase' ? 'Translation' : 'Definition'} *
          </label>
          <input
            type="text"
            id="definition"
            name="definition"
            value={formData.definition}
            onChange={handleChange}
            placeholder={
              formData.type === 'noun' ? 'e.g., user' :
              formData.type === 'verb' ? 'e.g., to integrate' :
              'e.g., Can we please discuss this later?'
            }
            className={`form-input ${errors.definition ? 'error' : ''}`}
          />
          {errors.definition && <span className="error-message">{errors.definition}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="level">Difficulty Level (CEFR) *</label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="form-input"
          >
            <option value="A1">A1 - Beginner</option>
            <option value="A2">A2 - Elementary</option>
            <option value="B1">B1 - Intermediate</option>
            <option value="B2">B2 - Upper Intermediate</option>
            <option value="C1">C1 - Advanced</option>
            <option value="C2">C2 - Mastery</option>
            <option value="specialized">Specialized - Business/Technical</option>
          </select>
          <small className="form-help">
            CEFR proficiency level or "Specialized" for technical jargon
          </small>
        </div>
      </div>

      {/* Noun-specific fields */}
      {formData.type === 'noun' && (
        <div className="form-section">
          <h2>Noun Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="gender">Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-input"
              >
                <option value="der">der (masculine)</option>
                <option value="die">die (feminine)</option>
                <option value="das">das (neuter)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="plural">Plural Ending *</label>
              <input
                type="text"
                id="plural"
                name="plural"
                value={formData.plural}
                onChange={handleChange}
                placeholder="e.g., e, en, er, -, –"
                className={`form-input ${errors.plural ? 'error' : ''}`}
              />
              {errors.plural && <span className="error-message">{errors.plural}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Verb-specific fields */}
      {formData.type === 'verb' && (
        <div className="form-section">
          <h2>Verb Details</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="verbType">Verb Type *</label>
              <select
                id="verbType"
                name="verbType"
                value={formData.verbType}
                onChange={handleChange}
                className="form-input"
              >
                <option value="regular">Regular</option>
                <option value="irregular">Irregular</option>
                <option value="modal">Modal (sollen, müssen, etc.)</option>
                <option value="separable">Separable</option>
                <option value="reflexive">Reflexive</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="auxiliary">Perfect Tense Auxiliary *</label>
              <select
                id="auxiliary"
                name="auxiliary"
                value={formData.auxiliary}
                onChange={handleChange}
                className="form-input"
              >
                <option value="haben">haben</option>
                <option value="sein">sein</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="partizipII">Partizip II (Optional)</label>
              <input
                type="text"
                id="partizipII"
                name="partizipII"
                value={formData.partizipII}
                onChange={handleChange}
                placeholder="e.g., gehabt, integriert"
                className="form-input"
              />
              <small className="form-help">Perfect participle form</small>
            </div>

            <div className="form-group">
              <label htmlFor="separablePrefix">Separable Prefix (Optional)</label>
              <input
                type="text"
                id="separablePrefix"
                name="separablePrefix"
                value={formData.separablePrefix}
                onChange={handleChange}
                placeholder="e.g., an, auf, mit"
                className="form-input"
              />
              <small className="form-help">For separable verbs only</small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="exampleDe">German Example Sentence (Optional)</label>
            <textarea
              id="exampleDe"
              name="exampleDe"
              value={formData.exampleDe}
              onChange={handleChange}
              placeholder="e.g., Wir integrieren Salesforce mit SAP BTP."
              rows="2"
              className={`form-input ${errors.exampleDe ? 'error' : ''}`}
            />
            {errors.exampleDe && <span className="error-message">{errors.exampleDe}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="exampleEn">English Example Translation (Optional)</label>
            <textarea
              id="exampleEn"
              name="exampleEn"
              value={formData.exampleEn}
              onChange={handleChange}
              placeholder="e.g., We integrate Salesforce with SAP BTP."
              rows="2"
              className={`form-input ${errors.exampleEn ? 'error' : ''}`}
            />
            {errors.exampleEn && <span className="error-message">{errors.exampleEn}</span>}
          </div>
        </div>
      )}

      {/* Phrase-specific fields */}
      {formData.type === 'phrase' && (
        <div className="form-section">
          <h2>Phrase Details</h2>

          <div className="form-group">
            <label htmlFor="context">Context / When to Use (Optional)</label>
            <input
              type="text"
              id="context"
              name="context"
              value={formData.context}
              onChange={handleChange}
              placeholder="e.g., meetings / communication"
              className="form-input"
            />
            <small className="form-help">Describe when or where to use this phrase</small>
          </div>
        </div>
      )}

      {/* Organization */}
      <div className="form-section">
        <h2>Organization</h2>

        <div className="form-group">
          <label htmlFor="collection">Collection *</label>
          <input
            type="text"
            id="collection"
            name="collection"
            value={formData.collection}
            onChange={handleChange}
            placeholder="e.g., Business Vocabulary, IT Terms"
            className={`form-input ${errors.collection ? 'error' : ''}`}
          />
          {errors.collection && <span className="error-message">{errors.collection}</span>}
          <small className="form-help">Topic/theme grouping for this card</small>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags (Optional)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., integration, technical, communication"
            className="form-input"
          />
          <small className="form-help">Comma-separated context tags for filtering</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {mode === 'new' ? '✓ Create Card' : '✓ Save Changes'}
        </button>
        <button type="button" onClick={handleCancel} className="btn-secondary">
          ✕ Cancel
        </button>
      </div>
    </form>
  );
}

export default CardForm;
