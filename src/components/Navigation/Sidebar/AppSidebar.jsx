import { Calendar, Home, Inbox, PiIcon } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import UserContextMenu from "./UserContextMenu";
import UserProfileButton from "./UserProfileButton";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SidebarItemSkeleton from "./SidebarItemSkeleton";
import Logo from "@/app/logo";

const menuItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "New Loop",
    url: "/dashboard/start-loop",
    icon: Inbox,
  },
  {
    title: "Your Loops",
    url: "/dashboard/your-loops",
    icon: Calendar,
  },
];

// Sidebar Header Component
function SidebarHeaderContent() {
  return (
    <SidebarHeader>
      <SidebarMenuButton className="h-auto" asChild isActive>
        <a href="#">
          <Logo className="h-20 w-20 text-gray-900 dark:text-purple" />{" "}
          <div className="flex flex-col">
            <span className="text-sm text-gray-800 dark:text-gray-200">
              Automail
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              Campaign Manager
            </span>
          </div>
        </a>
      </SidebarMenuButton>
    </SidebarHeader>
  );
}

// Sidebar Menu Component
function SidebarMenuContent() {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
// Sidebar Footer with User Info
function SidebarFooterContent() {
  return (
    <SidebarFooter>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <SidebarMenuButton className="h-12">
            <Suspense fallback={<SidebarItemSkeleton />}>
              <UserProfileButton />
            </Suspense>
          </SidebarMenuButton>
        </ContextMenuTrigger>
        <UserContextMenu />
      </ContextMenu>
    </SidebarFooter>
  );
}

// Main AppSidebar Component
export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeaderContent />
      <SidebarContent>
        <SidebarMenuContent />
      </SidebarContent>
      <SidebarFooterContent />
    </Sidebar>
  );
}
