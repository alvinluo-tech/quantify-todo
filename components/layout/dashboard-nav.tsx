'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ListTodo, Target, BarChart3 } from 'lucide-react';

export function DashboardNav() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <nav className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4">
        <div className="flex gap-1">
          <Link
            href="/dashboard/today"
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              isActive('/dashboard/today')
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            <Target size={18} />
            Today's Focus
          </Link>
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              isActive('/dashboard')
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            <ListTodo size={18} />
            All Tasks
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              isActive('/dashboard/analytics')
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </Link>
        </div>
      </div>
    </nav>
  );
}
