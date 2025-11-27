'use client';

import { useTransition, useOptimistic } from 'react';
import { Task } from '@/lib/supabase/types';
import { TaskItem } from './task-item';
import { TaskFormDialog } from './task-form-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { buildTaskTree } from '@/lib/utils/task-tree';
import { MorningPlanner } from '../planning/morning-planner';
import { DailyReview } from '../planning/daily-review';
import { useTimeCheck, useMorningPlanner, useDailyReview } from '@/lib/hooks/use-time-check';
import { useUIStore } from '@/lib/store/ui-store';
import { updateTask, updateTaskProgress, deleteTask } from '@/lib/actions/task-actions';

interface TaskListClientProps {
  initialTasks: Task[];
}

export function TaskListClient({ initialTasks }: TaskListClientProps) {
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
  
  // UI 状态从 Zustand 获取（全局状态，跨组件共享）
  const { 
    modals, 
    openModal, 
    closeModal, 
    editingTask, 
    editingParentId, 
    clearEditContext 
  } = useUIStore();
  
  // 时间检查
  const { showMorningPlanner: shouldShowMorning, showDailyReview: shouldShowReview } = useTimeCheck();
  const morningPlanner = useMorningPlanner();
  const dailyReview = useDailyReview();
  
  // 如果应该显示，打开对话框
  if (shouldShowMorning && !morningPlanner.isOpen) {
    morningPlanner.open();
  }
  
  if (shouldShowReview && !dailyReview.isOpen) {
    dailyReview.open();
  }
  
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
        // 如果失败，revalidation 会恢复真实数据
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
  
  const taskTree = buildTaskTree(optimisticTasks);
  
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">All Tasks</h2>
          <Button onClick={() => openModal('taskForm')} disabled={isPending}>
            <Plus size={20} className="mr-2" />
            New Task
          </Button>
        </div>
        
        <div className="space-y-3">
          {taskTree.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="mx-auto max-w-md space-y-4">
                <div className="text-6xl">📝</div>
                <h3 className="text-xl font-semibold">No tasks yet!</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Create your first task to start tracking your progress and achieving your goals.
                </p>
                <Button onClick={() => openModal('taskForm')} size="lg">
                  <Plus size={20} className="mr-2" />
                  Create Your First Task
                </Button>
              </div>
            </Card>
          ) : (
            taskTree.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                allTasks={optimisticTasks}
                onUpdateTask={handleUpdateTask}
                onUpdateProgress={handleUpdateProgress}
                onDeleteTask={handleDeleteTask}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Global dialogs - single instance */}
      <TaskFormDialog 
        open={modals.taskForm} 
        onClose={() => closeModal('taskForm')} 
      />
      <TaskFormDialog 
        open={modals.editTask} 
        task={editingTask || undefined}
        onClose={() => { closeModal('editTask'); clearEditContext(); }} 
      />
      <TaskFormDialog 
        open={modals.addSubtask} 
        parentId={editingParentId || undefined}
        onClose={() => { closeModal('addSubtask'); clearEditContext(); }} 
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
