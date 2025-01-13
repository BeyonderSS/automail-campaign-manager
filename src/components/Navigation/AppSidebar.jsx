import {
  Calendar,
  Home,
  Inbox,
  Key,
  LogOut,
  PiIcon,
  SeparatorHorizontal,
  User,
} from "lucide-react";

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
import Image from "next/image";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import Link from "next/link";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "New Loop",
    url: "start-loop",
    icon: Inbox,
  },
  {
    title: "Your Loops",
    url: "your-loops",
    icon: Calendar,
  },
];

export function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton className="h-auto" asChild isActive>
          <a href={"#"}>
            <PiIcon />
            <div className="flex flex-col">
              <span className="text-sm text-gray-800 dark:text-gray-200">
                Automail
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Campaign Manager{" "}
              </span>
            </div>
          </a>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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
      </SidebarContent>
      <SidebarFooter>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <SidebarMenuButton asChild className="h-12">
              <div className="">
                <Image
                  src="/profile.png"
                  className="rounded-md"
                  alt="Profile"
                  width={32}
                  height={32}
                />
                <div className="flex flex-col">
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    Puneet Bhardwaj
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    bpuneet2003@gmail.com
                  </span>
                </div>
                <SeparatorHorizontal className="text-gray-800 dark:text-white" />
              </div>
            </SidebarMenuButton>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <Link href="/profile" className="cursor-pointer">
              <ContextMenuItem>
                <User className={`mr-2 h-4 w-4`} />
                Profile
              </ContextMenuItem>
            </Link>
            <Link href={"/manage-credentials"}>
            <ContextMenuItem>
              <Key className={`mr-2 h-4 w-4`} />
              Credentials
            </ContextMenuItem>
            </Link>
            <ContextMenuItem className="text-red-600 hover:bg-red-400 hover:text-red-800">
              <LogOut className={`mr-2 h-4 w-4`} />
              Logout
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
