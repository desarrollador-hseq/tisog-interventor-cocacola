import { LucideIcon } from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { LogoMain } from "@/components/logo-main";

interface SidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
  isAdmin: boolean;
}

export const SidebarContent = ({ routes, isAdmin }: SidebarContentProps) => (
  <div className="h-full w-full  flex flex-col overflow-y-auto backdrop-blur-sm bg-primary lg:bg-primary/60 shadow-lg">
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-140px)] mt-1">
      <div className="md:hidden flex justify-center items-center h-14">
        <LogoMain />
      </div>
      {routes.map((route) => (
        <SidebarItems
          key={route.href}
          href={route.href}
          icon={route.icon}
          label={route.label}
        />
      ))}
    </div>
    <div className="w-full flex justify-center bg-white">
      <span className="font-extrabold  text-slate-600 p-2 text-base">
        {isAdmin ? "Administrador" : "Interventor / Analista"}
      </span>
    </div>
  </div>
);
