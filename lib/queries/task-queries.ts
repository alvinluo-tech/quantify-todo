import { createClient } from '@/lib/supabase/server';
import { Task } from '@/lib/supabase/types';
import { cache } from 'react';

// 使用 React cache 缓存请求
export const getTasks = cache(async (): Promise<Task[]> => {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Failed to fetch tasks:', error);
    return [];
  }
  
  return data || [];
});

export const getTaskById = cache(async (id: string): Promise<Task | null> => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Failed to fetch task:', error);
    return null;
  }
  
  return data;
});

export const getChildTasks = cache(async (parentId: string): Promise<Task[]> => {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Failed to fetch child tasks:', error);
    return [];
  }
  
  return data || [];
});
