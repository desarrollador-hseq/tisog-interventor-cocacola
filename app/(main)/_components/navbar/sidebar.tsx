"use client";

import React, { Dispatch, SetStateAction } from "react";
import {
  Building2,
  ClipboardCheck,
  ClipboardList,
  Home,
  ListTodo,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "./sidebar-content";

const dashRoutes = [
  { icon: Home, label: "Dashboard", href: "/analista" },
  {
    icon: ClipboardCheck,
    label: "reportes",
    href: "/analista/reportes",
  },
];
const adminRoutes = [
  { icon: Home, label: "Dashboard", href: "/admin" },
  // {
  //   icon: Building2,
  //   label: "Contratistas",
  //   href: "/admin/contratistas",
  // },
  // {
  //   icon: Users,
  //   label: "Analistas",
  //   href: "/admin/analistas",
  // },
  {
    icon: ListTodo,
    label: "Reportes",
    href: "/admin/reportes",
  },
  {
    icon: ClipboardList,
    label: "Hallazgos",
    href: "/admin/hallazgos",
  },
  {
    icon: TriangleAlert,
    label: "Accidentes",
    href: "/admin/accidentes",
  },
];

interface SidebarProps {
  openSidebar: boolean;
  isAdmin: boolean;
  isMaster: boolean;
  isViewer: boolean;
  setOpenSidebar: Dispatch<SetStateAction<boolean>>;
}

export const Sidebar = ({
  isAdmin,
  openSidebar,
  isMaster,
  isViewer,
  setOpenSidebar,
}: SidebarProps) => {
  return (
    <>
      <div className="fixed left-0 top-[48px] ">
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetContent side="left" className="p-0 w-56">
            <SidebarContent
              routes={isAdmin ? adminRoutes : isViewer ? dashRoutes : []}
              isAdmin={isAdmin}
              isMaster={isMaster}
            />
          </SheetContent>
        </Sheet>

        <div className="w-48 h-full min-h-screen hidden md:flex fixed left-0 top-[48px] z-40 border-r border-slate-300">
          <SidebarContent
            routes={isAdmin ? adminRoutes : !isViewer ? dashRoutes : []}
            isAdmin={isAdmin}
            isMaster={isMaster}
          />
        </div>
      </div>
    </>
  );
};
