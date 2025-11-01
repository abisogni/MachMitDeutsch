// Import the vocabulary JSON files
import nounsData from '../../data/nouns_v2.json';
import verbsData from '../../data/verbs_v3.json';
import phrasesData from '../../data/phrases_v1.json';

// Generate a simple UUID
function generateId() {
  return 'card-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Transform noun data to app schema
function transformNoun(noun) {
  return {
    id: generateId(),
    word: noun.term,
    definition: noun.gloss,
    type: 'noun',
    level: 'specialized',  // Business/IT nouns are specialized vocabulary
    gender: noun.gender,
    plural: noun.plural,
    collection: 'Business Nouns',
    tags: ['business', 'IT'],
    cardScore: 0,
    viewCount: 0,
    createdDate: new Date().toISOString()
  };
}

// Transform verb data to app schema
function transformVerb(verb) {
  // Map old levels to CEFR
  const levelMap = {
    'common': 'A2',
    'intermediate': 'B1',
    'expert': 'specialized'
  };

  const card = {
    id: generateId(),
    word: verb.term,
    definition: verb.translations.join(' / '),
    type: 'verb',
    level: levelMap[verb.level] || 'B1',
    collection: `${verb.level.charAt(0).toUpperCase() + verb.level.slice(1)} Verbs`,
    tags: verb.domain || [],
    // Verb metadata (using defaults since original data doesn't have these)
    verbType: 'regular',  // Would need linguistic analysis to determine
    auxiliary: 'haben',    // Most German verbs use haben
    cardScore: 0,
    viewCount: 0,
    createdDate: new Date().toISOString()
  };

  // Add examples if present
  if (verb.example_de && verb.example_en) {
    card.examples = {
      de: verb.example_de,
      en: verb.example_en
    };
  }

  return card;
}

// Transform phrase data to app schema
function transformPhrase(phrase) {
  const card = {
    id: generateId(),
    word: phrase.term,
    definition: phrase.translation,
    type: 'phrase',
    level: 'specialized',  // Business phrases are specialized vocabulary
    collection: 'Business Phrases',
    tags: phrase.context ? phrase.context.split(' / ').map(t => t.trim()) : [],
    cardScore: 0,
    viewCount: 0,
    createdDate: new Date().toISOString()
  };

  // Add context if present
  if (phrase.context) {
    card.context = phrase.context;
  }

  return card;
}

// Load and transform all card data
export function loadMockCards() {
  const nouns = nounsData.map(transformNoun);
  const verbs = verbsData.map(transformVerb);
  const phrases = phrasesData.map(transformPhrase);

  return [...nouns, ...verbs, ...phrases];
}

// Get all unique collections
export function getCollections(cards) {
  const collections = new Set(cards.map(card => card.collection));
  return Array.from(collections).sort();
}

// Get all unique tags
export function getTags(cards) {
  const tags = new Set();
  cards.forEach(card => {
    if (card.tags) {
      card.tags.forEach(tag => tags.add(tag));
    }
  });
  return Array.from(tags).sort();
}

// Get all card types
export function getTypes() {
  return ['noun', 'verb', 'phrase'];
}

// Filter cards based on criteria
export function filterCards(cards, filters) {
  return cards.filter(card => {
    // Filter by collection
    if (filters.collection && card.collection !== filters.collection) {
      return false;
    }

    // Filter by type
    if (filters.type && card.type !== filters.type) {
      return false;
    }

    // Filter by tags
    if (filters.tags && filters.tags.length > 0) {
      const hasTag = filters.tags.some(tag => card.tags.includes(tag));
      if (!hasTag) return false;
    }

    // Filter by score range
    if (filters.scoreMin !== undefined && card.cardScore < filters.scoreMin) {
      return false;
    }
    if (filters.scoreMax !== undefined && card.cardScore > filters.scoreMax) {
      return false;
    }

    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesWord = card.word.toLowerCase().includes(searchLower);
      const matchesDefinition = card.definition.toLowerCase().includes(searchLower);
      if (!matchesWord && !matchesDefinition) {
        return false;
      }
    }

    return true;
  });
}
