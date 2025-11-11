#!/usr/bin/env node

/**
 * Convert vocabulary JSON files to app-compatible format
 * Usage: node convert-to-app-format.js
 */

const fs = require('fs');
const path = require('path');

// File mappings: [input file, output file, type, collection]
const conversions = [
  ['nouns_v3_150.json', 'nouns_v3_150_converted.json', 'noun', 'IT & Business Vocabulary'],
  ['verbs_top100_v1.json', 'verbs_top100_v1_converted.json', 'verb', 'Top 100 Verbs'],
  ['phrases_top50_v1.json', 'phrases_top50_v1_converted.json', 'phrase', 'Top 50 Phrases']
];

// Level mapping
const levelMap = {
  'common': 'A2',
  'intermediate': 'B1',
  'advanced': 'C1',
  'specialized': 'specialized'
};

function convertNouns(data) {
  return data.map(item => ({
    word: item.term,
    definition: item.gloss,
    type: 'noun',
    level: 'B1',
    collection: 'IT & Business Vocabulary',
    tags: ['business', 'IT'],
    gender: item.gender,
    plural: item.plural
  }));
}

function convertVerbs(data) {
  return data.map(item => ({
    word: item.term,
    definition: item.translations.join(', '),
    type: 'verb',
    level: levelMap[item.level] || 'B1',
    collection: 'Top 100 Verbs',
    tags: item.domain || [],
    examples: item.example_de && item.example_en ? {
      de: item.example_de,
      en: item.example_en
    } : undefined
  }));
}

function convertPhrases(data) {
  return data.map(item => ({
    word: item.phrase_de || item.term || item.phrase,
    definition: item.phrase_en || item.gloss || item.translation || (item.translations ? item.translations.join(', ') : ''),
    type: 'phrase',
    level: levelMap[item.level] || 'B1',
    collection: 'Top 50 Phrases',
    tags: item.domain ? [item.domain] : (item.tags || []),
    context: item.note || item.context || item.usage
  }));
}

// Main conversion
conversions.forEach(([inputFile, outputFile, type, collection]) => {
  const inputPath = path.join(__dirname, inputFile);
  const outputPath = path.join(__dirname, outputFile);

  if (!fs.existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${inputFile} - file not found`);
    return;
  }

  console.log(`Converting ${inputFile}...`);

  try {
    const rawData = fs.readFileSync(inputPath, 'utf8');
    const data = JSON.parse(rawData);

    let converted;
    if (type === 'noun') {
      converted = convertNouns(data);
    } else if (type === 'verb') {
      converted = convertVerbs(data);
    } else if (type === 'phrase') {
      converted = convertPhrases(data);
    }

    const output = {
      version: '1.0',
      exported: new Date().toISOString(),
      cards: converted
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`✅ Converted ${converted.length} ${type}s to ${outputFile}`);
  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
  }
});

console.log('\n✨ Conversion complete!');
console.log('You can now import the *_converted.json files in the app.');
