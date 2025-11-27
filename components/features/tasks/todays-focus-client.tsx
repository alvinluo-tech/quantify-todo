'use client';

import { useTransition, useOptimistic } from 'react';
import { Task } from '@/lib/supabase/types';
import { TodaysFocus } from './todays-focus';
import { MorningPlanner } from '../planning/morning-planner';
import { DailyReview } from '../planning/daily-review';
import { useTimeCheck, useMorningPlanner, useDailyReview } from '@/lib/hooks/use-time-check';
import { useUIStore } from '@/lib/store/ui-store';
import { updateTask, updateTaskProgress, deleteTask } from '@/lib/actions/task-actions';

interface TodaysFocusClientProps {
  initialTasks: Task[];
}

export function TodaysFocusClient({ initialTasks }: TodaysFocusClientProps) {
  const [isPending, startTransition] = useTransition();
  
  // 乐观更新状态管理
  const [optimisticTasks, updateOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, { action, taskId, data }: { action: 'update' | 'delete'; taskId: string; data?: Partial<Task> }) => {
      if (action === 'delete') {
        return state.filter(t => t.id !== taskId && t.parent_id !== taskId);
      }
      if (action === 'update' && data) {
        return state.map(t => t.id === taskId ? { ...t, ...data } : t);
      }
      return state;
    }
  );
  
  const { showMorningPlanner: shouldShowMorning, showDailyReview: shouldShowReview } = useTimeCheck();
  const morningPlanner = useMorningPlanner();
  const dailyReview = useDailyReview();
  const { modals } = useUIStore();
  
  // 乐观更新处理函数
  const handleUpdateTask = async (taskId: string, data: Partial<Task>) => {
    startTransition(async () => {
      // 如果状态改为 done，自动设置 manual_progress 为 100
      const optimisticData = { ...data };
      if (optimisticData.status === 'done' && optimisticData.manual_progress === undefined) {
        optimisticData.manual_progress = 100;
      }
      // 如果状态从 done 改回来，且没有指定 progress，重置为 0
      if (optimisticData.status && optimisticData.status !== 'done' && optimisticData.manual_progress === undefined) {
        optimisticData.manual_progress = 0;
      }
      
      updateOptimisticTasks({ action: 'update', taskId, data: optimisticData });
      const result = await updateTask(taskId, data);
      if (!result.success) {
        console.error('Task update failed:', result.error);
      }
    });
  };
  
  const handleUpdateProgress = async (taskId: string, progress: number) => {
    startTransition(async () => {
      updateOptimisticTasks({ action: 'update', taskId, data: { manual_progress: progress } });
      const result = await updateTaskProgress(taskId, progress);
      if (!result.success) {
        console.error('Progress update failed:', result.error);
      }
    });
  };
  
  const handleDeleteTask = async (taskId: string) => {
    startTransition(async () => {
      updateOptimisticTasks({ action: 'delete', taskId });
      const result = await deleteTask(taskId);
      if (!result.success) {
        console.error('Task deletion failed:', result.error);
      }
    });
  };
  
  // 如果应该显示，打开对话框
  if (shouldShowMorning && !morningPlanner.isOpen) {
    morningPlanner.open();
  }
  
  if (shouldShowReview && !dailyReview.isOpen) {
    dailyReview.open();
  }
  
  return (
    <>
      <TodaysFocus 
        tasks={optimisticTasks}
        onUpdateTask={handleUpdateTask}
        onUpdateProgress={handleUpdateProgress}
        onDeleteTask={handleDeleteTask}
      />
      <MorningPlanner 
        open={morningPlanner.isOpen || modals.morningPlanner} 
        onClose={morningPlanner.close} 
        tasks={optimisticTasks} 
      />
      <DailyReview 
        open={dailyReview.isOpen || modals.dailyReview} 
        onClose={dailyReview.close} 
        tasks={optimisticTasks} 
      />
    </>
  );
}
