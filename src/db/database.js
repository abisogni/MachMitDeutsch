import Dexie from 'dexie';

// Initialize Dexie database
export const db = new Dexie('germanVocabDB');

// Define database schema
db.version(1).stores({
  cards: '++id, word, type, collection, cardScore, *tags, createdDate'
});

// Card class (optional - adds type hints and methods)
db.cards.mapToClass(class Card {
  constructor(data) {
    Object.assign(this, data);
  }
});

// ============================================
// CRUD Operations
// ============================================

/**
 * Add a new card to the database
 * Auto-generates: id, createdDate, cardScore, viewCount
 */
export async function addCard(cardData) {
  const card = {
    ...cardData,
    createdDate: new Date().toISOString(),
    cardScore: 0,
    viewCount: 0,
  };

  const id = await db.cards.add(card);
  return { ...card, id };
}

/**
 * Update an existing card
 */
export async function updateCard(id, updates) {
  await db.cards.update(id, updates);
  return await db.cards.get(id);
}

/**
 * Delete a card by ID
 */
export async function deleteCard(id) {
  await db.cards.delete(id);
}

/**
 * Get a single card by ID
 */
export async function getCard(id) {
  return await db.cards.get(id);
}

/**
 * Get all cards
 */
export async function getAllCards() {
  return await db.cards.toArray();
}

/**
 * Get cards by filter criteria
 */
export async function getCardsByFilter(filters = {}) {
  let query = db.cards;

  // Apply collection filter
  if (filters.collection) {
    query = query.where('collection').equals(filters.collection);
  }

  // Get filtered results
  let results = await query.toArray();

  // Apply additional filters
  if (filters.type) {
    results = results.filter(card => card.type === filters.type);
  }

  if (filters.types && filters.types.length > 0) {
    results = results.filter(card => filters.types.includes(card.type));
  }

  if (filters.scoreMin !== undefined) {
    results = results.filter(card => card.cardScore >= filters.scoreMin);
  }

  if (filters.scoreMax !== undefined) {
    results = results.filter(card => card.cardScore <= filters.scoreMax);
  }

  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(card =>
      filters.tags.some(tag => card.tags && card.tags.includes(tag))
    );
  }

  return results;
}

/**
 * Get all unique collections
 */
export async function getCollections() {
  const cards = await db.cards.toArray();
  const collections = [...new Set(cards.map(card => card.collection))];
  return collections.filter(Boolean).sort();
}

/**
 * Get all unique tags
 */
export async function getTags() {
  const cards = await db.cards.toArray();
  const allTags = cards.flatMap(card => card.tags || []);
  return [...new Set(allTags)].sort();
}

// ============================================
// Import/Export Operations
// ============================================

/**
 * Import cards from JSON array
 * @param {Array} cardArray - Array of card objects
 * @param {Object} options - Import options
 * @param {boolean} options.checkDuplicates - Check for duplicates before importing
 * @returns {Object} - Import results summary
 */
export async function importCards(cardArray, options = {}) {
  const { checkDuplicates = true } = options;

  const results = {
    total: cardArray.length,
    imported: 0,
    duplicates: 0,
    errors: 0,
    duplicateWords: []
  };

  for (const cardData of cardArray) {
    try {
      // Check for duplicates if enabled
      if (checkDuplicates) {
        const existing = await db.cards
          .where('word')
          .equals(cardData.word)
          .first();

        if (existing) {
          results.duplicates++;
          results.duplicateWords.push(cardData.word);
          continue;
        }
      }

      // Add the card
      await addCard(cardData);
      results.imported++;
    } catch (error) {
      console.error('Error importing card:', cardData, error);
      results.errors++;
    }
  }

  return results;
}

/**
 * Replace all cards with imported data (clear database first)
 */
export async function replaceAllCards(cardArray) {
  await db.cards.clear();

  const results = {
    total: cardArray.length,
    imported: 0,
    errors: 0
  };

  for (const cardData of cardArray) {
    try {
      await addCard(cardData);
      results.imported++;
    } catch (error) {
      console.error('Error importing card:', cardData, error);
      results.errors++;
    }
  }

  return results;
}

/**
 * Export all cards to JSON format
 */
export async function exportCards(filters = null) {
  const cards = filters
    ? await getCardsByFilter(filters)
    : await getAllCards();

  // Remove auto-generated fields for clean export
  const exportData = cards.map(({ id, createdDate, cardScore, viewCount, ...rest }) => rest);

  return {
    version: '1.0',
    exported: new Date().toISOString(),
    cards: exportData
  };
}

/**
 * Get database statistics
 */
export async function getStats() {
  const cards = await getAllCards();

  return {
    totalCards: cards.length,
    byType: {
      noun: cards.filter(c => c.type === 'noun').length,
      verb: cards.filter(c => c.type === 'verb').length,
      phrase: cards.filter(c => c.type === 'phrase').length,
    },
    collections: await getCollections(),
    tags: await getTags(),
  };
}
