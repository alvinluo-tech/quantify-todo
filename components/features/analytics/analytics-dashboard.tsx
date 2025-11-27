'use client';

import { ActivityHeatmap } from './charts/activity-heatmap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AnalyticsDashboardProps {
  tasks: any[];
}

export function AnalyticsDashboard({ tasks }: AnalyticsDashboardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Analytics & Insights</CardTitle>
          <CardDescription>
            Track your productivity patterns and progress over time
          </CardDescription>
        </CardHeader>
      </Card>
      
      <ActivityHeatmap tasks={tasks} />
      
      {/* Add more analytics components here */}
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            More insights including task completion rates, average completion time, and productivity trends
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-500">
          📊 Additional analytics features in development
        </CardContent>
      </Card>
    </div>
  );
}
