import { Task, TaskWithProgress } from '@/types/task';

/**
 * Calculate progress for a task
 * - Leaf tasks: Use manual_progress, but 100% if status is 'done'
 * - Parent tasks: Calculate average of all children's progress
 */
export function calculateProgress(task: Task, allTasks: Task[]): number {
  const children = allTasks.filter(t => t.parent_id === task.id);
  
  // Leaf task: use manual progress, but override to 100 if done
  if (children.length === 0) {
    return task.status === 'done' ? 100 : task.manual_progress;
  }
  
  // Parent task: calculate average of children
  const childrenProgress = children.map(child => calculateProgress(child, allTasks));
  const averageProgress = childrenProgress.reduce((sum, p) => sum + p, 0) / children.length;
  
  return Math.round(averageProgress);
}

/**
 * Convert flat task list to nested tree structure
 */
export function buildTaskTree(tasks: Task[]): Task[] {
  const taskMap = new Map<string, Task>();
  const roots: Task[] = [];
  
  // First pass: create a map and add children property
  tasks.forEach(task => {
    taskMap.set(task.id, { ...task, children: [] });
  });
  
  // Second pass: build the tree
  tasks.forEach(task => {
    const taskWithChildren = taskMap.get(task.id)!;
    
    if (task.parent_id === null) {
      roots.push(taskWithChildren);
    } else {
      const parent = taskMap.get(task.parent_id);
      if (parent) {
        parent.children!.push(taskWithChildren);
      }
    }
  });
  
  return roots;
}

/**
 * Flatten a task tree back to a list
 */
export function flattenTaskTree(tasks: Task[]): Task[] {
  const result: Task[] = [];
  
  function traverse(task: Task) {
    result.push(task);
    if (task.children) {
      task.children.forEach(traverse);
    }
  }
  
  tasks.forEach(traverse);
  return result;
}

/**
 * Enhance tasks with calculated progress
 */
export function enhanceTasksWithProgress(tasks: Task[]): TaskWithProgress[] {
  return tasks.map(task => {
    const children = tasks.filter(t => t.parent_id === task.id);
    return {
      ...task,
      calculated_progress: calculateProgress(task, tasks),
      is_leaf: children.length === 0,
    };
  });
}

/**
 * Get all descendant task IDs (for bulk operations)
 */
export function getDescendantIds(taskId: string, allTasks: Task[]): string[] {
  const descendants: string[] = [];
  const children = allTasks.filter(t => t.parent_id === taskId);
  
  children.forEach(child => {
    descendants.push(child.id);
    descendants.push(...getDescendantIds(child.id, allTasks));
  });
  
  return descendants;
}
