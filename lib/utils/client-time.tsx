/**
 * 时间工具 - 避免 Hydration Mismatch
 * 
 * 问题：Server Components 使用服务器时间（UTC），Client Components 使用本地时间
 * 解决：统一在客户端渲染时间，或使用 suppressHydrationWarning
 */

/**
 * 仅在客户端执行的时间格式化 Hook
 * 避免服务端和客户端时间不一致导致的水合错误
 */
import { useEffect, useState } from 'react';

export function useClientTime(date: Date | string | null): string | null {
  const [formatted, setFormatted] = useState<string | null>(null);
  
  useEffect(() => {
    if (!date) {
      setFormatted(null);
      return;
    }
    
    const d = typeof date === 'string' ? new Date(date) : date;
    setFormatted(d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, [date]);
  
  return formatted;
}

/**
 * 客户端安全的"现在"时间
 * 初次渲染返回 null，避免水合不匹配
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);
  
  useEffect(() => {
    setNow(new Date());
  }, []);
  
  return now;
}

/**
 * 格式化相对时间（客户端安全）
 */
export function useRelativeTime(date: Date | string | null): string {
  const [relative, setRelative] = useState<string>('');
  
  useEffect(() => {
    if (!date) {
      setRelative('');
      return;
    }
    
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      setRelative('刚刚');
    } else if (diffMins < 60) {
      setRelative(`${diffMins}分钟前`);
    } else if (diffHours < 24) {
      setRelative(`${diffHours}小时前`);
    } else if (diffDays < 7) {
      setRelative(`${diffDays}天前`);
    } else {
      setRelative(d.toLocaleDateString('zh-CN'));
    }
  }, [date]);
  
  return relative;
}

/**
 * 服务端安全的日期格式化（返回 ISO 字符串）
 * 在 Server Components 中使用，传给 Client Components
 */
export function formatDateForClient(date: Date | string | null): string | null {
  if (!date) return null;
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * ClientOnly 组件包装器
 * 确保子组件仅在客户端渲染，避免时间相关的水合错误
 */
'use client';

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <>{children}</>;
}
