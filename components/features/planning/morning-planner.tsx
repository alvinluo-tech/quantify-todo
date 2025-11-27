'use client';

import { useState, useMemo, useTransition } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { Task } from '@/types/task';
import { updateTask } from '@/lib/actions/task-actions';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DraggableTaskCard } from '../tasks/draggable-task-card';
import { useUIStore } from '@/lib/store/ui-store';

interface MorningPlannerProps {
  open: boolean;
  onClose: () => void;
  tasks: Task[];
}

export function MorningPlanner({ open, onClose, tasks }: MorningPlannerProps) {
  const { closeModal } = useUIStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 减小激活距离，让拖拽更灵敏
      },
    })
  );
  
  // 统一关闭处理
  const handleClose = () => {
    onClose();
    closeModal('morningPlanner');
  };
  
  // Separate tasks into backlog and today's plan
  const { backlog, todaysPlan } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const backlog = tasks.filter(task => {
      if (task.status === 'done') return false;
      if (task.start_date) {
        const startDate = new Date(task.start_date);
        if (startDate >= today && startDate < tomorrow) return false;
      }
      return true;
    });
    
    const todaysPlan = tasks.filter(task => {
      if (task.status === 'done') return false;
      if (task.start_date) {
        const startDate = new Date(task.start_date);
        return startDate >= today && startDate < tomorrow;
      }
      return false;
    });
    
    return { backlog, todaysPlan };
  }, [tasks]);
  
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const taskId = active.id as string;
    const targetContainer = over.id as string;
    
    // Set start_date based on target container
    startTransition(async () => {
      if (targetContainer === 'today') {
        const today = new Date();
        today.setHours(9, 0, 0, 0); // Default to 9 AM
        await updateTask(taskId, { start_date: today.toISOString() });
      } else if (targetContainer === 'backlog') {
        await updateTask(taskId, { start_date: null });
      }
    });
    
    setActiveId(null);
  };
  
  const activeTask = tasks.find(t => t.id === activeId);
  
  // Droppable container component
  function DroppableContainer({ id, children }: { id: string; children: React.ReactNode }) {
    const { setNodeRef } = useDroppable({ id });
    return <div ref={setNodeRef} className="min-h-[200px]">{children}</div>;
  }
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-6xl h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl">Morning Planner</DialogTitle>
          <DialogDescription>
            Drag tasks from your backlog to plan your day. Focus on what truly matters.
          </DialogDescription>
        </DialogHeader>
        
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
            {/* Backlog */}
            <Card className="flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle>Backlog ({backlog.length})</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <DroppableContainer id="backlog">
                  <div className="space-y-2 pb-4">
                    {backlog.map(task => (
                      <DraggableTaskCard key={task.id} task={task} />
                    ))}
                    {backlog.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed p-8 text-center text-gray-500">
                        All tasks planned!
                      </div>
                    )}
                  </div>
                </DroppableContainer>
              </CardContent>
            </Card>
            
            {/* Today's Plan */}
            <Card className="flex flex-col overflow-hidden bg-blue-50 dark:bg-blue-950">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  Today's Plan ({todaysPlan.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <DroppableContainer id="today">
                  <div className="space-y-2 pb-4">
                    {todaysPlan.map(task => (
                      <DraggableTaskCard key={task.id} task={task} />
                    ))}
                    {todaysPlan.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-blue-300 dark:border-blue-700 p-8 text-center text-blue-600 dark:text-blue-400">
                        Drag tasks here to plan your day
                      </div>
                    )}
                  </div>
                </DroppableContainer>
              </CardContent>
            </Card>
          </div>
          
          <DragOverlay>
            {activeTask ? <DraggableTaskCard task={activeTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
        
        <div className="flex justify-end flex-shrink-0 pt-4 border-t">
          <Button onClick={handleClose} disabled={isPending}>Done Planning</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
