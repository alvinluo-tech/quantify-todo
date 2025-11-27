'use server';

import { createClient } from '@/lib/supabase/server';
import { TaskInsert, TaskUpdate } from '@/lib/supabase/types';
import { revalidatePath } from 'next/cache';

class AppError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AppError';
  }
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    throw new AppError('Unauthorized', 'UNAUTHORIZED');
  }
  
  return user;
}

export async function createTask(data: Omit<TaskInsert, 'user_id'>) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();
    
    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        ...data,
        user_id: user.id,
      })
      .select()
      .single();
    
    if (error) {
      console.error('Create task error:', error);
      throw new AppError(error.message, error.code || 'CREATE_FAILED');
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/today');
    
    return { success: true, data: task };
  } catch (error) {
    console.error('Failed to create task:', error);
    return {
      success: false,
      error: error instanceof AppError ? error.message : 'Failed to create task'
    };
  }
}

export async function updateTask(id: string, data: TaskUpdate) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();
    
    // 验证任务所有权
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (!existingTask || existingTask.user_id !== user.id) {
      throw new AppError('Task not found or access denied', 'FORBIDDEN');
    }
    
    // 如果状态改为 done，自动设置 manual_progress 为 100
    const updateData = { ...data };
    if (updateData.status === 'done' && updateData.manual_progress === undefined) {
      updateData.manual_progress = 100;
    }
    // 如果状态从 done 改回来，且没有指定 progress，重置为 0
    if (updateData.status && updateData.status !== 'done' && updateData.manual_progress === undefined) {
      updateData.manual_progress = 0;
    }
    
    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Update task error:', error);
      throw new AppError(error.message, error.code || 'UPDATE_FAILED');
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/today');
    
    return { success: true, data: task };
  } catch (error) {
    console.error('Failed to update task:', error);
    return {
      success: false,
      error: error instanceof AppError ? error.message : 'Failed to update task'
    };
  }
}

export async function deleteTask(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();
    
    // 验证任务所有权
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', id)
      .single();
    
    if (!existingTask || existingTask.user_id !== user.id) {
      throw new AppError('Task not found or access denied', 'FORBIDDEN');
    }
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete task error:', error);
      throw new AppError(error.message, error.code || 'DELETE_FAILED');
    }
    
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/today');
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete task:', error);
    return {
      success: false,
      error: error instanceof AppError ? error.message : 'Failed to delete task'
    };
  }
}

export async function updateTaskProgress(id: string, progress: number) {
  return updateTask(id, { manual_progress: progress });
}

export async function toggleTaskStatus(id: string, status: 'todo' | 'in-progress' | 'done') {
  return updateTask(id, { status });
}
