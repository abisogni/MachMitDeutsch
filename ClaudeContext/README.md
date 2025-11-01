# ClaudeContext - MachMitDeutsch

This directory contains documentation to help Claude understand and work on this project.

## How to Navigate This Project

### Core Documentation
- **PROJECT.md** - Project goals, specifications, and architecture for the German vocabulary webapp
- **STYLE.md** - Complete design system (colors, typography, components, dark theme)
- **CHANGELOG.md** - Session-based development history
- **DECISIONS.md** - Important design and architecture decisions (ADR format)
- **sessions/** - Detailed notes from individual work sessions

### When Starting a Session

**BEST PRACTICE:** Use `/project-start` slash command, which will:
1. Read the most recent CHANGELOG.md entry
2. Review PROJECT.md for overall context
3. Show what was accomplished last session
4. Suggest where to begin

**Manual approach:**
1. Read the most recent CHANGELOG.md entry (reverse chronological)
2. Review PROJECT.md for overall context and current phase
3. Check DECISIONS.md for relevant design decisions
4. Review session snapshots if needed for deeper context

### When Ending a Session

**BEST PRACTICE:** Use `/project-end` slash command, which will:
1. Update CHANGELOG.md with session summary
2. Generate session ID for tracking
3. Document completed work and next steps
4. Preserve critical context
5. Optionally create detailed session snapshot

## Project-Specific Notes

### Project Type
React-based web application for German vocabulary flashcards (Anki-like)

### Tech Stack
- React with Hooks
- Vite (build tool)
- IndexedDB via Dexie.js (client-side storage)
- CSS Modules or styled-components
- GitHub Pages (hosting)

### Design System
Complete dark theme design system documented in STYLE.md:
- Desaturated blue backgrounds (`#0f1419`, `#1a1f2e`, `#252b3b`)
- High-saturation accents (blue, green, red for feedback)
- Mobile-first responsive approach

### Development Phases
Outlined in PROJECT.md:
1. Core Setup (Vite + React + routing + IndexedDB)
2. Card Management (CRUD operations)
3. Import/Export (JSON)
4. Practice Mode (game mechanics)
5. Polish (styling, responsive)
6. Deployment (GitHub Pages)

### Key Features
- Two game modes: "Word Up!" (German→English) and "Define It!" (English→German)
- Card scoring system (±1 for correct/incorrect)
- Collections and tags for organization
- 5-option multiple choice format
- Import/Export via JSON

### Quick Reference
- **Card schema:** See PROJECT.md lines 18-32
- **Routing structure:** See PROJECT.md lines 61-72
- **Storage operations:** See PROJECT.md lines 178-190
- **Color palette:** See STYLE.md lines 7-44
- **Component specs:** See STYLE.md lines 126-428

### Testing Checklist
(To be used once app is built)
- Manual testing on mobile, tablet, desktop
- Test with empty database
- Test with single card (edge case)
- Test import/export functionality
- Cross-browser (Chrome, Safari, Firefox)

### Deployment
- Build: `npm run build`
- Deploy to GitHub Pages
- See PROJECT.md lines 264-269 for details

## Universal Slash Commands Available

These commands work across all projects:
- `/project-start` - Begin a work session
- `/project-end` - Wrap up and save context
- `/project-assess` - Evaluate project structure
- `/project-init` - Initialize new project structure

## Notes
- Project syncs between M3 MacBook and M1 Mac Mini via Sync.com
- Located at: `~/Documents/Sync Files/Sync/WideSpan/MachMitDeutsch/`
- This is a side project for learning German vocabulary
