# MachMitDeutsch

A flashcard-style web application for learning German vocabulary, inspired by Anki. Features spaced repetition through scoring, two game modes, comprehensive card management, and persistent browser-based storage.

🌐 **Live Demo:** https://abisogni.github.io/MachMitDeutsch/

## Features

### Learning Modes
- **Word Up!** - See German word, choose English translation
- **Define It!** - See English definition, choose German word
- **Difficulty Settings:**
  - **Mixed Mode:** Distractors from any card type (easier - use context clues)
  - **Type-Match Mode:** Distractors only from same type (harder - no pattern clues)

### Card Management
- **Import/Export** - JSON-based card management
- **Smart Filtering** - Filter by collection, type, tags, or score range
- **Card Types:** Nouns (with gender/plural), Verbs (with examples), Phrases (with context)
- **Collections & Tags** - Organize vocabulary by topic and theme

### Learning Features
- **Card Scoring** - Track performance (+1 correct, -1 incorrect)
- **Flag for Review** - 20% boost to review specific cards during session
- **Progress Tracking** - Dashboard with metrics by card type
- **Mobile-First Design** - Responsive dark theme optimized for phone and desktop

## Tech Stack

- **Frontend:** React 19 with Hooks
- **Build Tool:** Vite 7
- **Routing:** React Router v7
- **Storage:** IndexedDB via Dexie.js (client-side persistent storage)
- **Styling:** CSS Modules with dark theme
- **Hosting:** GitHub Pages

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/abisogni/MachMitDeutsch.git
cd MachMitDeutsch

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/` to view the app.

### Build for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Build and deploy to gh-pages branch
npm run deploy
```

## Project Structure

```
MachMitDeutsch/
├── src/
│   ├── components/       # Reusable React components
│   ├── pages/           # Page-level components
│   ├── styles/          # CSS module files
│   ├── db/              # IndexedDB database layer (Dexie.js)
│   └── utils/           # Utility functions
├── data/
│   ├── cards/           # Source vocabulary JSON files
│   ├── CARD_TEMPLATE_v2.md  # LLM guide for generating cards
│   ├── card_template_v2.json # Template example
│   └── convert-to-app-format.cjs # Conversion utility
├── ClaudeContext/       # Project documentation
│   ├── CHANGELOG.md     # Development history
│   ├── DECISIONS.md     # Architecture decisions
│   ├── PROJECT.md       # Project specifications
│   └── STYLE.md         # Design system
└── public/              # Static assets
```

## Card Format

Cards are stored in JSON format with the following structure:

```json
{
  "version": "1.0",
  "exported": "2025-11-11T12:00:00Z",
  "cards": [
    {
      "word": "die Schnittstelle",
      "definition": "interface",
      "type": "noun",
      "level": "B1",
      "collection": "IT Vocabulary",
      "tags": ["technical"],
      "gender": "die",
      "plural": "n"
    }
  ]
}
```

See `data/CARD_TEMPLATE_v2.md` for complete field documentation.

## Database Schema

- **Database:** `germanVocabDB`
- **Store:** `cards`
- **Indexes:** id (primary), word, type, collection, cardScore, tags (multi-entry)
- **Auto-generated fields:** id, createdDate, cardScore (starts at 0), viewCount

## Development Phases

- [x] **Phase 1:** Core Setup (Vite + React + routing + IndexedDB)
- [x] **Phase 2:** UI Development (card management, practice modes)
- [x] **Phase 3:** Database Integration (import/export, persistence)
- [ ] **Phase 4:** Backend Integration (card creation/editing, score persistence)
- [ ] **Phase 5:** Enhancements (bug fixes, feature additions)
- [ ] **Phase 6:** Polish & Testing (cross-browser, performance)

## Contributing

This is a personal learning project. Feel free to fork and adapt for your own language learning needs!

## Documentation

For detailed project documentation, see:
- `ClaudeContext/PROJECT.md` - Complete project specifications
- `ClaudeContext/STYLE.md` - Design system and UI guidelines
- `ClaudeContext/CHANGELOG.md` - Development history
- `ClaudeContext/DECISIONS.md` - Architecture decision records

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Built with Claude Code
- Inspired by Anki flashcard system
- German vocabulary focused on IT/Business contexts
