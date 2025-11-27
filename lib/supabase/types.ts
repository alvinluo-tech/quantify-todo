// 数据库类型定义
// 运行以下命令自动生成: npx supabase gen types typescript --project-id <your-project-id> > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          parent_id: string | null
          priority: number
          energy_level: string | null
          estimated_time: number | null
          deadline: string | null
          start_date: string | null
          status: 'todo' | 'in-progress' | 'done'
          manual_progress: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          parent_id?: string | null
          priority?: number
          energy_level?: string | null
          estimated_time?: number | null
          deadline?: string | null
          start_date?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          manual_progress?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          parent_id?: string | null
          priority?: number
          energy_level?: string | null
          estimated_time?: number | null
          deadline?: string | null
          start_date?: string | null
          status?: 'todo' | 'in-progress' | 'done'
          manual_progress?: number
          created_at?: string
          updated_at?: string
        }
      }
      task_logs: {
        Row: {
          id: string
          task_id: string
          user_id: string
          action: string
          timestamp: string
        }
        Insert: {
          id?: string
          task_id: string
          user_id: string
          action: string
          timestamp?: string
        }
        Update: {
          id?: string
          task_id?: string
          user_id?: string
          action?: string
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// 导出类型别名
export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskInsert = Database['public']['Tables']['tasks']['Insert']
export type TaskUpdate = Database['public']['Tables']['tasks']['Update']
export type TaskLog = Database['public']['Tables']['task_logs']['Row']
