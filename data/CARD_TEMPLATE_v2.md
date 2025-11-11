# MachMitDeutsch - Vocabulary Card Template v2

Use this template to generate German vocabulary cards that can be imported directly into the MachMitDeutsch app (no conversion needed).

## Instructions for LLMs

Generate vocabulary cards as a JSON object with a `cards` array following the structure below. The app will automatically add `id`, `cardScore`, `viewCount`, and `createdDate` on import.

---

## Required JSON Structure

```json
{
  "version": "1.0",
  "exported": "2025-11-11T00:00:00Z",
  "cards": [
    // ... card objects here
  ]
}
```

**Top-level fields:**
- `version`: Always "1.0"
- `exported`: Current timestamp in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)
- `cards`: Array of card objects

---

## Card Types and Required Fields

### 1. NOUNS

Required fields for German nouns:

```json
{
  "word": "die Schnittstelle",
  "definition": "interface",
  "type": "noun",
  "level": "B1",
  "collection": "IT & Business Vocabulary",
  "tags": ["IT", "technical"],
  "gender": "die",
  "plural": "n"
}
```

**Field Descriptions:**
- `word`: Full German noun WITH article (der/die/das)
- `definition`: English translation (can include multiple meanings separated by " / ")
- `type`: Always "noun"
- `level`: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "specialized"
- `collection`: High-level category (e.g., "IT Vocabulary", "Business Terms")
- `tags`: Array of specific topics/themes
- `gender`: Article only: "der", "die", or "das"
- `plural`: Plural ending (e.g., "e", "en", "er", "-" for no change, "–" for no plural)

**Optional fields:**
- All noun fields above are required for best results

---

### 2. VERBS

Required and optional fields for German verbs:

```json
{
  "word": "haben",
  "definition": "to have",
  "type": "verb",
  "level": "A1",
  "collection": "Common Verbs",
  "tags": ["basic", "essential"],
  "verbType": "irregular",
  "partizipII": "gehabt",
  "auxiliary": "haben",
  "examples": {
    "de": "Ich habe heute viele Termine.",
    "en": "I have many appointments today."
  }
}
```

**Field Descriptions:**
- `word`: German infinitive verb (no "zu")
- `definition`: English translation with "to" (can include multiple: "to save / to store")
- `type`: Always "verb"
- `level`: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "specialized"
- `collection`: High-level category (e.g., "Common Verbs", "IT Verbs")
- `tags`: Array of domain/context tags
- `verbType` (optional): "regular" | "irregular" | "modal" | "separable" | "reflexive"
- `partizipII` (optional): Perfect participle (e.g., "gehabt", "gemacht")
- `auxiliary` (optional): "haben" | "sein" (for perfect tense)
- `separablePrefix` (optional): Prefix for separable verbs (e.g., "an" for "ankommen")
- `examples` (optional but recommended): Object with `de` and `en` keys showing verb in context
- `relatedCards` (optional): Array of card IDs for tense variations

---

### 3. PHRASES

Required fields for German phrases:

```json
{
  "word": "Wie geht es dir?",
  "definition": "How are you?",
  "type": "phrase",
  "level": "A1",
  "collection": "Common Phrases",
  "tags": ["greeting", "daily"],
  "context": "informal greeting"
}
```

**Field Descriptions:**
- `word`: Complete German sentence or phrase
- `definition`: Complete English translation
- `type`: Always "phrase"
- `level`: "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "specialized"
- `collection`: High-level category (e.g., "Business Phrases", "Everyday Phrases")
- `tags`: Array of situation/topic tags
- `context` (optional): Short description of when to use this phrase

---

## Complete Example Output

Here's a complete JSON file ready for direct import:

```json
{
  "version": "1.0",
  "exported": "2025-11-11T12:00:00Z",
  "cards": [
    {
      "word": "die Datenbank",
      "definition": "database",
      "type": "noun",
      "level": "B1",
      "collection": "IT Vocabulary",
      "tags": ["data", "storage"],
      "gender": "die",
      "plural": "en"
    },
    {
      "word": "speichern",
      "definition": "to save / to store",
      "type": "verb",
      "level": "A2",
      "collection": "IT Verbs",
      "tags": ["data", "basic"],
      "verbType": "regular",
      "partizipII": "gespeichert",
      "auxiliary": "haben",
      "examples": {
        "de": "Das System speichert alle Änderungen automatisch.",
        "en": "The system saves all changes automatically."
      }
    },
    {
      "word": "Ich verstehe das nicht ganz.",
      "definition": "I don't quite understand that.",
      "type": "phrase",
      "level": "A2",
      "collection": "Business Phrases",
      "tags": ["clarification", "communication"],
      "context": "meetings / asking for help"
    }
  ]
}
```

---

## Best Practices for Card Generation

1. **Collections** should be broad categories (10-50 cards each)
2. **Tags** should be specific topics (reusable across collections)
3. **Level** should match CEFR standards:
   - A1-A2: Basic/elementary
   - B1-B2: Intermediate/upper-intermediate
   - C1-C2: Advanced/proficiency
   - specialized: Domain-specific technical terms
4. **Nouns**: Always include the article in the `word` field
5. **Verbs**: Provide realistic example sentences when possible
6. **Phrases**: Focus on common, practical expressions
7. **Definitions**: Keep concise but accurate; use " / " to separate multiple meanings

---

## Prompt for LLMs

Copy and paste this prompt when asking an LLM to generate cards:

```
Please generate 10 German vocabulary cards for [TOPIC/THEME] following the MachMitDeutsch v2 card template structure.

Requirements:
- Return as a JSON object with "version", "exported", and "cards" array
- Include a mix of nouns, verbs, and phrases relevant to [CONTEXT]
- Proper CEFR level (A1-C2 or specialized)
- Nouns: Include gender and plural forms
- Verbs: Include example sentences, verbType, partizipII, and auxiliary when applicable
- Phrases: Include context field
- Use appropriate collections and tags
- Make vocabulary practical and real-world

Return the output as valid JSON ready for direct import into the app.
```

Replace [TOPIC/THEME] and [CONTEXT] with your needs (e.g., "cooking vocabulary for beginners", "business meeting phrases", "SAP/Salesforce integration terms", etc.)

---

## Field Requirements Summary

### Required for ALL cards:
- `word` - German word/phrase
- `definition` - English translation
- `type` - "noun" | "verb" | "phrase"

### Recommended for ALL cards:
- `level` - CEFR level (A1-C2 or specialized)
- `collection` - Category/topic group
- `tags` - Array of specific tags

### Type-specific REQUIRED:
- **Nouns:** `gender`, `plural`
- **Verbs:** none (but `examples` highly recommended)
- **Phrases:** none (but `context` highly recommended)

### Type-specific OPTIONAL:
- **Verbs:** `verbType`, `partizipII`, `auxiliary`, `separablePrefix`, `examples`, `relatedCards`
- **Phrases:** `context`

---

## Import Process

1. Save your JSON file with any name (e.g., `my-vocab.json`)
2. In the app, go to **Import Cards** (`/manage/import`)
3. Select your JSON file
4. Review the preview (first 5 cards shown)
5. Click "Import X Cards"
6. Duplicates (same German word) are automatically skipped
7. View your imported cards in the Card List

---

## Notes

- All fields are case-sensitive
- The app validates JSON structure and required fields on import
- Invalid cards will be reported during import preview
- Collections and tags auto-populate in the app's filter dropdowns
- Card scores start at 0 and adjust based on practice performance (+1 correct, -1 incorrect)
