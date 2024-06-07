"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Building2,
  BookOpenText,
  ClipboardCheck,
  UsersRound,
  ScrollText,
  Home,
  Contact2,
  Users,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";

const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/dashboard" },
  {
    icon: ClipboardCheck,
    label: "reportes",
    href: "/admin/interventores",
  },
];
const adminRoutes = [
  { icon: Home, label: "Inicio", href: "/admin" },
  {
    icon: Building2,
    label: "Empresas",
    href: "/admin/empresas",
  },
  {
    icon: Users,
    label: "Interventores",
    href: "/admin/interventores",
  },
  {
    icon: ClipboardCheck,
    label: "reportes de hallazgos",
    href: "/admin/reportes",
  },
];

interface SidebarProps {
  openSidebar: boolean;
  isAdmin: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = ({
  isAdmin,
  openSidebar,
  setOpenSidebar,
}: SidebarProps) => {
  return (
    <>
      <div className="fixed left-0 top-[48px]">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="p-0 w-56">
            <SidebarContent routes={isAdmin ? adminRoutes : dashRoutes} />
          </SheetContent>
        </Sheet>

        <div className="w-48 h-full min-h-screen hidden md:flex fixed left-0 top-[48px] z-40">
          <SidebarContent routes={isAdmin ? adminRoutes : dashRoutes} />
        </div>
      </div>
    </>
  );
};