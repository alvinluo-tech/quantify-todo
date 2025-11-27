// Core type definitions for the Quantified Self Todo List
// 统一使用数据库类型定义

import { Task as DBTask, TaskInsert, TaskUpdate } from '@/lib/supabase/types';

// 导出数据库类型作为核心类型
export type Task = DBTask & {
  // Frontend-only property for nested display
  children?: Task[];
};

// 类型别名（向后兼容）
export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type EnergyLevel = 'high_focus' | 'low_energy' | 'quick_win';
export type Priority = number; // 1-5

// 导出插入和更新类型
export type { TaskInsert, TaskUpdate };

export interface TaskLog {
  id: string;
  task_id: string;
  progress_snapshot: number;
  note: string | null;
  created_at: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  priority?: number;
  energy_level?: string | null;
  estimated_time?: number | null;
  deadline?: Date | null;
  start_date?: Date | null;
  parent_id?: string | null;
}

export interface TaskWithProgress extends Task {
  calculated_progress: number; // Computed progress (from children or manual)
  is_leaf: boolean; // True if no children
}

export interface DailyStats {
  completed_tasks: number;
  updated_tasks: number;
  total_time_logged: number;
  date: string;
}

export interface BurndownDataPoint {
  date: string;
  ideal_progress: number;
  actual_progress: number;
}
