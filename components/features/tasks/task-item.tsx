'use client';

import { useState } from 'react';
import { Task } from '@/types/task';
import { calculateProgress } from '@/lib/utils/task-tree';
import { getDeadlineStatus, getDeadlineColor } from '@/lib/utils/task-scoring';
import { CircularProgress } from '@/components/ui/circular-progress';
import { ProgressSlider } from '@/components/ui/progress-slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight, Plus, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useUIStore } from '@/lib/store/ui-store';

interface TaskItemProps {
  task: Task;
  allTasks: Task[];
  depth?: number;
  onUpdateTask?: (taskId: string, data: Partial<Task>) => void;
  onUpdateProgress?: (taskId: string, progress: number) => void;
  onDeleteTask?: (taskId: string) => void;
}

const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Urgent'];
const PRIORITY_COLORS = [
  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
];

const STATUS_COLORS: Record<string, string> = {
  'todo': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'done': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
};

export function TaskItem({ 
  task, 
  allTasks, 
  depth = 0,
  onUpdateTask,
  onUpdateProgress,
  onDeleteTask,
}: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { openEditTask, openAddSubtask } = useUIStore();
  
  const children = task.children || [];
  const hasChildren = children.length > 0;
  const progress = calculateProgress(task, allTasks);
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const deadlineColor = getDeadlineColor(deadlineStatus);
  
  const handleStatusChange = (status: Task['status']) => {
    onUpdateTask?.(task.id, { status });
  };
  
  const handleProgressChange = (newProgress: number) => {
    onUpdateProgress?.(task.id, newProgress);
  };
  
  const handleDelete = () => {
    if (confirm(`Delete "${task.title}"${hasChildren ? ' and all its subtasks' : ''}?`)) {
      onDeleteTask?.(task.id);
    }
  };
  
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="space-y-2">
      <div 
        className="group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md"
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <div className="flex items-start gap-3">
          {/* Expand/Collapse button */}
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
          )}
          
          {/* Progress indicator */}
          {hasChildren ? (
            <CircularProgress progress={progress} size={40} />
          ) : (
            <input
              type="checkbox"
              checked={task.status === 'done'}
              onChange={(e) => handleStatusChange(e.target.checked ? 'done' : 'todo')}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          )}
          
          {/* Task content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 
                  className={`text-lg font-semibold cursor-pointer ${task.status === 'done' ? 'line-through text-gray-500' : ''}`}
                  onClick={() => openEditTask(task)}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {task.description}
                  </p>
                )}
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openAddSubtask(task.id)}
                >
                  <Plus size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge className={STATUS_COLORS[task.status]}>
                {task.status.replace('-', ' ')}
              </Badge>
              <Badge className={PRIORITY_COLORS[task.priority]}>
                P{task.priority}: {PRIORITY_LABELS[task.priority]}
              </Badge>
              {task.energy_level && (
                <Badge variant="outline">
                  {task.energy_level.replace('_', ' ')}
                </Badge>
              )}
              {task.estimated_time && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock size={12} />
                  {task.estimated_time}min
                </Badge>
              )}
              {task.deadline && (
                <Badge variant="outline" className={`flex items-center gap-1 ${deadlineColor}`}>
                  <AlertCircle size={12} />
                  {formatDeadline(task.deadline)}
                </Badge>
              )}
            </div>
            
            {/* Progress slider for in-progress leaf tasks */}
            {!hasChildren && task.status === 'in-progress' && (
              <ProgressSlider
                value={task.manual_progress}
                onChange={handleProgressChange}
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Child tasks */}
      {isExpanded && hasChildren && (
        <div className="space-y-2">
          {children.map((child) => (
            <TaskItem 
              key={child.id} 
              task={child} 
              allTasks={allTasks} 
              depth={depth + 1}
              onUpdateTask={onUpdateTask}
              onUpdateProgress={onUpdateProgress}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
