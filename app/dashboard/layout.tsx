import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserProvider } from '@/lib/contexts/user-context';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { DashboardNav } from '@/components/layout/dashboard-nav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return (
    <UserProvider user={user}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <DashboardNav />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </UserProvider>
  );
}
