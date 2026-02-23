"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR_ITEMS } from "@/constants";
import { Link, usePathname } from "@/i18n/navigation";
import Image from "next/image";

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader className="p-4 border-white/20 border-b h-23">
        <Link href="/" aria-label="Home">
          <Image
            src="/white-logo.png"
            alt="Logo"
            width={160}
            height={40}
            preload
            className="w-40 lg:min-w-40 transition-all duration-300 cursor-pointer"
            unoptimized
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="pr-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = item.activeUrls.some((url) => pathname.startsWith(url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${isActive ? "bg-white text-sidebar-accent-foreground" : ""} text-base h-10 rounded-r-none`}
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
