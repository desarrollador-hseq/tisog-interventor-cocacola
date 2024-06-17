"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Building2,
  ClipboardCheck,
  Home,
  Users,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";

const dashRoutes = [
  { icon: Home, label: "Inicio", href: "/analista" },
  {
    icon: ClipboardCheck,
    label: "reportes",
    href: "/analista/reportes",
  },
];
const adminRoutes = [
  { icon: Home, label: "Inicio", href: "/admin" },
  {
    icon: Building2,
    label: "Contratistas",
    href: "/admin/contratistas",
  },
  {
    icon: Users,
    label: "Analistas",
    href: "/admin/analistas",
  },
  {
    icon: Users,
    label: "Herramientas",
    href: "/admin/herramientas",
  },
  {
    icon: ClipboardCheck,
    label: "Reportes de hallazgos",
    href: "/admin/hallazgos",
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
            <SidebarContent routes={isAdmin ? adminRoutes : dashRoutes} isAdmin={isAdmin} />
          </SheetContent>
        </Sheet>

        <div className="w-48 h-full min-h-screen hidden md:flex fixed left-0 top-[48px] z-40">
          <SidebarContent routes={isAdmin ? adminRoutes : dashRoutes} isAdmin={isAdmin} />
        </div>
      </div>
    </>
  );
};
