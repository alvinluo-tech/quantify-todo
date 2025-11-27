'use client';

import { useDraggable } from '@dnd-kit/core';
import { Task } from '@/types/task';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, AlertCircle, GripVertical } from 'lucide-react';
import { getDeadlineStatus, getDeadlineColor } from '@/lib/utils/task-scoring';

interface DraggableTaskCardProps {
  task: Task;
  isDragging?: boolean;
}

const PRIORITY_LABELS = ['Low', 'Medium', 'High', 'Urgent'];
const PRIORITY_COLORS = [
  'bg-gray-100 text-gray-800',
  'bg-blue-100 text-blue-800',
  'bg-orange-100 text-orange-800',
  'bg-red-100 text-red-800',
];

export function DraggableTaskCard({ task, isDragging = false }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({ 
    id: task.id,
    disabled: isDragging, // 如果是 overlay，禁用拖拽
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;
  
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const deadlineColor = getDeadlineColor(deadlineStatus);
  
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab p-3 transition-shadow hover:shadow-md active:cursor-grabbing ${
        isDragging ? 'shadow-2xl rotate-2 scale-105' : ''
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="mt-1 text-gray-400">
          <GripVertical size={16} />
        </div>
        
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold">{task.title}</h4>
          
          <div className="flex flex-wrap gap-1">
            <Badge className={PRIORITY_COLORS[task.priority]}>
              P{task.priority}
            </Badge>
            
            {task.estimated_time && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock size={10} />
                {task.estimated_time}min
              </Badge>
            )}
            
            {task.deadline && (
              <Badge variant="outline" className={`flex items-center gap-1 ${deadlineColor}`}>
                <AlertCircle size={10} />
                {formatDeadline(task.deadline)}
              </Badge>
            )}
            
            {task.energy_level && (
              <Badge variant="outline" className="text-xs">
                {task.energy_level.replace('_', ' ')}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
