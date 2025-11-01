# German Vocabulary Learning Webapp - Project Specification

## Project Overview

A flashcard-style web application for learning German vocabulary, inspired by Anki. The app features spaced repetition through scoring, two game modes, and comprehensive card management. Built as a static webapp to be hosted on GitHub Pages.

## Technical Stack

- **Frontend Framework:** React with Hooks
- **Styling:** CSS Modules or styled-components (refer to STYLE.md)
- **Storage:** Browser-based persistent storage (IndexedDB via Dexie.js)
- **Hosting:** GitHub Pages
- **Build Tool:** Vite
- **Language:** JavaScript/TypeScript

## Data Model

### Card Schema (Enhanced - See [DEC-006], [DEC-009])

```javascript
{
  // Core fields (all card types)
  id: string,              // UUID
  word: string,            // German vocabulary word or phrase
  definition: string,      // English definition
  type: string,            // 'noun' | 'verb' | 'phrase'
  level: string,           // 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'specialized'
  collection: string,      // Topic grouping (e.g., "Business Vocabulary", "IT Terms")
  tags: string[],          // Context tags (e.g., ["meetings", "integration"])
  createdDate: timestamp,  // ISO 8601 format
  cardScore: number,       // Starts at 0, +1 for correct, -1 for incorrect
  viewCount: number,       // Number of times displayed in practice mode

  // Noun-specific fields (optional)
  gender?: string,         // 'der' | 'die' | 'das'
  plural?: string,         // Plural ending (e.g., 'e', 'en', '-', '–')

  // Verb-specific fields (optional)
  verbType?: string,       // 'regular' | 'irregular' | 'modal' | 'separable' | 'reflexive'
  partizipII?: string,     // Perfect participle (e.g., 'gehabt')
  auxiliary?: string,      // 'haben' | 'sein' (for perfect tense)
  separablePrefix?: string, // Prefix for separable verbs (e.g., 'an')
  examples?: {             // Usage examples
    de: string,
    en: string
  },
  relatedCards?: string[], // Array of card IDs for tense variations

  // Phrase-specific fields (optional)
  context?: string         // When/where to use (e.g., "meetings / communication")
}
```

### JSON Import/Export Format

```json
{
  "version": "1.0",
  "exported": "2025-10-21T10:30:00Z",
  "cards": [
    {
      "word": "das Haus",
      "definition": "the house",
      "type": "noun",
      "collection": "A1 Vocabulary",
      "tags": ["buildings", "basic"]
    }
  ]
}
```

Note: On import, system generates `id`, `createdDate`, `cardScore: 0`, and `viewCount: 0`

## Application Architecture

### Main Sections

1. **Card Management Interface**
2. **Practice Interface**

### Routing Structure

```
/ (default)
  ├── /manage
  │   ├── /manage/new
  │   ├── /manage/edit/:id
  │   └── /manage/import
  └── /practice
      ├── /practice/setup
      └── /practice/game
```

## Feature Specifications

### Card Management Interface

#### Card List View
- Display all cards in a sortable/filterable table
- Columns: Word, Definition, Type, Score, Views, Collection, Tags
- Search/filter by any field
- Click row to edit card

#### Create New Card
- Form with all card fields (except id, createdDate, cardScore, viewCount)
- Validation: word and definition required
- Type dropdown with predefined options
- Collection dropdown (populated from existing collections + ability to create new)
- Tag input with autocomplete from existing tags
- Save button creates card with auto-generated id, createdDate, score=0, viewCount=0

#### Edit Card
- Same form as Create, pre-populated with existing data
- Cannot edit: id, createdDate, cardScore, viewCount (display as read-only info)
- Can edit: word, definition, type, collection, tags
- Save button updates card
- Delete button removes card (with confirmation)

#### Import Cards
- File upload input (accepts .json)
- Parse JSON and validate format
- Preview imported cards before confirming
- Option to merge (keep existing + add new) or replace (clear all + add imported)
- Display import summary (X cards imported, Y skipped due to duplicates)

#### Export Cards
- Button to download all cards as JSON
- Filename format: `german-vocab-export-YYYY-MM-DD.json`
- Optional: filter export by collection or tags

### Practice Interface

#### Setup Screen (Load/Start)

**Filter Options:**
- By Collection: Dropdown of all collections
- By Type: Checkboxes for noun, verb, adjective, phrase, other
- By Score Range: Min/Max inputs (e.g., cards with score 0-5)
- By Tags: Multi-select from available tags

**Game Mode Selection:**
- Radio buttons: "Word Up!" or "Define It!"

**Load Button:**
- Validates at least one card matches filters
- Shuffles matching cards
- Navigates to game screen

#### Game Screen

**Card Display:**
- Card counter: "Card X of Y"
- Question (large, prominent):
  - Word Up: Display German word
  - Define It: Display English definition

**Answer Options:**
- 5 radio buttons with labels
- One correct answer from current card
- Four incorrect answers (distractors) randomly selected from other cards in database
- Shuffle order of all 5 options

**Controls:**
- Submit button (disabled until radio selection made)
- "Last Card" checkbox
- Current card score display (optional)

**Submission Flow:**
1. User selects answer
2. User clicks Submit
3. Highlight correct answer (green background)
4. If incorrect, also highlight user's wrong answer (red background)
5. Update card score (+1 correct, -1 incorrect)
6. Increment view count
7. Persist changes to database
8. If "Last Card" checked: Wait 3 seconds, return to practice setup
9. If not last card: Wait 3 seconds, load next card

**Edge Cases:**
- If fewer than 4 distractor cards available, use all available
- If no distractor cards available (only 1 card total), show message: "Need at least 5 cards to practice"

## Storage Implementation

### IndexedDB via Dexie.js

**Database Name:** `germanVocabDB`

**Store:** `cards`

**Indexes:**
- `id` (primary key)
- `collection`
- `type`
- `cardScore`
- `tags` (multi-entry)

### Storage Operations

```javascript
// Core operations needed
- addCard(card)
- updateCard(id, updates)
- deleteCard(id)
- getCard(id)
- getAllCards()
- getCardsByFilter({ collection?, type?, scoreMin?, scoreMax?, tags? })
- importCards(cardArray, mode: 'merge' | 'replace')
- exportCards() -> JSON string
```

## State Management

Use React Context or simple prop drilling for:
- Current practice session (filtered cards, current index, mode)
- Card management state (current filter, sort)

Use local component state for:
- Form inputs
- UI toggles

## Responsive Design

- Mobile-first approach
- Breakpoints: 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

- Practice interface optimized for phone use (large touch targets)
- Card management interface optimized for desktop (table view)

## Development Phases

### Phase 1: Core Setup
- Initialize Vite + React project
- Set up routing
- Configure IndexedDB/Dexie
- Create basic layout shell

### Phase 2: Card Management
- Card list view
- Create/Edit card forms
- Delete functionality

### Phase 3: Import/Export
- JSON import with validation
- JSON export

### Phase 4: Practice Mode
- Setup screen with filters
- Game screen with Word Up mode
- Scoring and persistence

### Phase 5: Polish
- Define It mode
- Styling per STYLE.md
- Responsive design
- Testing across devices

### Phase 6: Deployment
- GitHub Pages configuration
- Build optimization
- Documentation

## Future Enhancements (Out of Scope for v1)

- Spaced repetition algorithm (show low-score cards more frequently)
- Statistics dashboard
- Audio pronunciation
- Image support for cards
- Multiple language support
- Dark/light theme toggle
- Keyboard shortcuts
- Offline PWA support

## Testing Strategy

- Manual testing on all target devices
- Test data sync via export/import
- Edge case testing (empty database, single card, etc.)
- Cross-browser testing (Chrome, Safari, Firefox)

## Deployment

- Build command: `npm run build`
- Deploy to GitHub Pages from `gh-pages` branch or `/docs` folder
- Custom domain optional
- HTTPS enforced