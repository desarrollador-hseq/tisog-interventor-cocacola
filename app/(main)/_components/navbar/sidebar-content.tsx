import {
  Building,
  FileSliders,
  Hammer,
  ListTodo,
  LucideIcon,
  MapPinned,
  User,
  Users2,
} from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { LogoMain } from "@/components/logo-main";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface SidebarContentProps {
  routes: { href: string; icon: LucideIcon; label: string; master?: boolean }[];
  isMaster: boolean;
  isAdmin: boolean;
}

export const SidebarContent = ({
  routes,
  isAdmin,
  isMaster,
}: SidebarContentProps) => (
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
      {!!isAdmin && !!isMaster && (
        <Accordion type="single" collapsible className="w-full ">
          <AccordionItem value="item-1" className="border-none ">
            <AccordionTrigger>
              <div
                className={cn(
                  "w-full h-full flex items-center gap-x-2 text-slate-300 text-base pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 "
                )}
              >
                <div className="flex items-center gap-x-2">
                  <FileSliders size={22} className={cn("text-slate-200")} />
                  <span className={cn("text-slate-200 leading-4 text-left")}>
                    Configuración
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-primary/70 p-0 pl-4">
              <SidebarItems
                href={`/admin/analistas`}
                label={`Analistas`}
                icon={Users2}
              />
              <SidebarItems
                href={`/admin/contratistas`}
                label={`Contratistas`}
                icon={Building}
              />
              <SidebarItems
                href={`/admin/aspectos`}
                label={`Aspectos`}
                icon={ListTodo}
              />
              <SidebarItems
                href={`/admin/herramientas`}
                label={`Herramientas`}
                icon={Hammer}
              />
              <SidebarItems
                href={`/admin/areas`}
                label={`Áreas`}
                icon={MapPinned}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>

    <div className="w-full flex justify-center bg-blue-900">
      <span className="font-extrabold  text-white p-2 text-base">
        {isAdmin ? "Administrador" : "Interventor / Analista"}
      </span>
    </div>
  </div>
);
