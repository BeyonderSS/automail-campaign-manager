import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Navigation/Sidebar/AppSidebar";
import { cookies } from "next/headers";
import AppNavbar from "@/components/Navigation/AppNavbar";
import { Suspense } from "react";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>

      <AppSidebar />
      <main className="w-full">
        <AppNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
