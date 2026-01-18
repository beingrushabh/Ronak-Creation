import AdminGuard from "@/components/AdminGuard";
import type { ReactNode } from "react";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminGuard>
      <div className="min-h-screen flex bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </AdminGuard>
  );
}
