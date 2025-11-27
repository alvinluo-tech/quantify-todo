# ✅ Quick Start Checklist

Copy this checklist and check off each step as you complete it!

## Before You Start

- [ ] I have Node.js 18+ installed (`node --version`)
- [ ] I have a code editor (VS Code recommended)
- [ ] I have a modern web browser

## Supabase Setup (10 minutes)

- [ ] Created account at https://supabase.com
- [ ] Created a new project (wait ~2 min for setup)
- [ ] Opened SQL Editor in Supabase dashboard
- [ ] Copied entire content from `supabase/schema.sql`
- [ ] Pasted and ran the SQL query
- [ ] Saw "Success. No rows returned" message
- [ ] Went to Project Settings > API
- [ ] Copied Project URL (starts with https://)
- [ ] Copied anon public key (long string)
- [ ] Opened `.env.local` in project
- [ ] Replaced `your-supabase-url` with actual URL
- [ ] Replaced `your-supabase-anon-key` with actual key
- [ ] Saved `.env.local` file

## Running the App (2 minutes)

- [ ] Opened terminal in project directory
- [ ] Ran `npm run dev`
- [ ] Saw "Local: http://localhost:3000" message
- [ ] Opened browser to http://localhost:3000
- [ ] App loaded without errors

## First Use (5 minutes)

- [ ] Clicked "New Task" button
- [ ] Created first task with:
  - [ ] Title
  - [ ] Priority level
  - [ ] Estimated time
- [ ] Task appears in list
- [ ] Clicked on task to edit
- [ ] Clicked "+" to add a subtask
- [ ] Created a subtask
- [ ] Saw parent progress update automatically
- [ ] Clicked "Today's Focus" tab
- [ ] Tried a quick filter
- [ ] Clicked "Morning Planner" button
- [ ] Dragged a task to "Today's Plan"
- [ ] Clicked "Analytics" tab
- [ ] Saw activity heatmap (empty if new)

## Troubleshooting (if needed)

If the app doesn't load:
- [ ] Checked browser console (F12) for errors
- [ ] Verified `.env.local` has correct credentials (no quotes needed)
- [ ] Confirmed Supabase project is active (not paused)
- [ ] Restarted dev server (Ctrl+C, then `npm run dev`)

If tasks don't save:
- [ ] Confirmed SQL schema ran successfully
- [ ] Checked Network tab in DevTools for failed requests
- [ ] Verified Supabase project URL and key are correct

If you see TypeScript errors:
- [ ] These are often just warnings in development
- [ ] Try running `npm run build` to see real errors
- [ ] Most won't prevent the app from running

## You're Done! 🎉

If you completed all the checkboxes above, you're ready to use the app!

## Next Steps

Try this workflow to learn the system:

1. **Create a Project** (parent task)
   - Title: "Learn Next.js"
   - Priority: P2 (High)
   - Deadline: 1 week from now

2. **Add Subtasks**
   - "Complete Next.js tutorial (2 hours)"
   - "Build a sample app (4 hours)"
   - "Read documentation (1 hour)"

3. **Track Progress**
   - Mark first subtask as "In Progress"
   - Use slider to set 50% progress
   - Watch parent task update to ~17% (average of children)

4. **Use Today's Focus**
   - Click "Today's Focus" tab
   - See tasks prioritized by deadline
   - Try quick filter "< 30min Tasks"

5. **Plan Your Day**
   - Click "Morning Planner"
   - Drag some tasks to "Today's Plan"
   - These will appear in Today's Focus

6. **Complete a Task**
   - Check off a completed subtask
   - See parent progress increase
   - Watch it disappear from Today's Focus

## Tips for Success

✅ **Break down vague goals**
   - "Learn React" → Multiple concrete subtasks

✅ **Use energy levels**
   - "High Focus" = Morning deep work
   - "Low Energy" = Evening admin tasks

✅ **Estimate time**
   - Helps with "< 30min" quick filter
   - Shows total time needed each day

✅ **Track progress honestly**
   - Update slider as you go
   - Don't wait until completion

✅ **Review daily**
   - Use Daily Review popup (after 6 PM)
   - Migrate unfinished tasks to tomorrow

---

Need help? Check these files:
- `README.md` - Full documentation
- `SETUP.md` - Detailed setup guide
- `NEXT_STEPS.md` - Usage instructions
- `PROJECT_SUMMARY.md` - Technical overview
