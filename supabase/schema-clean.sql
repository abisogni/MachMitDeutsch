-- MachMitDeutsch Supabase Schema (Cleaned for Supabase Cloud)
-- Run this in your Supabase SQL Editor

-- ============================================
-- Table 1: Global Card Repository
-- ============================================
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('noun', 'verb', 'phrase')),
  level TEXT,
  collection TEXT,
  tags TEXT[],
  gender TEXT,      -- For nouns (der, die, das)
  plural TEXT,      -- For nouns
  examples JSONB,   -- For verbs: {de: "...", en: "..."}
  context TEXT,     -- For phrases
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on word for fast lookups
CREATE INDEX IF NOT EXISTS idx_cards_word ON cards(word);
CREATE INDEX IF NOT EXISTS idx_cards_type ON cards(type);
CREATE INDEX IF NOT EXISTS idx_cards_collection ON cards(collection);
CREATE INDEX IF NOT EXISTS idx_cards_tags ON cards USING GIN(tags);

-- ============================================
-- Table 2: User-Specific Learning Progress
-- ============================================
CREATE TABLE IF NOT EXISTS user_card_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  card_score INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  last_practiced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

-- Create indexes for user progress lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_card_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_card ON user_card_progress(card_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_composite ON user_card_progress(user_id, card_id);

-- ============================================
-- Table 3: Keep-Alive (prevent database pause)
-- ============================================
CREATE TABLE IF NOT EXISTS keep_alive (
  id BIGSERIAL PRIMARY KEY,
  last_ping TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert initial keep-alive record
INSERT INTO keep_alive (last_ping) VALUES (NOW());

-- ============================================
-- Row-Level Security Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE keep_alive ENABLE ROW LEVEL SECURITY;

-- Cards: Read-only for authenticated users
CREATE POLICY "Anyone can read cards"
  ON cards FOR SELECT
  TO authenticated
  USING (true);

-- Cards: Only service role can write (admin only)
CREATE POLICY "Only service role can insert cards"
  ON cards FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update cards"
  ON cards FOR UPDATE
  TO service_role
  USING (true);

CREATE POLICY "Only service role can delete cards"
  ON cards FOR DELETE
  TO service_role
  USING (true);

-- User Progress: Users can only access their own progress
CREATE POLICY "Users can read own progress"
  ON user_card_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_card_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_card_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress"
  ON user_card_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Keep-Alive: Public read/write (for GitHub Actions)
CREATE POLICY "Anyone can read keep_alive"
  ON keep_alive FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert keep_alive"
  ON keep_alive FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update keep_alive"
  ON keep_alive FOR UPDATE
  TO anon, authenticated
  USING (true);

-- ============================================
-- Database Functions
-- ============================================

-- Function to atomically increment card progress
CREATE OR REPLACE FUNCTION increment_card_progress(
  p_user_id UUID,
  p_card_id UUID,
  p_score_delta INTEGER,
  p_view_delta INTEGER DEFAULT 1
)
RETURNS user_card_progress
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result user_card_progress;
BEGIN
  INSERT INTO user_card_progress (user_id, card_id, card_score, view_count, last_practiced_at, updated_at)
  VALUES (p_user_id, p_card_id, p_score_delta, p_view_delta, NOW(), NOW())
  ON CONFLICT (user_id, card_id)
  DO UPDATE SET
    card_score = user_card_progress.card_score + p_score_delta,
    view_count = user_card_progress.view_count + p_view_delta,
    last_practiced_at = NOW(),
    updated_at = NOW()
  RETURNING * INTO result;

  RETURN result;
END;
$$;

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON user_card_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Indexes for Performance
-- ============================================

-- Additional indexes for common queries
CREATE INDEX IF NOT EXISTS idx_user_progress_last_practiced ON user_card_progress(last_practiced_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_created ON cards(created_at DESC);

-- ============================================
-- Setup Complete!
-- ============================================

-- Verify setup
SELECT 'Cards table created' as status, count(*) as count FROM cards;
SELECT 'User progress table created' as status, count(*) as count FROM user_card_progress;
SELECT 'Keep-alive table created' as status, count(*) as count FROM keep_alive;
