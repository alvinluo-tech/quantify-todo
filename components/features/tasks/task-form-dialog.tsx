'use client';

import { useState, useTransition, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task';
import { createTask, updateTask } from '@/lib/actions/task-actions';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TaskFormDialogProps {
  task?: Task;
  parentId?: string;
  open: boolean;
  onClose: () => void;
}

export function TaskFormDialog({ task, parentId, open, onClose }: TaskFormDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 1,
    energy_level: task?.energy_level || null,
    estimated_time: task?.estimated_time || null,
    deadline: task?.deadline ? new Date(task.deadline) : null,
    start_date: task?.start_date ? new Date(task.start_date) : null,
    parent_id: parentId || task?.parent_id || null,
  });
  
  // 当对话框打开或 task/parentId 变化时，重置表单数据
  useEffect(() => {
    if (open) {
      setFormData({
        title: task?.title || '',
        description: task?.description || '',
        priority: task?.priority || 1,
        energy_level: task?.energy_level || null,
        estimated_time: task?.estimated_time || null,
        deadline: task?.deadline ? new Date(task.deadline) : null,
        start_date: task?.start_date ? new Date(task.start_date) : null,
        parent_id: parentId || task?.parent_id || null,
      });
      setError(null);
    }
  }, [open, task, parentId]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    startTransition(async () => {
      const taskData = {
        title: formData.title,
        description: formData.description || null,
        priority: formData.priority || 1,
        energy_level: formData.energy_level,
        estimated_time: formData.estimated_time,
        deadline: formData.deadline?.toISOString() || null,
        start_date: formData.start_date?.toISOString() || null,
        parent_id: formData.parent_id,
        status: 'todo' as const,
        manual_progress: 0,
      };
      
      let result;
      if (task) {
        result = await updateTask(task.id, taskData);
      } else {
        result = await createTask(taskData);
      }
      
      if (result.success) {
        onClose();
        router.refresh();
      } else {
        setError(result.error || 'Failed to save task');
      }
    });
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {parentId ? 'Add a subtask to break down this project.' : 'Add a new task to your list.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What needs to be done?"
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add more details (supports Markdown)..."
              rows={3}
            />
          </div>
          
          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={(formData.priority || 1).toString()}
              onValueChange={(value) => setFormData({ ...formData, priority: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">P1: Low</SelectItem>
                <SelectItem value="2">P2: Medium</SelectItem>
                <SelectItem value="3">P3: High</SelectItem>
                <SelectItem value="4">P4: Urgent</SelectItem>
                <SelectItem value="5">P5: Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Energy Level */}
            <div className="space-y-2">
              <Label htmlFor="energy">Energy Level</Label>
              <Select
                value={formData.energy_level || ''}
                onValueChange={(value) => setFormData({ ...formData, energy_level: value || null })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high_focus">High Focus</SelectItem>
                  <SelectItem value="low_energy">Low Energy</SelectItem>
                  <SelectItem value="quick_win">Quick Win</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Estimated Time */}
            <div className="space-y-2">
              <Label htmlFor="time">Est. Time (minutes)</Label>
              <Input
                id="time"
                type="number"
                min="0"
                step="5"
                value={formData.estimated_time || ''}
                onChange={(e) => setFormData({ ...formData, estimated_time: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="30"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date ? formData.start_date.toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value ? new Date(e.target.value) : null })}
              />
            </div>
            
            {/* Deadline */}
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="datetime-local"
                value={formData.deadline ? formData.deadline.toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value ? new Date(e.target.value) : null })}
              />
            </div>
          </div>
          
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !formData.title}>
              {isPending ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
