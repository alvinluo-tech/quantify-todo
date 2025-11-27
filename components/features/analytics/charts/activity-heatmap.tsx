'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ActivityHeatmapProps {
  tasks: any[];
}

export function ActivityHeatmap({ tasks }: ActivityHeatmapProps) {
  const heatmapData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    
    return last30Days.map(date => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Count tasks completed on this day
      const completedTasks = tasks.filter(task => {
        if (task.status !== 'done') return false;
        const updatedAt = new Date(task.updated_at);
        return updatedAt >= date && updatedAt < nextDay;
      }).length;
      
      // Sum estimated time for completed tasks
      const hoursLogged = tasks
        .filter(task => {
          if (task.status !== 'done') return false;
          const updatedAt = new Date(task.updated_at);
          return updatedAt >= date && updatedAt < nextDay;
        })
        .reduce((sum, task) => sum + (task.estimated_time || 0), 0) / 60;
      
      const activity = completedTasks + Math.round(hoursLogged);
      
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completedTasks,
        hoursLogged: Math.round(hoursLogged * 10) / 10,
        activity,
      };
    });
  }, [tasks]);
  
  const maxActivity = Math.max(...heatmapData.map(d => d.activity), 1);
  
  const getColor = (value: number) => {
    const intensity = value / maxActivity;
    if (intensity === 0) return '#e5e7eb';
    if (intensity < 0.25) return '#93c5fd';
    if (intensity < 0.5) return '#60a5fa';
    if (intensity < 0.75) return '#3b82f6';
    return '#1d4ed8';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Heatmap</CardTitle>
        <CardDescription>Task completion and time logged over the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={heatmapData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={2}
            />
            <YAxis />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="rounded-lg border bg-white p-3 shadow-lg dark:bg-gray-800">
                      <p className="font-semibold">{data.date}</p>
                      <p className="text-sm">Completed: {data.completedTasks} tasks</p>
                      <p className="text-sm">Time: {data.hoursLogged}h logged</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="activity" radius={[4, 4, 0, 0]}>
              {heatmapData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.activity)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
