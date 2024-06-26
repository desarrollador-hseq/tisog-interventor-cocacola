"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Button } from "@/components/ui/button";
import { LogoMain } from "@/components/logo-main";
import { cn } from "@/lib/utils";
import { DropdownUser } from "./dropdown-user";

export const Navbar = ({
  name,
  isAdmin,
}: {
  isAdmin: boolean;
  name?: string;
}) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div
      className={cn(
        `fixed top-0 z-50 p-1 border-secondary min-h-[48px] max-h-[48px] text-white w-full bg-primary shadow-sm flex items-center`
      )}
    >
      <div className="mx-auto w-full mt-1">
        <div className="mx-3 flex items-center justify-between">
          <div className="p-2 flex gap-1 relative items-center">
            <Button
              className="md:hidden"
              variant="ghost"
              onClick={(e) => setOpenSidebar(!openSidebar)}
            >
              <Menu />
            </Button>
            <Sidebar
              isAdmin={isAdmin}
              openSidebar={openSidebar}
              setOpenSidebar={setOpenSidebar}
            />

            <LogoMain goRoot width={65} />

            <span className="font-semibold text-lg">Interventoría HSE</span>
          </div>

          <div className="flex gap-5 items-center">
            <DropdownUser name={name} isAdmin={isAdmin} />
          </div>
        </div>
      </div>
    </div>
  );
};
