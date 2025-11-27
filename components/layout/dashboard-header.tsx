'use client';

import { useUser } from '@/lib/contexts/user-context';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, Moon, ListOrdered } from 'lucide-react';
import { useTimeCheck } from '@/lib/hooks/use-time-check';
import { useUIStore } from '@/lib/store/ui-store';

export function DashboardHeader() {
  const user = useUser();
  const router = useRouter();
  const { greeting } = useTimeCheck();
  const { openModal } = useUIStore();
  
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };
  
  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-gray-950 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Quantified Self Todo</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400" suppressHydrationWarning>
              {greeting}, {user?.email?.split('@')[0]} · Progress {">"} Completion
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => openModal('morningPlanner')}
              title="打开晨间计划 - 拖拽任务设置优先级"
            >
              <ListOrdered size={18} className="mr-2" />
              晨间计划
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              登出
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
