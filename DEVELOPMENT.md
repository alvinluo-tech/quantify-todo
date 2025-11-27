# 🛠️ Development Guide

## Project Architecture

### State Management Flow

```
User Action → Component → Zustand Store → Supabase → Database
                ↑                                        ↓
                └────────── Update Local State ──────────┘
```

### Key Architectural Decisions

1. **Optimistic UI Updates**
   - Store updates immediately for snappy UX
   - Database sync happens in background
   - Errors trigger state rollback

2. **Recursive Component Pattern**
   - `TaskItem` renders itself for children
   - Depth tracking prevents infinite loops
   - Tree structure built in utility function

3. **Computed Properties**
   - Progress calculated on-demand
   - Scores computed for sorting
   - No duplication in database

## Code Organization

### Component Hierarchy

```
DashboardPage (app/dashboard/page.tsx)
├── Header (inline)
├── Navigation Tabs (inline)
└── View Container
    ├── TodaysFocus
    │   └── TaskItem (recursive)
    ├── TaskList
    │   └── TaskItem (recursive)
    └── AnalyticsDashboard
        ├── ActivityHeatmap
        └── BurndownChart
```

### State Flow

```typescript
// 1. Component needs data
useEffect(() => {
  fetchTasks(); // Calls Zustand action
}, []);

// 2. Store fetches from Supabase
const { data } = await supabase.from('tasks').select('*');

// 3. Store updates state
set({ tasks: data });

// 4. Component re-renders with new data
const { tasks } = useTaskStore();
```

## Key Utilities

### `task-tree.ts` - Tree Operations

```typescript
// Convert flat list to nested tree
buildTaskTree(tasks: Task[]) → Task[]

// Calculate progress (recursive)
calculateProgress(task: Task, allTasks: Task[]) → number

// Get all descendants
getDescendantIds(taskId: string, allTasks: Task[]) → string[]
```

### `task-scoring.ts` - Prioritization

```typescript
// Compute priority score
computeTaskScore(task: Task) → number

// Factors:
// - Deadline: up to 50 points
// - Priority: up to 30 points
// - Stagnation: up to 30 points
// - In Progress: 20 point boost
```

## Database Schema

### Tasks Table

```sql
tasks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  parent_id UUID REFERENCES tasks (self-join),
  title TEXT NOT NULL,
  status ENUM,
  priority INTEGER (0-3),
  manual_progress INTEGER (0-100),
  -- ... more fields
)
```

### Key Relationships

- **Self-referencing:** `parent_id → id` for tree structure
- **User scoping:** RLS policies filter by `user_id`
- **Cascade delete:** Deleting parent removes all children

## Performance Considerations

### Optimizations Applied

1. **Indexed Columns**
   - `user_id`, `parent_id`, `status`, `deadline`
   - Fast filtering and sorting

2. **Memoization**
   - `useMemo` for expensive calculations
   - Tree building cached per render

3. **Selective Re-renders**
   - Zustand selectors prevent unnecessary updates
   - Component-level state for UI-only changes

### Potential Bottlenecks

1. **Large Task Trees**
   - Recursive rendering O(n)
   - Mitigate: Virtualization for 1000+ tasks

2. **Real-time Updates**
   - Currently requires manual refresh
   - Solution: Supabase Realtime subscriptions

3. **Progress Calculation**
   - Recursive algorithm O(n×d) where d=depth
   - Could cache in database trigger

## Adding New Features

### Example: Add Task Tags

**1. Update Database**
```sql
CREATE TABLE task_tags (
  task_id UUID REFERENCES tasks,
  tag TEXT,
  PRIMARY KEY (task_id, tag)
);
```

**2. Update Types**
```typescript
// types/task.ts
interface Task {
  // ... existing fields
  tags?: string[];
}
```

**3. Update Store**
```typescript
// lib/store/task-store.ts
addTag: async (taskId: string, tag: string) => {
  await supabase.from('task_tags').insert({ task_id: taskId, tag });
  // Update local state
}
```

**4. Update UI**
```typescript
// components/task-item.tsx
{task.tags?.map(tag => (
  <Badge key={tag}>{tag}</Badge>
))}
```

## Common Patterns

### Creating a New Component

```typescript
'use client';

import { ComponentProps } from '@/types';
import { useTaskStore } from '@/lib/store/task-store';

export function MyComponent() {
  const { tasks, addTask } = useTaskStore();
  
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Adding a New Store Action

```typescript
// lib/store/task-store.ts
export const useTaskStore = create<TaskStore>((set, get) => ({
  // ... existing state
  
  myNewAction: async (param: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('tasks')
        .update({ field: param })
        .eq('id', taskId);
      
      if (error) throw error;
      
      set(state => ({
        tasks: state.tasks.map(t => 
          t.id === taskId ? { ...t, field: param } : t
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));
```

### Creating a New Utility

```typescript
// lib/utils/my-util.ts
import { Task } from '@/types/task';

export function myUtility(task: Task): ReturnType {
  // Implementation
  return result;
}
```

## Testing Strategy

### Manual Testing Checklist

- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Add subtask
- [ ] Update progress
- [ ] Complete task
- [ ] Use filters
- [ ] Drag and drop
- [ ] Review analytics

### Areas for Unit Tests

1. **Utilities**
   - `calculateProgress()` - various tree structures
   - `computeTaskScore()` - edge cases
   - `buildTaskTree()` - flat to nested conversion

2. **Store Actions**
   - CRUD operations
   - Error handling
   - State updates

3. **Components**
   - Rendering with different props
   - User interactions
   - Empty states

## Debugging Tips

### Common Issues

**Tasks not loading**
```typescript
// Check Supabase connection
const { data, error } = await supabase.from('tasks').select('*');
console.log('Data:', data, 'Error:', error);
```

**Progress not calculating**
```typescript
// Add logging to calculateProgress
console.log('Calculating for:', task.title, 'Children:', children.length);
```

**Store not updating**
```typescript
// Verify state changes
useEffect(() => {
  console.log('Tasks updated:', tasks.length);
}, [tasks]);
```

### Browser DevTools

**React DevTools**
- Inspect component props
- Track re-renders
- Check Zustand state

**Network Tab**
- Monitor Supabase requests
- Check request/response payloads
- Identify failed calls

**Console**
- Check for error messages
- Verify data structures
- Test utility functions

## Code Style Guide

### Naming Conventions

- **Components:** PascalCase (`TaskItem`, `TodaysFocus`)
- **Functions:** camelCase (`calculateProgress`, `getTodaysTasks`)
- **Constants:** UPPER_SNAKE_CASE (`PRIORITY_LABELS`)
- **Types:** PascalCase (`Task`, `TaskStatus`)

### File Organization

```typescript
// 1. Imports - external first, then internal
import { useState } from 'react';
import { Task } from '@/types/task';

// 2. Types/Interfaces
interface Props { ... }

// 3. Constants
const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Urgent'];

// 4. Component
export function Component() { ... }
```

### TypeScript Best Practices

- Always define return types for functions
- Use `interface` for object shapes
- Use `type` for unions and complex types
- Avoid `any` - use `unknown` if needed

## Deployment Checklist

Before deploying:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally (`npm start`)
- [ ] Set environment variables in hosting platform
- [ ] Test database connection from deployed app
- [ ] Enable authentication if needed
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure domain and SSL
- [ ] Test all features in production

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Shadcn/UI Docs](https://ui.shadcn.com)

### Learning Resources
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

Happy coding! 🚀
