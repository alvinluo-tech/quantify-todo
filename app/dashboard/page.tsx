import { getTasks } from '@/lib/queries/task-queries';
import { TaskListClient } from '@/components/features/tasks/task-list-client';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const tasks = await getTasks();
  
  return <TaskListClient initialTasks={tasks} />;
}
