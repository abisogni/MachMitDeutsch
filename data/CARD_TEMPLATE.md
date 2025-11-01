# MachMitDeutsch - Vocabulary Card Template

Use this template to generate German vocabulary cards for import into the MachMitDeutsch app.

## Instructions for LLMs

Generate vocabulary cards as a JSON array following the structure below. The app will automatically add `id`, `cardScore`, `viewCount`, and `createdDate` on import.

---

## Card Types and Required Fields

### 1. NOUNS

Required fields for German nouns:

```json
{
  "word": "der Benutzer",
  "definition": "user",
  "type": "noun",
  "gender": "der",
  "plural": "-",
  "collection": "IT Vocabulary",
  "tags": ["software", "basic"]
}
```

**Field Descriptions:**
- `word`: Full German noun WITH article (der/die/das)
- `definition`: English translation (can include multiple meanings separated by " / ")
- `type`: Always "noun"
- `gender`: Article only: "der", "die", or "das"
- `plural`: Plural ending (e.g., "e", "en", "er", "-" for no change, "–" for no plural)
- `collection`: High-level category (e.g., "A1 Vocabulary", "Business Terms", "IT Vocabulary")
- `tags`: Array of specific topics/themes (lowercase, kebab-case for multi-word)

---

### 2. VERBS

Required fields for German verbs:

```json
{
  "word": "integrieren",
  "definition": "to integrate",
  "type": "verb",
  "level": "intermediate",
  "collection": "IT Verbs",
  "tags": ["integration", "technical"],
  "examples": {
    "de": "Wir integrieren Salesforce mit SAP BTP.",
    "en": "We integrate Salesforce with SAP BTP."
  }
}
```

**Field Descriptions:**
- `word`: German infinitive verb (no "zu")
- `definition`: English translation with "to" (can include multiple: "to save / to store")
- `type`: Always "verb"
- `level`: "common", "intermediate", or "expert" (based on difficulty/frequency)
- `collection`: High-level category (e.g., "Common Verbs", "IT Verbs")
- `tags`: Array of domain/context tags
- `examples` (optional but recommended): Object with `de` and `en` keys showing verb in context

---

### 3. PHRASES

Required fields for German phrases:

```json
{
  "word": "Können wir das bitte später besprechen?",
  "definition": "Can we please discuss this later?",
  "type": "phrase",
  "collection": "Business Phrases",
  "tags": ["meetings", "communication"],
  "context": "general / meeting"
}
```

**Field Descriptions:**
- `word`: Complete German sentence or phrase
- `definition`: Complete English translation
- `type`: Always "phrase"
- `collection`: High-level category (e.g., "Business Phrases", "Everyday Phrases")
- `tags`: Array of situation/topic tags
- `context` (optional): Short description of when to use this phrase

---

## Complete Example Output

Here's a complete JSON file ready for import:

```json
[
  {
    "word": "die Datenbank",
    "definition": "database",
    "type": "noun",
    "gender": "die",
    "plural": "en",
    "collection": "IT Vocabulary",
    "tags": ["data", "storage"]
  },
  {
    "word": "speichern",
    "definition": "to save / to store",
    "type": "verb",
    "level": "common",
    "collection": "IT Verbs",
    "tags": ["data", "basic"],
    "examples": {
      "de": "Das System speichert alle Änderungen automatisch.",
      "en": "The system saves all changes automatically."
    }
  },
  {
    "word": "Ich verstehe das nicht ganz.",
    "definition": "I don't quite understand that.",
    "type": "phrase",
    "collection": "Business Phrases",
    "tags": ["clarification", "communication"],
    "context": "meetings / asking for help"
  }
]
```

---

## Best Practices for Card Generation

1. **Collections** should be broad categories (10-50 cards each)
2. **Tags** should be specific topics (reusable across collections)
3. **Nouns**: Always include the article in the `word` field
4. **Verbs**: Provide realistic example sentences when possible
5. **Phrases**: Focus on common, practical expressions
6. **Definitions**: Keep concise but accurate; use " / " to separate multiple meanings
7. **Level** (verbs only):
   - "common" = A1-A2 level, everyday verbs
   - "intermediate" = B1-B2 level, professional/specific verbs
   - "expert" = C1+ level, technical/specialized verbs

---

## Prompt for LLMs

Copy and paste this prompt when asking an LLM to generate cards:

```
Please generate 10 German vocabulary cards for [TOPIC/THEME] following the MachMitDeutsch card template structure. Include:
- A mix of nouns, verbs, and phrases relevant to [CONTEXT]
- Proper gender and plural forms for nouns
- Example sentences for verbs
- Practical, real-world vocabulary
- Appropriate collections and tags

Return the output as a valid JSON array ready for import.
```

Replace [TOPIC/THEME] and [CONTEXT] with your needs (e.g., "cooking vocabulary for beginners", "business meeting phrases", etc.)

---

## Notes

- All fields are mandatory except where marked "optional"
- The app will validate JSON structure on import
- Invalid cards will be reported during import preview
- Collections and tags will auto-populate in the app's filter dropdowns
