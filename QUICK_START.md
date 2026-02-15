# MachMitDeutsch Supabase Migration - Quick Start

## Implementation Status: ✅ COMPLETE

All code has been implemented. The app now supports cloud sync with Supabase!

## Next Steps to Get Running

### 1. Create Supabase Project (5 minutes)

```
1. Go to https://supabase.com
2. Sign up / Sign in
3. Click "New project"
4. Name: machmitdeutsch
5. Generate strong password (save it!)
6. Select region (closest to you)
7. Click "Create new project"
8. Wait 2-3 minutes for setup
```

### 2. Run Database Schema (2 minutes)

```
1. In Supabase dashboard → SQL Editor
2. Click "New query"
3. Open: MachMitDeutsch/supabase/schema.sql
4. Copy ALL contents
5. Paste in SQL Editor
6. Click "Run"
7. Should see "Cards table created", etc.
```

### 3. Get API Keys (1 minute)

```
1. Supabase dashboard → Settings (gear icon) → API
2. Copy:
   - Project URL (e.g., https://xxxxx.supabase.co)
   - anon public (starts with eyJhbGci...)
   - service_role secret (starts with eyJhbGci...)
```

### 4. Create Environment Files (2 minutes)

Create `.env.local` in project root:
```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Create `.env` in project root:
```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Import Vocabulary Cards (1 minute)

```bash
cd /Users/alexanderbisogni/Documents/Sync\ Files/Sync/WideSpan/MachMitDeutsch
npm run import-cards
```

Should see:
```
Found 3 card files to import
Processing: nouns_v3_150_converted.json
  Found 150 cards to import
  Imported batch 1: 100 cards
  Imported batch 2: 50 cards
...
Total cards imported: 200+
```

### 6. Start the App (1 minute)

```bash
npm run dev
```

Open browser to http://localhost:5173/MachMitDeutsch

### 7. Test Authentication

1. Should redirect to login page
2. Enter your email
3. Click "Send Magic Link"
4. Check email for magic link
5. Click link → Authenticated!
6. If you have local data, accept migration prompt

### 8. Verify Everything Works

Dashboard should show:
- Sync status indicator: "✓ Online"
- Last sync time
- All your cards
- Progress stats

Practice a card:
- Score should update immediately
- Sync indicator shows "🔄 Syncing..."
- Then back to "✓ Online"

## Optional: GitHub Actions Keep-Alive

To prevent Supabase database from pausing:

```
1. Push to GitHub (if not already)
2. Go to repo → Settings → Secrets → Actions
3. Add secrets:
   SUPABASE_URL = (your URL)
   SUPABASE_ANON_KEY = (your anon key)
4. Done! Workflow runs every 3 days automatically
```

## File Locations

All files saved to WideSpan folder as requested:
```
/Users/alexanderbisogni/Documents/Sync Files/Sync/WideSpan/MachMitDeutsch/
```

## What Was Implemented

✅ Supabase database schema with RLS policies
✅ Email magic link authentication
✅ Hybrid offline/online sync
✅ Local data migration on first login
✅ GitHub Actions keep-alive workflow
✅ Admin card import script
✅ Score persistence bug fix
✅ Sync status UI in Dashboard
✅ Protected routes
✅ Migration prompt component

## Key Features

🔐 **Authentication**: Email magic links (no password)
☁️ **Cloud Sync**: Auto-sync every 30 seconds
📱 **Multi-Device**: Same progress across MacBook & Mac Mini
🔌 **Offline Mode**: Works offline, syncs when back online
🔒 **Admin Cards**: Centrally managed vocabulary
🐛 **Bug Fixed**: Scores now persist correctly

## Helpful Commands

```bash
# Start dev server
npm run dev

# Import cards to Supabase
npm run import-cards

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Troubleshooting

**App shows "Offline Mode"**
- Check .env.local exists and has correct values
- Restart dev server

**Cards not importing**
- Check .env has SERVICE_ROLE_KEY
- Verify schema.sql was run

**Sync not working**
- Check browser console
- Verify authenticated (not logged out)

## Documentation

📘 Full setup guide: `supabase/SETUP.md`
📋 Complete summary: `SUPABASE_MIGRATION_COMPLETE.md`
🗂️ Database schema: `supabase/schema.sql`

## Support

Questions? Check:
1. Browser console for errors
2. Supabase dashboard → Logs
3. Documentation files above

---

**Ready to go! Just follow steps 1-7 above to get started.** 🚀
