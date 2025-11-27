# Quick Setup Guide

## Step-by-Step Setup

### 1. Supabase Configuration

Before running the app, you MUST set up Supabase:

**Option A: Create a new Supabase project**
1. Go to https://supabase.com
2. Click "New Project"
3. Name it (e.g., "quantified-self-todo")
4. Choose a database password
5. Select a region close to you
6. Wait for the project to be created (~2 minutes)

**Option B: Use existing project**
1. Go to your existing Supabase project
2. Navigate to SQL Editor

### 2. Run Database Schema

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste into the SQL editor
5. Click **Run** or press Ctrl+Enter
6. Verify you see: "Success. No rows returned"

### 3. Get API Credentials

1. In Supabase, go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. You'll see:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **anon public** key (under "Project API keys")

### 4. Configure Environment Variables

1. In VS Code, open `.env.local`
2. Replace the placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 5. Run the Application

```bash
npm run dev
```

Open http://localhost:3000

## Troubleshooting

### "Cannot find module" errors
Run: `npm install`

### Database connection errors
- Check that `.env.local` has correct credentials
- Verify the SQL schema ran successfully in Supabase
- Make sure your Supabase project is active (not paused)

### Tasks not loading
1. Open browser DevTools (F12)
2. Check Console for errors
3. Verify Supabase credentials are correct
4. Check Network tab - should see requests to Supabase

### TypeScript errors
Run: `npm run build` to see actual errors
Most TypeScript errors won't prevent the dev server from running

## Testing the App (Without Database)

To see the UI without setting up Supabase:
1. The app will load but show "Not authenticated" 
2. You can still see the UI components and layout
3. For full functionality, Supabase setup is required

## What Each File Does

- `supabase/schema.sql` - Database tables and security rules
- `.env.local` - Your secret API keys (NEVER commit this!)
- `lib/supabase/client.ts` - Browser-side database connection
- `lib/supabase/server.ts` - Server-side database connection
- `lib/store/task-store.ts` - State management (Zustand)
- `app/dashboard/page.tsx` - Main app interface

## Next Steps

Once running:
1. Click "New Task" to create your first task
2. Try the "Morning Planner" to plan your day
3. Create a parent task, then add subtasks to see nested progress
4. Check out the Analytics tab to see your activity heatmap
