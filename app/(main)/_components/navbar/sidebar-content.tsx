import { LucideIcon } from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { LogoMain } from "@/components/logo-main";
import { LogoGHseq } from "@/components/logo-ghseq";

interface SidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string }[];
  isAdmin: boolean
}

export const SidebarContent = ({ routes, isAdmin }: SidebarContentProps) => (
  <div className="h-full w-full  flex flex-col overflow-y-auto bg-primary">
    <div className="flex flex-col w-full h-full max-h-[calc(100vh-60px)] md:max-h-[calc(100vh-140px)] mt-1">
      <div className="md:hidden flex justify-start items-center pl-7 h-14">
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
    <div className="w-full flex justify-center">
      {/* <LogoGHseq /> */}
      {isAdmin && <span className="font-extrabold text-lg text-slate-300">Administrador</span>}
    </div>
  </div>
);
