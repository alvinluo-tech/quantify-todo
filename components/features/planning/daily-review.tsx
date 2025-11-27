'use client';

import { useMemo, useState, useTransition } from 'react';
import { Task } from '@/types/task';
import { updateTask } from '@/lib/actions/task-actions';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface DailyReviewProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function DailyReview({ open, onClose, tasks }: DailyReviewProps) {
  const [selectedTasksToMigrate, setSelectedTasksToMigrate] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const { closeModal } = useUIStore();
  
  const todayStats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Tasks completed today
    const completedToday = tasks.filter(task => {
      if (task.status !== 'done') return false;
      const updatedAt = new Date(task.updated_at);
      return updatedAt >= today && updatedAt < tomorrow;
    });
    
    // Tasks updated today (progress changed)
    const updatedToday = tasks.filter(task => {
      if (task.status === 'done') return false;
      const updatedAt = new Date(task.updated_at);
      return updatedAt >= today && updatedAt < tomorrow;
    });
    
    // Unfinished tasks that were planned for today
    const unfinishedToday = tasks.filter(task => {
      if (task.status === 'done') return false;
      if (task.start_date) {
        const startDate = new Date(task.start_date);
        return startDate >= today && startDate < tomorrow;
      }
      return false;
    });
    
    // Total time logged
    const totalTime = completedToday.reduce((sum, task) => sum + (task.estimated_time || 0), 0);
    
    return {
      completed: completedToday,
      updated: updatedToday,
      unfinished: unfinishedToday,
      totalTime,
    };
  }, [tasks]);
  
  const toggleTaskMigration = (taskId: string) => {
    const newSet = new Set(selectedTasksToMigrate);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setSelectedTasksToMigrate(newSet);
  };
  
  const handleMigrateTasks = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    
    startTransition(async () => {
      // Migrate selected tasks to tomorrow
      for (const taskId of selectedTasksToMigrate) {
        await updateTask(taskId, { start_date: tomorrow.toISOString() });
      }
      
      // Archive or reset tasks that weren't selected
      for (const task of todayStats.unfinished) {
        if (!selectedTasksToMigrate.has(task.id)) {
          await updateTask(task.id, { start_date: null });
        }
      }
      
      onClose();
      closeModal('dailyReview');
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Daily Review</DialogTitle>
          <DialogDescription>
            Reflect on today's progress and plan for tomorrow
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-green-50 dark:bg-green-950 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {todayStats.completed.length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">Completed</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-blue-50 dark:bg-blue-950 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600 dark:text-blue-400" size={24} />
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {todayStats.updated.length}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Updated</div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-purple-50 dark:bg-purple-950 p-4">
              <div className="flex items-center gap-2">
                <Circle className="text-purple-600 dark:text-purple-400" size={24} />
                <div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round(todayStats.totalTime / 60)}h
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">Time Logged</div>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Completed Tasks */}
          {todayStats.completed.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600 dark:text-green-400">
                ✅ Completed Today
              </h3>
              <div className="space-y-1">
                {todayStats.completed.map(task => (
                  <div key={task.id} className="rounded-lg bg-green-50 dark:bg-green-950 p-2 text-sm">
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Unfinished Tasks */}
          {todayStats.unfinished.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">
                📋 Unfinished Tasks - Migrate to Tomorrow?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select tasks you want to continue working on tomorrow
              </p>
              <div className="space-y-2">
                {todayStats.unfinished.map(task => (
                  <Card
                    key={task.id}
                    className={`cursor-pointer p-3 transition-colors ${
                      selectedTasksToMigrate.has(task.id)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                    }`}
                    onClick={() => toggleTaskMigration(task.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedTasksToMigrate.has(task.id)}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        {task.manual_progress > 0 && (
                          <Badge variant="outline" className="mt-1">
                            {task.manual_progress}% complete
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* Encouragement */}
          {todayStats.completed.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 p-6 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-lg font-semibold mb-1">Great work today!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You completed {todayStats.completed.length} task{todayStats.completed.length !== 1 ? 's' : ''} 
                {todayStats.totalTime > 0 && ` and logged ${Math.round(todayStats.totalTime / 60)} hours`}. 
                Keep up the momentum!
              </p>
            </Card>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => { onClose(); closeModal('dailyReview'); }} disabled={isPending}>
            Skip
          </Button>
          <Button onClick={handleMigrateTasks} disabled={isPending}>
            Migrate {selectedTasksToMigrate.size} Task{selectedTasksToMigrate.size !== 1 ? 's' : ''} to Tomorrow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
