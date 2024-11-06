"use client";
import { useEffect } from "react";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data } = useCurrentUser();
  useEffect(() => {
    if (data && data?.role !== "admin") {
      window.location.href = "/";
    }
  }, [data, data?.role]);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-2 w-full">
        <SidebarTrigger className="size-4 text-gray-600" />
        {children}
      </main>
    </SidebarProvider>
  );
}
