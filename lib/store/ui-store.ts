import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task } from '@/lib/supabase/types';

interface UIState {
  // 侧边栏状态
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // 任务过滤器
  taskFilter: 'all' | 'active' | 'completed';
  setTaskFilter: (filter: 'all' | 'active' | 'completed') => void;
  
  // 模态框状态
  modals: {
    taskForm: boolean;
    editTask: boolean;
    addSubtask: boolean;
    morningPlanner: boolean;
    dailyReview: boolean;
  };
  openModal: (modal: keyof UIState['modals']) => void;
  closeModal: (modal: keyof UIState['modals']) => void;
  
  // 编辑任务上下文
  editingTask: Task | null;
  editingParentId: string | null;
  openEditTask: (task: Task) => void;
  openAddSubtask: (parentId: string) => void;
  clearEditContext: () => void;
  
  // 今日焦点的快速过滤
  quickFilter: 'all' | 'quick' | 'high_focus' | 'low_energy';
  setQuickFilter: (filter: 'all' | 'quick' | 'high_focus' | 'low_energy') => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // 侧边栏
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      
      // 过滤器
      taskFilter: 'all',
      setTaskFilter: (filter) => set({ taskFilter: filter }),
      
      // 模态框
      modals: {
        taskForm: false,
        editTask: false,
        addSubtask: false,
        morningPlanner: false,
        dailyReview: false,
      },
      openModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: true }
      })),
      closeModal: (modal) => set((state) => ({
        modals: { ...state.modals, [modal]: false }
      })),
      
      // 编辑上下文
      editingTask: null,
      editingParentId: null,
      openEditTask: (task) => set({ 
        editingTask: task, 
        editingParentId: null,
        modals: { taskForm: false, editTask: true, addSubtask: false, morningPlanner: false, dailyReview: false } 
      }),
      openAddSubtask: (parentId) => set({ 
        editingTask: null, 
        editingParentId: parentId,
        modals: { taskForm: false, editTask: false, addSubtask: true, morningPlanner: false, dailyReview: false } 
      }),
      clearEditContext: () => set({ 
        editingTask: null, 
        editingParentId: null 
      }),
      
      // 快速过滤
      quickFilter: 'all',
      setQuickFilter: (filter) => set({ quickFilter: filter }),
    }),
    {
      name: 'ui-store', // localStorage key
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        taskFilter: state.taskFilter,
        quickFilter: state.quickFilter,
        // 模态框状态不持久化
      }),
    }
  )
);
