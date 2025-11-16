# Next Session Priorities

## High Priority
1. **Expandable Example Sentences**
   - Add expand/collapse state in PracticeGame
   - Show ▶ button if card has examples
   - On click, reveal example sentences
   - Provides context without being too obvious

2. **Complete Database Integration**
   - CardForm component: implement addCard/updateCard calls
   - PracticeGame: persist score updates to IndexedDB (currently in-memory)
   - NewCard page: connect to database
   - Test full CRUD cycle end-to-end

## Blockers/Decisions Needed
- None currently

## Critical Context
- Flag boost now tracks shown cards (shownCards Set) - don't break this logic
- Tag feature uses IndexedDB updateCard() - tags is an array field, avoids duplicates
- Session stats tracking: sessionStats state with correct/incorrect counts
- App deployed at: https://abisogni.github.io/MachMitDeutsch/

---
Last updated: 2025-11-15 | Session: SESSION-20251115-1345
