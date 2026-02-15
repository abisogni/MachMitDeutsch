# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project:
   - Organization: Select or create
   - Project name: `machmitdeutsch`
   - Database password: Generate strong password (save this!)
   - Region: Choose closest to you
   - Pricing plan: Free tier is sufficient

## Step 2: Get API Credentials

After project creation (takes ~2 minutes):

1. Go to Project Settings (gear icon) > API
2. Copy these values:
   - Project URL (e.g., `https://xxxxx.supabase.co`)
   - `anon` public key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
   - `service_role` secret key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

## Step 3: Create Environment Files

Create `.env.local` in project root (not committed to git):

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Create `.env` for admin scripts (not committed to git):

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Click "New query"
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the editor
5. Click "Run" (bottom right)
6. Verify success: Should see "Cards table created", "User progress table created", etc.

## Step 5: Configure Authentication

1. Go to Authentication > Providers
2. Enable "Email" provider
3. Disable "Confirm email" (for development) OR
4. Configure email templates if you want confirmation

### Email Templates (Optional)

Go to Authentication > Email Templates and customize:
- Confirm signup
- Magic Link
- Change Email Address

### Redirect URLs

Go to Authentication > URL Configuration:
- Site URL: `http://localhost:5173` (development)
- Redirect URLs: Add production URLs when deploying

## Step 6: Import Vocabulary Cards

After completing the frontend setup:

```bash
# Install dependencies
npm install

# Run the import script
node scripts/import-cards-to-supabase.js
```

This will import all cards from `data/cards/*_converted.json` files.

## Step 7: Set up GitHub Actions (Optional)

To prevent database pausing on free tier:

1. Go to your GitHub repo > Settings > Secrets and variables > Actions
2. Add repository secrets:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_ANON_KEY`: Your anon/public key

The workflow in `.github/workflows/supabase-keep-alive.yml` will automatically ping the database every 3 days.

## Verification

After setup:

1. In Supabase dashboard, go to Table Editor
2. You should see:
   - `cards` table (empty initially, populated after import)
   - `user_card_progress` table (empty initially)
   - `keep_alive` table (1 row)
3. Go to Authentication > Users (empty initially)

## Troubleshooting

### Schema errors
- Make sure you copied the entire schema.sql file
- Run the schema in a fresh project if issues persist

### Import fails
- Verify SUPABASE_SERVICE_ROLE_KEY is set in .env
- Check that cards table exists
- Ensure JSON files are valid

### Auth not working
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
- Restart dev server after changing env variables
- Check browser console for errors

## Next Steps

After setup is complete:
1. Start development server: `npm run dev`
2. Navigate to the app
3. Sign up with email (magic link)
4. Start practicing!
