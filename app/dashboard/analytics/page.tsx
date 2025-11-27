import { getTasks } from '@/lib/queries/task-queries';
import { AnalyticsDashboard } from '@/components/features/analytics/analytics-dashboard';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const tasks = await getTasks();
  
  return <AnalyticsDashboard tasks={tasks} />;
}
