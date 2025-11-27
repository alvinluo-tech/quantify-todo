'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';

/**
 * UserContext - 仅供 Client Components 使用
 * 
 * ⚠️ 重要说明：
 * - Server Components 应直接调用 `await createClient().auth.getUser()`
 * - Next.js 的 Request Memoization 会自动优化同一请求中的多次调用
 * - 此 Context 仅用于深层嵌套的 Client Components，避免 prop drilling
 * 
 * 使用场景：
 * - Client Component 需要用户信息（如 Header、Avatar）
 * - 避免通过多层 props 传递 user 对象
 */

interface UserContextType {
  user: User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ user, children }: { user: User | null; children: ReactNode }) {
  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUser Hook - 在 Client Components 中获取当前用户
 * 
 * @throws {Error} 如果在 UserProvider 外部使用
 * @returns {User | null} 当前认证用户对象
 */
export function useUser() {
  const context = useContext(UserContext);
  
  if (context === undefined) {
    throw new Error('useUser must be used within UserProvider');
  }
  
  return context.user;
}
