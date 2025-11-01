# MachMitDeutsch - Architecture Decision Records

> Feature-focused log documenting design decisions, rationale, and alternatives considered.

---

## Decision Format

Each decision follows this structure:

```markdown
## [DEC-XXX] Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by [DEC-YYY]

### Context
What problem are we solving? What constraints exist?

### Decision
What did we decide to do?

### Rationale
Why did we choose this approach? What are the benefits?

### Alternatives Considered
What other options did we evaluate and why did we reject them?

### Consequences
What are the implications of this decision (positive and negative)?
```

---

## [DEC-001] Dark Theme with Desaturated Blues

**Date:** 2025-10-21 (before current session)
**Status:** Accepted

### Context
Need a cohesive visual identity that supports learning - calm, focused, modern interface without distractions.

### Decision
Use desaturated blues (`#0f1419`, `#1a1f2e`, `#252b3b`) as foundation with high-saturation accent colors (`#3b82f6` blue, `#10b981` green for success, `#ef4444` red for errors).

### Rationale
- Dark themes reduce eye strain during extended study sessions
- Desaturated backgrounds create calm learning environment
- High-contrast accents draw attention to interactive elements and feedback
- Modern aesthetic differentiates from older flashcard apps like Anki

### Alternatives Considered
- **Light theme:** Rejected - can be harsh for extended sessions, less modern feel
- **Pure black backgrounds:** Rejected - too stark, less sophisticated
- **Colorful/playful theme:** Rejected - potentially distracting for learning

### Consequences
- Positive: Modern, focused, comfortable for long sessions
- Negative: May require light mode in future for accessibility (noted in Future Enhancements)

---

## [DEC-002] IndexedDB via Dexie.js for Storage

**Date:** 2025-10-21 (before current session)
**Status:** Accepted

### Context
Static webapp hosted on GitHub Pages needs client-side persistence without backend database.

### Decision
Use IndexedDB accessed through Dexie.js wrapper library.

### Rationale
- IndexedDB is browser-native, no external dependencies or API needed
- Dexie.js provides cleaner API than raw IndexedDB
- Supports complex queries (filtering by collection, tags, score range)
- Works offline by default
- No storage size limitations like localStorage (5-10MB limit)

### Alternatives Considered
- **localStorage:** Rejected - 5-10MB limit insufficient, no query capabilities
- **Firebase/Supabase:** Rejected - adds backend complexity, requires authentication, not truly static
- **Raw IndexedDB:** Rejected - verbose API, Dexie provides better DX without significant overhead

### Consequences
- Positive: Simple, powerful, offline-first
- Negative: Data stays on one device/browser (solved via JSON import/export sync mechanism)

---

## [DEC-003] Two Game Modes: "Word Up!" and "Define It!"

**Date:** 2025-10-21 (before current session)
**Status:** Accepted

### Context
Users need to practice both recognition (German → English) and production (English → German) skills.

### Decision
Implement two distinct game modes:
- **Word Up!** - Show German word, select English definition
- **Define It!** - Show English definition, select German word

### Rationale
- Bidirectional practice reinforces learning
- Different modes test different cognitive skills (recognition vs recall)
- Naming is playful and memorable
- User can choose mode based on current learning needs

### Alternatives Considered
- **Single mode with toggle:** Rejected - less clear, requires UI to show current direction
- **Random mix mode:** Rejected - user loses control, can be disorienting
- **Typing answers:** Rejected - too strict for Phase 1, multiple choice reduces friction

### Consequences
- Positive: Comprehensive practice, user control, clear mental model
- Negative: Need to implement distractor selection logic for both directions

---

## [DEC-004] 5-Option Multiple Choice Format

**Date:** 2025-10-21 (before current session)
**Status:** Accepted

### Context
Need to balance difficulty and usability in practice mode.

### Decision
Display 5 answer options (1 correct + 4 distractors) as radio buttons.

### Rationale
- 5 options provides reasonable difficulty (20% random guess chance)
- Radio buttons are familiar, accessible UI pattern
- Fewer options than traditional tests (often 4-6) but harder than true/false
- Enough distractors to be challenging without overwhelming

### Alternatives Considered
- **4 options:** Rejected - 25% guess rate too high
- **6+ options:** Rejected - overwhelming on mobile screens
- **Typing input:** Rejected - too strict (spelling, articles), slows practice
- **Flashcard flip (no options):** Rejected - harder to self-assess, no distractor challenge

### Consequences
- Positive: Good balance of challenge and speed, mobile-friendly
- Negative: Requires minimum 5 cards in database to practice (documented in edge cases)

---

## [DEC-005] Session Documentation Strategy (CHANGELOG + DECISIONS)

**Date:** 2025-10-25
**Status:** Accepted

### Context
Developer frequently starts/stops projects and forgets context when returning. Need persistent, structured way to track progress and decision rationale across sessions.

### Decision
Implement two complementary markdown files:
- **CHANGELOG.md** - Chronological session log (what/when/next)
- **DECISIONS.md** - Feature-focused decision records (why/alternatives)

### Rationale
- Industry-standard patterns (familiar, scalable)
- Clear separation of concerns (temporal vs conceptual)
- Persistent between sessions (unlike TodoWrite which is ephemeral)
- Cross-referencing via decision IDs (e.g., `[DEC-001]`)
- Low maintenance overhead (simple markdown)

### Alternatives Considered
- **Single combined log:** Rejected - would become unwieldy, hard to find specific decisions
- **TodoWrite only:** Rejected - ephemeral, doesn't persist between sessions
- **Git commit messages only:** Rejected - too granular, no high-level context
- **Notion/external tool:** Rejected - adds dependency, not in sync folder

### Consequences
- Positive: Clear project continuity, better decision tracking, works across projects
- Negative: Requires discipline to maintain (mitigated by session-end checklist)

---

## Template for Future Decisions

```markdown
## [DEC-XXX] Decision Title

**Date:** YYYY-MM-DD
**Status:** Proposed | Accepted | Deprecated | Superseded by [DEC-YYY]

### Context
[Problem statement and constraints]

### Decision
[What we decided]

### Rationale
[Why we chose this]

### Alternatives Considered
- **Option 1:** Rejected - [reason]
- **Option 2:** Rejected - [reason]

### Consequences
- Positive: [benefits]
- Negative: [tradeoffs]
```
