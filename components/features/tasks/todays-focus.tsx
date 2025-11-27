'use client';

import { useMemo } from 'react';
import { getTodaysTasks, filterByEstimatedTime, filterByEnergyLevel, sortByScore } from '@/lib/utils/task-scoring';
import { Task } from '@/types/task';
import { TaskItem } from './task-item';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Zap, Target } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface TodaysFocusProps {
  tasks: Task[];
  onUpdateTask?: (taskId: string, data: Partial<Task>) => void;
  onUpdateProgress?: (taskId: string, progress: number) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function TodaysFocus({ tasks, onUpdateTask, onUpdateProgress, onDeleteTask }: TodaysFocusProps) {
  // 使用 Zustand 管理快速过滤器（全局 UI 状态）
  const { quickFilter, setQuickFilter } = useUIStore();
  
  const todaysTasks = useMemo(() => {
    let filtered = getTodaysTasks(tasks);
    
    // Apply quick filters
    switch (quickFilter) {
      case 'quick':
        filtered = filterByEstimatedTime(filtered, 30);
        break;
      case 'high_focus':
        filtered = filterByEnergyLevel(filtered, 'high_focus');
        break;
      case 'low_energy':
        filtered = filterByEnergyLevel(filtered, 'low_energy');
        break;
    }
    
    // Sort by computed score
    return sortByScore(filtered);
  }, [tasks, quickFilter]);
  
  const stats = useMemo(() => {
    const total = todaysTasks.length;
    const completed = todaysTasks.filter(t => t.status === 'done').length;
    const inProgress = todaysTasks.filter(t => t.status === 'in-progress' || t.status === 'todo').length;
    const totalTime = todaysTasks
      .filter(t => t.status !== 'done' && t.estimated_time)
      .reduce((sum, t) => sum + (t.estimated_time || 0), 0);
    
    return { total, completed, inProgress, totalTime };
  }, [todaysTasks]);
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Today's Focus</CardTitle>
          <CardDescription>
            Your prioritized tasks for today based on deadlines, priority, and progress
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-950 p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.total}
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Total Tasks</div>
            </div>
            <div className="rounded-lg bg-green-50 dark:bg-green-950 p-4">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.completed}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
            </div>
            <div className="rounded-lg bg-orange-50 dark:bg-orange-950 p-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.inProgress}
              </div>
              <div className="text-sm text-orange-600 dark:text-orange-400">In Progress</div>
            </div>
            <div className="rounded-lg bg-purple-50 dark:bg-purple-950 p-4">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {Math.round(stats.totalTime / 60)}h
              </div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Est. Time</div>
            </div>
          </div>
          
          {/* Quick filters */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={quickFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setQuickFilter('all')}
            >
              <Target size={16} className="mr-1" />
              All Tasks
            </Button>
            <Button
              size="sm"
              variant={quickFilter === 'quick' ? 'default' : 'outline'}
              onClick={() => setQuickFilter('quick')}
            >
              <Clock size={16} className="mr-1" />
              {'<'} 30min Tasks
            </Button>
            <Button
              size="sm"
              variant={quickFilter === 'high_focus' ? 'default' : 'outline'}
              onClick={() => setQuickFilter('high_focus')}
            >
              <Zap size={16} className="mr-1" />
              High Focus
            </Button>
            <Button
              size="sm"
              variant={quickFilter === 'low_energy' ? 'default' : 'outline'}
              onClick={() => setQuickFilter('low_energy')}
            >
              Low Energy
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Task list */}
      <div className="space-y-3">
        {todaysTasks.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="mx-auto max-w-md space-y-4">
              <div className="text-6xl">🎯</div>
              <h3 className="text-xl font-semibold">No tasks for today!</h3>
              <p className="text-gray-600 dark:text-gray-400">
                You're all caught up. Use the Morning Planner to add tasks to your day.
              </p>
            </div>
          </Card>
        ) : (
          todaysTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              allTasks={tasks}
              onUpdateTask={onUpdateTask}
              onUpdateProgress={onUpdateProgress}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
