import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import BreadcrumbProvider from "./breadcrumb-provider";

function AppNavbar() {
  return (
    <nav className="border-b bg-background">
      <div className="mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mx-2 h-6" />
              
                <BreadcrumbProvider />
              </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;
