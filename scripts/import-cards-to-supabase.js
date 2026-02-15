#!/usr/bin/env node

/**
 * Admin script to import vocabulary cards to Supabase
 * Requires .env file with SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 *
 * Usage: node scripts/import-cards-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

// Load environment variables
config({ path: join(projectRoot, '.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing required environment variables');
  console.error('Please create a .env file with:');
  console.error('  SUPABASE_URL=your-project-url');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  process.exit(1);
}

// Create Supabase client with service role (bypasses RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Transform card data to match Supabase schema
 */
function transformCard(card) {
  const transformed = {
    word: card.word,
    definition: card.definition,
    type: card.type,
    level: card.level || null,
    collection: card.collection || null,
    tags: card.tags || [],
  };

  // Type-specific fields
  if (card.type === 'noun') {
    transformed.gender = card.gender || null;
    transformed.plural = card.plural || null;
  } else if (card.type === 'verb') {
    transformed.examples = card.examples || null;
  } else if (card.type === 'phrase') {
    transformed.context = card.context || null;
  }

  return transformed;
}

/**
 * Import cards from a JSON file
 */
async function importFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);

  try {
    const fileContent = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    if (!data.cards || !Array.isArray(data.cards)) {
      console.error('  Invalid file format: missing "cards" array');
      return { imported: 0, errors: 0, duplicates: 0 };
    }

    const cards = data.cards.map(transformCard);
    console.log(`  Found ${cards.length} cards to import`);

    let imported = 0;
    let duplicates = 0;
    let errors = 0;

    // Import in batches of 100
    const batchSize = 100;
    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);

      const { data: inserted, error } = await supabase
        .from('cards')
        .upsert(batch, {
          onConflict: 'word',
          ignoreDuplicates: false, // Update existing cards
        })
        .select();

      if (error) {
        console.error(`  Batch error:`, error.message);
        errors += batch.length;
      } else {
        imported += inserted?.length || 0;
        console.log(`  Imported batch ${Math.floor(i / batchSize) + 1}: ${inserted?.length || 0} cards`);
      }
    }

    return { imported, errors, duplicates };
  } catch (error) {
    console.error(`  Error reading file:`, error.message);
    return { imported: 0, errors: 1, duplicates: 0 };
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('MachMitDeutsch Card Import to Supabase');
  console.log('======================================\n');

  const cardsDir = join(projectRoot, 'data', 'cards');

  // Find all *_converted.json files
  let files;
  try {
    files = readdirSync(cardsDir)
      .filter(f => f.endsWith('_converted.json'))
      .map(f => join(cardsDir, f));
  } catch (error) {
    console.error('Error reading cards directory:', error.message);
    process.exit(1);
  }

  if (files.length === 0) {
    console.log('No card files found in data/cards/');
    process.exit(0);
  }

  console.log(`Found ${files.length} card files to import\n`);

  let totalImported = 0;
  let totalErrors = 0;
  let totalDuplicates = 0;

  for (const file of files) {
    const result = await importFile(file);
    totalImported += result.imported;
    totalErrors += result.errors;
    totalDuplicates += result.duplicates;
  }

  console.log('\n======================================');
  console.log('Import Summary:');
  console.log(`  Total cards imported: ${totalImported}`);
  console.log(`  Total duplicates: ${totalDuplicates}`);
  console.log(`  Total errors: ${totalErrors}`);
  console.log('======================================\n');

  // Verify import
  const { count, error } = await supabase
    .from('cards')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error verifying import:', error.message);
  } else {
    console.log(`Total cards in database: ${count}\n`);
  }

  process.exit(totalErrors > 0 ? 1 : 0);
}

main();
