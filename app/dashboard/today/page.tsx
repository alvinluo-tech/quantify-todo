import { getTasks } from '@/lib/queries/task-queries';
import { TodaysFocusClient } from '@/components/features/tasks/todays-focus-client';

export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const tasks = await getTasks();
  
  return <TodaysFocusClient initialTasks={tasks} />;
}
