import { AppHeader } from '@/components/shared/AppHeader';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { RequireAuth } from '@/components/shared/RequireAuth';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RequireAuth>
  );
}
