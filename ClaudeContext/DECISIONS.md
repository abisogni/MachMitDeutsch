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

## [DEC-006] Enhanced Card Schema for Rich Vocabulary Data

**Date:** 2025-11-01
**Status:** Accepted

### Context
User provided existing vocabulary data with rich metadata (gender/plural for nouns, difficulty levels and examples for verbs, contextual usage for phrases). Initial PROJECT.md schema was too simple and would lose valuable learning information.

### Decision
Enhance card schema to preserve all rich metadata while maintaining simple core structure:
- Core fields: `id`, `word`, `definition`, `type`, `collection`, `tags`, `cardScore`, `viewCount`, `createdDate`
- Type-specific optional fields:
  - Nouns: `gender` (der/die/das), `plural` (ending)
  - Verbs: `level` (common/intermediate/expert), `examples` (de/en)
  - Phrases: `context` (when to use)

### Rationale
- Preserves user's existing investment in curated vocabulary data
- Richer data improves learning outcomes (gender helps with noun recall, examples show usage)
- Optional fields maintain backward compatibility with simple cards
- Schema mirrors real-world language learning needs

### Alternatives Considered
- **Flatten to simple schema only:** Rejected - loses valuable educational metadata
- **Separate schemas per type:** Rejected - adds complexity to data management
- **External metadata files:** Rejected - breaks data portability and import/export

### Consequences
- Positive: All user vocabulary data preserved, better learning experience
- Positive: LLM card generation can produce high-quality educational content
- Negative: Slightly more complex data model (mitigated by optional fields)
- Negative: Forms need conditional fields based on card type

---

## [DEC-007] UI-First Development Approach with Mock Data

**Date:** 2025-11-01
**Status:** Accepted

### Context
User requested visual-first workflow: "I'd like to see what buttons there are and where, then connect things to the interface...seeing a pretty close to production-ready web interface, even if nothing is connected to the buttons yet."

### Decision
Implement Phase 2 (UI Development) before Phase 3 (Database Integration):
1. Build all UI components with full styling and interactions
2. Use mock data loaded from JSON files to populate interfaces
3. Make everything visually complete and interactive
4. Only after UI is validated, connect IndexedDB backend

### Rationale
- User is visual learner - seeing progress is more engaging and motivating
- Validates UX flows and design before backend complexity
- Easier to iterate on design with mock data vs. database constraints
- Complete design system (STYLE.md) already exists - leverage it early
- User can provide feedback on actual interface, not wireframes

### Alternatives Considered
- **Traditional backend-first:** Rejected - less engaging for visual learners, harder to iterate
- **Wireframes/prototypes first:** Rejected - user wants real, functional interface
- **Parallel UI + backend:** Rejected - context-switching overhead, harder to iterate

### Consequences
- Positive: Immediate visual progress and user engagement
- Positive: Easy to validate UX and get feedback
- Positive: Mock data transformers become import utilities later
- Negative: Need to refactor from mock to real data (mitigated by consistent data structure)
- Negative: Might discover backend constraints late (acceptable risk)

---

## [DEC-008] Mobile-First Responsive Design

**Date:** 2025-11-01
**Status:** Accepted

### Context
User explicitly requested: "I'd like to keep the design functional for browser AND mobile" and emphasized importance throughout session. App needs to work on desktop (development/bulk management) and mobile (on-the-go practice).

### Decision
Implement mobile-first responsive design approach:
- Start with mobile layout as base
- Use CSS Grid and Flexbox for adaptive layouts
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Touch-friendly targets on mobile (minimum 44x44px)
- Stack components vertically on mobile, horizontal on desktop
- Test on both form factors continuously

### Rationale
- Practice mode primary use case is mobile (learn during commute, lunch break, etc.)
- Card management benefits from desktop (larger screen for editing)
- Modern CSS makes responsive design straightforward
- Mobile-first ensures core functionality works on smallest screens

### Alternatives Considered
- **Desktop-only:** Rejected - user explicitly needs mobile
- **Separate mobile app:** Rejected - maintenance overhead, not needed for MVP
- **Desktop-first responsive:** Rejected - harder to scale down than up
- **No responsive design:** Rejected - doesn't meet user requirements

### Consequences
- Positive: Works seamlessly across all devices
- Positive: User can practice anywhere
- Positive: Future-proof as mobile usage grows
- Negative: More CSS complexity (mitigated by modern Grid/Flexbox)
- Negative: Need to test on multiple screen sizes (acceptable)

---

## [DEC-009] Universal Difficulty Level + Enhanced Verb Metadata

**Date:** 2025-11-01
**Status:** Accepted

### Context
Initial schema had `level` field only for verbs, creating inconsistency. User needs to:
1. Practice cards by proficiency level (A1-C2) regardless of type
2. Support specialized/technical vocabulary that doesn't fit CEFR framework
3. Store verb metadata for future conjugation practice without overwhelming data entry
4. Support future tense practice and verb relationship linking

German verbs have complex characteristics (regular/irregular/modal/separable/reflexive) and multiple forms (Partizip II, auxiliary verbs) that affect usage and conjugation.

### Decision

**Add `level` field to ALL card types:**
- A1 (Beginner)
- A2 (Elementary)
- B1 (Intermediate)
- B2 (Upper Intermediate)
- C1 (Advanced)
- C2 (Mastery)
- Specialized (Business/Technical vocabulary outside CEFR)

**Enhance verb cards with essential metadata:**
- `verbType`: regular | irregular | modal | separable | reflexive
- `partizipII`: Perfect tense participle form (e.g., "gehabt")
- `auxiliary`: "haben" or "sein" (for perfect tense)
- `separablePrefix`: Prefix for separable verbs (e.g., "an" in "ankommen")
- `relatedCards`: Array of card IDs for linking tense variations

**Keep `collections` and `tags` orthogonal:**
- Collections = Topic/theme grouping ("Business Vocabulary", "IT Terms")
- Tags = Specific contexts ("meetings", "integration", "technical")

### Rationale
- **Universal difficulty**: Learners can practice by proficiency level regardless of topic
- **Specialized category**: Handles technical jargon (e.g., "Skalierbarkeit") that may be simple grammatically but contextually advanced
- **Essential verb data only**: Store what makes each verb unique, not full conjugation tables (50+ fields would be overwhelming)
- **Future-proof**: Foundation for conjugation practice mode without requiring it upfront
- **Card linking**: Enables relationship mapping for tense variations
- **Consistent UX**: All card types have same core structure

### Alternatives Considered
- **Status quo (level only for verbs):** Rejected - inconsistent, prevents filtering by proficiency across types
- **Full conjugation tables:** Rejected - overwhelming data entry (50+ fields per verb), most conjugations derivable from rules
- **Difficulty in tags:** Rejected - tags are for context, not proficiency level
- **Separate verb-tense cards with no linking:** Rejected - can't show relationships between present/past/perfect forms

### Consequences
- Positive: Consistent filtering and practice by proficiency level
- Positive: Foundation for advanced verb practice features
- Positive: Manageable data entry (key forms only, not full tables)
- Positive: Supports user's goal of progressive learning (vocabulary → phrases → tenses)
- Negative: More fields in verb form (mitigated by conditional UI)
- Negative: Existing verb data needs level field added (minor migration)
- Negative: Need to handle card relationships in UI (future feature)

### Implementation Notes
- Practice mode reveal: Show Partizip II and verb type when answer is correct
- Full conjugation tables: Future feature, not MVP
- Card linking UI: Future feature for managing tense relationships
- Nouns keep current structure: gender + plural sufficient for vocabulary practice

---

## [DEC-010] Difficulty Modes: Mixed vs Type-Match Distractors

**Date:** 2025-11-02
**Status:** Accepted

### Context
In multiple choice practice, German has structural patterns that provide context clues making answers too easy:
- Verbs end in -en (infinitive) or -t/-en (conjugated)
- Nouns have articles (der/die/das) and capitalization
- Phrases have distinct multi-word structure

Advanced learners can eliminate wrong answers by pattern recognition rather than actually knowing the vocabulary. Need a way to increase difficulty for experienced users while keeping easier mode for beginners.

### Decision
Implement two difficulty modes for practice sessions:

**Mixed Mode (Easier):**
- Distractors drawn from any card type
- Question shows German noun, answers might include verb definitions or phrases
- Pattern recognition provides context clues (user can eliminate verbs if question is a noun)
- Default mode for new learners

**Type-Match Mode (Harder):**
- Distractors limited to same type as correct answer
- Question shows German noun, all 5 answers are noun definitions
- No structural pattern clues available
- Forces genuine vocabulary knowledge
- Requires minimum 5 cards per type to ensure 4 distractors available

### Rationale
- **Progressive difficulty**: Learners can graduate from Mixed to Type-Match as they improve
- **User-driven**: Learner chooses challenge level based on current skill
- **Mimics real-world**: Type-Match simulates actual communication where context clues aren't always available
- **Validates mastery**: Type-Match proves user knows vocabulary, not just patterns
- **Simple implementation**: Single filter on distractor selection logic

### Alternatives Considered
- **Single difficulty only (Mixed):** Rejected - too easy for advanced learners, doesn't test true mastery
- **Single difficulty only (Type-Match):** Rejected - too hard for beginners, requires large card counts
- **Auto-difficulty based on score:** Rejected - removes user control, unpredictable experience
- **Type-Match only when single type selected:** Rejected - user should be able to practice all types in Type-Match mode

### Consequences
- Positive: Accommodates both beginner and advanced learners
- Positive: User has clear mental model of difficulty difference
- Positive: Can practice mixed card types in Type-Match mode (nouns + verbs + phrases, but answers match question type)
- Negative: Type-Match requires sufficient cards per type (minimum 5) - validated at practice start
- Negative: Slightly more complex setup UI (mitigated by clear labeling)

### Implementation Notes
- Validation: Show warning if any selected type has < 5 cards in Type-Match mode
- Display: Show per-type card breakdown in setup screen badge
- Game screen: Display both game mode and difficulty in header badge
- Error handling: Alert user with specific insufficient types before starting practice

---

## [DEC-011] Flag for Review Feature (Session-Based Spaced Repetition)

**Date:** 2025-11-02
**Status:** Accepted

### Context
Users need a way to immediately mark cards they struggle with for additional practice during a session. Current system has scoring (+1/-1) but no mechanism to prioritize difficult cards until next practice session. User insight: "The moment I saw the card I knew I was going to be guessing" - need ability to flag cards proactively before getting them wrong.

Key requirements:
- Don't want to modify scores (persistent across sessions)
- Want temporary boost to likelihood of reappearing in current session
- User wants ~20% increase in probability
- Must be toggleable on/off during practice

### Decision
Implement **"Flag for Review"** toggle button in practice game with probabilistic reappearance:

**UI:**
- Toggle button in question section: "☆ Flag for Review" / "⭐ Reviewing"
- Clear labeling explaining it boosts reappearance by 20%
- Visual indicator when card is flagged (orange accent color)
- Disabled after submitting answer (can only flag before answering)

**Logic (Option A - Probabilistic):**
- Maintain Set of flagged card IDs in session state
- After each card submission, 20% chance to show a random flagged card next
- If triggered, pick random card from flagged set (not current card)
- Otherwise proceed to next card in normal sequence
- Flags reset when practice session ends (not persistent)

**Session-scoped:**
- Flags are temporary (lost when returning to setup)
- Independent of card scores (don't affect +1/-1 system)
- Pure in-session learning aid

### Rationale
- **Proactive learning**: User can flag before getting it wrong, not reactive
- **Non-destructive**: Doesn't modify persistent scores or data
- **Simple mental model**: Toggle on = 20% boost, toggle off = no boost
- **Probabilistic feels natural**: Not deterministic, mimics memory reinforcement
- **Session-scoped appropriate**: User practicing specific weak areas right now, not long-term spaced repetition
- **Orange color choice**: Warning/attention color, distinct from blue (correct) and red (incorrect)

### Alternatives Considered
- **Option B (Queue-based):** After finishing all cards, cycle through flagged ones
  - Rejected: Too predictable, interrupts natural flow, user chose Option A
- **Option C (Hybrid):** 20% chance + guaranteed review at end
  - Rejected: Adds complexity, user preferred simpler Option A
- **Modify scores:** Flag automatically deducts points
  - Rejected: User explicitly didn't want to modify persistent scores
- **Full spaced repetition algorithm:** SM-2 with intervals
  - Deferred: Phase 4 feature, this is MVP for immediate need

### Consequences
- Positive: Users can immediately flag struggling cards
- Positive: 20% boost is gentle but noticeable
- Positive: Toggle is clear and discoverable in UI
- Positive: Foundation for future full spaced repetition system
- Negative: Session-only (flags lost when practice ends) - acceptable tradeoff for MVP
- Negative: Probabilistic means not guaranteed to see flagged card again - acceptable, user chose this option

### Implementation Notes
- Flag state: React Set for O(1) lookups
- 20% check: `Math.random() < 0.2` after each submission
- Color: Orange (`#f59e0b`) for flag/review theme
- Mobile: Full-width button, stacks below question label
- Future: Could persist flags to IndexedDB for cross-session review queues

---

## [DEC-012] Duplicate Card Detection and Prevention

**Date:** 2025-11-02
**Status:** Proposed (for Phase 3 implementation)

### Context
Users can create, edit, or import cards. Without duplicate detection:
- Same word appears multiple times in practice (artificial inflation)
- Scores fragment across duplicate entries (one card +5, duplicate -3)
- Import operations create massive duplication
- Data quality degrades over time

### Decision
Implement **duplicate detection with warning and user override**:

**Detection Logic:**
- Primary check: German word field (`word`)
- Case-insensitive comparison: `word.toLowerCase().trim()`
- Check on: Create, Edit (if word changed), Import

**User Experience:**
- Real-time validation as user types in form
- Warning display: "⚠️ A card for 'das Haus' already exists"
- Show existing card details: definition, type, current score
- Actions: [View Card] [Continue Anyway]
- User can override if intentional (different context/usage)

**Import Behavior:**
- Show duplicate preview before import
- List all duplicates with existing scores
- User choices: [Merge & Update] [Skip Duplicates] [Keep Both]

### Rationale
- **Warn, don't block**: Flexibility for edge cases (e.g., "der See" vs "die See")
- **User autonomy**: Allow override for legitimate duplicates
- **Data integrity**: Prevents accidental duplication while allowing intentional
- **Import clarity**: User sees what will happen before committing

### Alternatives Considered
- **Block creation**: Too strict, no flexibility for edge cases
- **Auto-merge**: Too aggressive, what if definitions differ?
- **Silent duplicate**: Poor UX, user doesn't know duplicate exists

### Consequences
- Positive: Cleaner data, accurate practice frequency, better score tracking
- Positive: User maintains control over final decision
- Positive: Import operations are transparent and predictable
- Negative: Adds form validation complexity
- Negative: Need UI space for warnings

### Implementation Notes
- Form validation: Check on word field blur and before submit
- Database query: Search existing cards by normalized word
- UI component: Reusable warning banner with actions
- Import flow: Duplicate detection in preview step, before database changes

---

## [DEC-013] Learning Readiness Feedback System

**Date:** 2025-11-02
**Status:** Proposed (for Phase 2.5/4 implementation)

### Context
Users need **data-driven encouragement** about when to add more vocabulary. Without feedback:
- Users don't know if they're ready to expand their deck
- No clear signal when mastery is achieved
- Risk of adding too much too fast (overwhelming)
- Risk of stagnating (boredom from mastered content)

User insight: "If I'm getting 70% right, doesn't make sense to add more...but maybe I DO need work-specific words."

### Decision
Implement **"Learning Readiness" dashboard section with configurable thresholds**:

**Readiness Criteria (per card type):**
- Success Rate: ≥ 75% (default, user adjustable 80-100%)
- Average Score: ≥ +2 (net positive progress)
- Practice Depth: Each card viewed ≥ 5 times on average
- No Extreme Strugglers: No cards with score < -5

**Three Readiness States:**
1. 🟢 **Ready to Expand** - All criteria met
2. 🟡 **Making Progress** - Some criteria met, keep practicing
3. 🔴 **Focus Needed** - Below thresholds, needs work

**Dashboard Display:**
```
┌────────────────────────────────────────┐
│ 📝 Nouns                         🟢    │
│ • 20 cards practiced 50+ times         │
│ • 95% success rate (19/20 correct)     │
│ • Average score: +8                    │
│ ✨ You're crushing nouns! Ready to add │
│    more business vocabulary.           │
└────────────────────────────────────────┘
```

**User Settings (Phase 4):**
- Mastery threshold slider: 75% (min) to 100% (max)
- Minimum practice rounds: 5 (default)
- Always show "Add anyway" option (acknowledges user autonomy)

### Rationale
- **Data-driven**: Based on actual performance, not arbitrary
- **Encouraging**: Positive feedback when ready, supportive when not
- **Configurable**: Users can adjust for personal learning style
- **Non-restrictive**: Suggestions only, never blocks user actions
- **Contextual**: Different users have different needs (work vocab, perfectionism, etc.)

### Alternatives Considered
- **Fixed requirements**: Too rigid, doesn't account for user preferences
- **No feedback**: Misses opportunity to guide and encourage
- **Block adding cards**: Too restrictive, removes user autonomy
- **Simple percentage only**: Doesn't account for practice depth or extreme strugglers

### Consequences
- Positive: Clear guidance on when to expand vocabulary
- Positive: Celebrates achievement and encourages continued practice
- Positive: Prevents overwhelm from adding too much too fast
- Positive: Respects user autonomy (work-specific needs, etc.)
- Negative: Requires practice history data (needs IndexedDB integration)
- Negative: Threshold selection might confuse some users (provide good defaults)

### Implementation Phases
**Phase 2.5 (Next Session):**
- Add "Learning Readiness" section to dashboard
- Calculate metrics with mock data
- Show status indicators and recommendations

**Phase 4 (Future):**
- User settings for threshold adjustment
- Track practice history over time
- Show trends: "You've improved 20% this week!"
- Spaced repetition integration

### Implementation Notes
- Default thresholds: 75% success, 5 views avg, +2 score, -5 floor
- Smart messages based on data patterns
- Always show "Add cards anyway" option
- Color coding: 🟢 Green (ready), 🟡 Yellow (progress), 🔴 Red (focus)

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
