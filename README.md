# Quantified Self Todo List 🚀

[English](README.md) | [中文](README.zh-CN.md)

A modern productivity application built with Next.js 16 that focuses on **quantifiable progress** rather than just task completion. Features smart prioritization, nested task hierarchies, and visual analytics.

## Philosophy: Progress > Completion

This app focuses on **quantifiable progress** rather than just checking boxes. It helps you:
- Break down large projects into actionable subtasks
- Track actual progress on ongoing work
- Make smart decisions about what to work on next
- Visualize your productivity patterns

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/UI
- **State Management:** Zustand (UI State) + Server Actions (Data)
- **Database:** Supabase (PostgreSQL + Auth)
- **Visualization:** Recharts
- **Drag & Drop:** @dnd-kit/core
- **Optimistic Updates:** React 19 useOptimistic Hook

## Getting Started

### 1. Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)

2. Run the database schema:
   - Go to your Supabase project
   - Navigate to the SQL Editor
   - Copy and paste the contents of `supabase/schema.sql`
   - Run the query

3. Get your API credentials:
   - Go to Project Settings > API
   - Copy the `Project URL` and `anon/public` key

### 3. Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Install & Run

```bash
# Install dependencies (already done)
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alvinluo-tech/quantify-todo)

### Manual Deploy

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables:**
   
   In Vercel dashboard, add these environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Deploy:**
   - Click "Deploy"
   - Vercel will build and deploy automatically
   - Your app will be live at `https://your-project.vercel.app`

### Important Notes

- ✅ **No additional configuration needed** - Next.js App Router works out-of-the-box on Vercel
- ✅ **Automatic HTTPS** - Vercel provides SSL certificates
- ✅ **Edge Functions** - Server Actions run on Vercel Edge Network
- ✅ **Preview Deployments** - Every git push gets a preview URL
- ⚠️ **Environment Variables** - Must be set in Vercel dashboard (not in `.env.local`)
- ⚠️ **Supabase RLS** - Ensure Row Level Security policies are properly configured

## ✨ Core Features

### 📋 Nested Task Hierarchy
- **Unlimited nesting** - Create projects with unlimited subtasks
- **Auto-calculated progress** - Parent tasks automatically calculate progress from children
- **Manual tracking** - Leaf tasks use manual progress sliders (0-100%)
- **Instant updates** - Optimistic UI with React 19 useOptimistic

### 🎯 Today's Focus
Smart prioritization algorithm based on:
- **Deadline urgency** - Overdue tasks get highest priority
- **Priority levels** - P1-P5 (Low to Critical)
- **Task age** - Stagnant tasks get boosted
- **Progress status** - In-progress tasks prioritized
- **Quick filters** - "< 30min", "High Focus", "Low Energy"

### 🌅 Morning Planner
- **Drag-and-drop interface** - Visual task planning
- **Cross-container dragging** - Move tasks between backlog and today
- **Auto-scheduling** - Sets start_date automatically
- **Smart triggers** - Auto-opens 6-10 AM on first login
- **Manual access** - Available anytime via header button

### 🌙 Daily Review
- **End-of-day summary** - Auto-popup after 6 PM
- **Progress tracking** - Shows completed tasks and time logged
- **Task migration** - Move unfinished tasks to tomorrow
- **Archive management** - Clean up completed work

### 📊 Analytics Dashboard
- **Activity heatmap** - GitHub-style contribution view (30 days)
- **Burndown charts** - Track project completion trends
- **Productivity insights** - Visualize work patterns
- **Task distribution** - See priority and status breakdowns

### 🚀 Modern Architecture
- **Server Actions** - Type-safe data mutations
- **Optimistic Updates** - Instant UI feedback
- **Global UI State** - Zustand for modals, filters, sidebar
- **Component-local State** - useState for ephemeral UI
- **Singleton Modals** - Single dialog instance for performance
- **Hydration-safe Time** - No SSR/client mismatches

## Key Concepts

### Task Types

**Parent Tasks (Projects)**
- Contain one or more subtasks
- Progress calculated automatically from children
- Use to break down vague goals like "Learn React"

**Leaf Tasks (Actionable Items)**
- No subtasks
- Manual progress tracking with slider
- Should be concrete and actionable

### Priority Levels
- **P0 (Low):** Nice to have, no urgency
- **P1 (Medium):** Standard priority
- **P2 (High):** Important, should do soon
- **P3 (Urgent):** Critical, immediate attention

### Energy Levels
- **High Focus:** Deep work requiring concentration
- **Low Energy:** Tasks you can do when tired
- **Quick Win:** Small, satisfying completions

## 📁 Project Structure

```
todolist/
├── app/
│   ├── dashboard/              # Main dashboard routes
│   │   ├── page.tsx            # All tasks view
│   │   ├── today/              # Today's focus
│   │   └── analytics/          # Analytics dashboard
│   ├── login/                  # Auth pages
│   └── auth/callback/          # OAuth callback
├── components/
│   ├── features/               # Feature-based organization
│   │   ├── tasks/              # Task management components
│   │   │   ├── task-list-client.tsx
│   │   │   ├── task-item.tsx   # Recursive component
│   │   │   ├── task-form-dialog.tsx
│   │   │   ├── todays-focus.tsx
│   │   │   └── draggable-task-card.tsx
│   │   ├── planning/           # Planning features
│   │   │   ├── morning-planner.tsx
│   │   │   └── daily-review.tsx
│   │   └── analytics/          # Analytics components
│   │       ├── analytics-dashboard.tsx
│   │       └── charts/
│   ├── layout/                 # Layout components
│   │   ├── dashboard-header.tsx
│   │   └── dashboard-nav.tsx
│   └── ui/                     # Shadcn UI primitives
├── lib/
│   ├── actions/                # Server Actions
│   │   └── task-actions.ts     # CRUD operations
│   ├── queries/                # Data fetching
│   │   └── task-queries.ts
│   ├── store/                  # Zustand stores
│   │   └── ui-store.ts         # Global UI state
│   ├── contexts/               # React contexts
│   │   └── user-context.tsx    # Client-only user
│   ├── hooks/                  # Custom hooks
│   │   └── use-time-check.ts
│   ├── services/               # Business logic
│   │   └── time-service.ts
│   ├── utils/                  # Utilities
│   │   ├── task-tree.ts        # Progress calculation
│   │   ├── task-scoring.ts     # Smart prioritization
│   │   └── client-time.tsx     # Hydration-safe time
│   └── supabase/               # Database
│       ├── client.ts           # Client-side
│       ├── server.ts           # Server-side
│       └── types.ts            # Generated types
└── supabase/
    └── migrations/             # Database migrations
        └── 20241127_initial.sql
```

## Usage Tips

### Creating Effective Tasks

✅ **Good:**
- "Read Chapter 3 of React docs (30 min)"
- "Write introduction section"
- "Review 10 flashcards"

❌ **Too Vague:**
- "Study React"
- "Work on project"
- "Be productive"

### Using Progress Tracking

1. **For Reading/Learning:**
   - Update progress as percentage completed
   - Example: 50/100 pages = 50% progress

2. **For Writing:**
   - Track by word count or sections completed
   - Example: 3/5 sections = 60% progress

3. **For Projects:**
   - Break into subtasks and let progress calculate automatically

## Customization

### Changing the Scoring Algorithm

Edit `lib/utils/task-scoring.ts` to adjust how tasks are prioritized:

```typescript
// Increase deadline weight
if (hoursUntilDeadline < 24) {
  score += 60; // Was 40
}
```

### Modifying Daily Review Time

Edit `app/dashboard/page.tsx`:

```typescript
// Change from 6 PM to 8 PM
if (hour >= 20 && !hasReviewedToday) {
```

## 🚀 Future Enhancements

- [ ] Recurring tasks
- [ ] Task templates
- [ ] Pomodoro timer integration
- [ ] Mobile responsive design
- [ ] Team collaboration features
- [ ] AI-powered task suggestions
- [ ] Calendar integration (Google/Outlook)
- [ ] Export to CSV/PDF
- [ ] Dark mode improvements
- [ ] Keyboard shortcuts

## 📝 License

MIT License - feel free to use this code for your own projects.

## 🙏 Acknowledgments

Built with inspiration from:
- Getting Things Done (GTD) methodology
- Quantified Self movement
- Evidence-based productivity research

---

**Remember:** The goal isn't to complete all tasks—it's to make consistent progress on what matters most. 🎯
