import { Task, TaskWithProgress } from '@/types/task';

/**
 * Compute a priority score for a task based on multiple factors
 * Higher score = higher priority
 */
export function computeTaskScore(task: Task): number {
  let score = 0;
  
  // Factor 1: Priority level (0-3) → 0-30 points
  score += task.priority * 10;
  
  // Factor 2: Deadline proximity
  if (task.deadline) {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDeadline < 0) {
      // Overdue: massive boost
      score += 50;
    } else if (hoursUntilDeadline < 24) {
      // Due today: high boost
      score += 40;
    } else if (hoursUntilDeadline < 48) {
      // Due tomorrow: medium boost
      score += 25;
    } else if (hoursUntilDeadline < 168) {
      // Due this week: small boost
      score += 10;
    }
  }
  
  // Factor 3: Stagnation (tasks created long ago but not started)
  if (task.status === 'todo') {
    const createdAt = new Date(task.created_at);
    const now = new Date();
    const daysOld = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysOld > 7) {
      score += Math.min(daysOld * 2, 30); // Cap at 30 points
    }
  }
  
  // Factor 4: In-progress tasks get a boost (finish what you started)
  if (task.status === 'in-progress') {
    score += 20;
  }
  
  return score;
}

/**
 * Get deadline status for visual cues
 */
export function getDeadlineStatus(deadline: string | null): 'overdue' | 'today' | 'soon' | 'future' | 'none' {
  if (!deadline) return 'none';
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const hoursUntilDeadline = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilDeadline < 0) return 'overdue';
  if (hoursUntilDeadline < 24) return 'today';
  if (hoursUntilDeadline < 72) return 'soon';
  return 'future';
}

/**
 * Get CSS classes for deadline status
 */
export function getDeadlineColor(status: ReturnType<typeof getDeadlineStatus>): string {
  switch (status) {
    case 'overdue':
      return 'text-red-600 dark:text-red-400';
    case 'today':
      return 'text-orange-600 dark:text-orange-400';
    case 'soon':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'future':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-500';
  }
}

/**
 * Filter tasks for "Today's Focus"
 */
export function getTodaysTasks(tasks: Task[]): Task[] {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);
  
  return tasks.filter(task => {
    // Exclude completed and archived tasks
    if (task.status === 'done') return false;
    
    // Include tasks with deadline today
    if (task.deadline) {
      const deadline = new Date(task.deadline);
      if (deadline >= todayStart && deadline < todayEnd) return true;
    }
    
    // Include tasks in progress
    if (task.status === 'in-progress') return true;
    
    // Include tasks with start_date today
    if (task.start_date) {
      const startDate = new Date(task.start_date);
      if (startDate >= todayStart && startDate < todayEnd) return true;
    }
    
    return false;
  });
}

/**
 * Filter tasks by estimated time
 */
export function filterByEstimatedTime(tasks: Task[], maxMinutes: number): Task[] {
  return tasks.filter(task => {
    if (!task.estimated_time) return false;
    return task.estimated_time <= maxMinutes;
  });
}

/**
 * Filter tasks by energy level
 */
export function filterByEnergyLevel(tasks: Task[], energyLevel: Task['energy_level']): Task[] {
  return tasks.filter(task => task.energy_level === energyLevel);
}

/**
 * Sort tasks by computed score (descending)
 */
export function sortByScore(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => computeTaskScore(b) - computeTaskScore(a));
}
