"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Home,
  Package,
  ShoppingCart,
  MessageSquare,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import Image from "next/image";

// 🔥 MENU CONFIG (clean & scalable)
const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Marchents",
    url: "/marchents",
    icon: Package,
  },
  {
    title: "Settings",
    url: "/settings",
    icon:Settings,
  },
];

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const pathname = usePathname();

  return (
    <Sidebar {...props} className="bg-white">

      {/* ================= HEADER ================= */}
      <SidebarHeader>
        <div className="px-2 py-4">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={150}
            height={40}
          />
        </div>
      </SidebarHeader>

      {/* ================= MENU ================= */}
      <SidebarContent className="w-60">
        <SidebarGroup>
          <SidebarGroupLabel className="uppercase">Management</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = pathname === item.url || (item.url === "/dashboard" && pathname === "/");

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className="data-[active=true]:bg-black data-[active=true]:text-white h-15 rounded-2xl px-8 tracking-wide text-lg"
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter>
        <div className="p-3">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}