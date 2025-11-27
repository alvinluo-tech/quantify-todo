'use client';

import { useMemo } from 'react';
import { Task } from '@/types/task';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateProgress } from '@/lib/utils/task-tree';

interface BurndownChartProps {
  task: Task;
  allTasks: Task[];
}

export function BurndownChart({ task, allTasks }: BurndownChartProps) {
  const chartData = useMemo(() => {
    if (!task.start_date || !task.deadline) return [];
    
    const start = new Date(task.start_date);
    const end = new Date(task.deadline);
    const today = new Date();
    
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    // Generate data points for each day
    const data = [];
    for (let i = 0; i <= Math.min(totalDays, elapsedDays); i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      // Ideal progress: linear
      const idealProgress = (i / totalDays) * 100;
      
      // Actual progress: get from current state (simplified - in real app, would need historical data)
      const currentProgress = calculateProgress(task, allTasks);
      const actualProgress = i === elapsedDays ? currentProgress : (i / elapsedDays) * currentProgress;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ideal: Math.round(idealProgress),
        actual: Math.round(actualProgress),
      });
    }
    
    // Add future ideal progress
    for (let i = elapsedDays + 1; i <= totalDays; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const idealProgress = (i / totalDays) * 100;
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ideal: Math.round(idealProgress),
        actual: null,
      });
    }
    
    return data;
  }, [task, allTasks]);
  
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Burndown Chart</CardTitle>
          <CardDescription>Set both start date and deadline to see burndown chart</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Burndown Chart: {task.title}</CardTitle>
        <CardDescription>Ideal vs actual progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={Math.floor(chartData.length / 10)}
            />
            <YAxis domain={[0, 100]} label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#9ca3af" 
              strokeDasharray="5 5"
              name="Ideal Progress"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Actual Progress"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
