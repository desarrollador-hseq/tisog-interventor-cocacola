"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export const SidebarItems = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = useMemo(
    () =>
      pathname === href ||
      (href !== "/analista" &&
        pathname?.startsWith(`${href}`) &&
        href !== "/admin" &&
        pathname?.startsWith(`${href}`)),
    [pathname, href]
  );

  const onClick = () => {
    router.push(href);
  };


  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full max-h-[64px] h-full">
        <button
          onClick={onClick}
          type="button"
          className={cn(
            "w-full h-full flex items-center gap-x-2 text-slate-300 text-base pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 ",
            isActive &&
              "text-blue-950 bg-sky-200/20 hover:bg-sky-200/20 hover:text-blue-950"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <Icon
              size={22}
              className={cn("text-slate-200", isActive && "text-white w-6 h-6")}
            />

            <span
              className={cn(
                "text-slate-200 leading-4 text-left",
                isActive && "text-white font-[700]"
              )}
            >
              {label}
            </span>
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 border-2 border-slate-300 h-full min-h-full transition-all animate-in",
              isActive && "opacity-100"
            )}
          />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-full h-full">
        <ContextMenuItem className="bg-slate-100 hover:bg-slate-200">
          <a target="_blank" href={href} rel="noopener noreferrer">
            Abrir en otra pestaña
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
