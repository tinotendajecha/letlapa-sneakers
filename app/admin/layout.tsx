import { AdminSidebar } from '@/components/admin/sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-0">
          <div className="lg:pl-18">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}