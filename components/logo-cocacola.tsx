"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const LogoCocaCola = ({
  goRoot,
  className,
  height = 40,
  width = 70,
}: {
  goRoot?: boolean;
  height?: number;
  width?: number;
  className?: string;
}) => {
  const pathname = usePathname();
  const isDashboard = useMemo(() => pathname.includes("dashboard"), [pathname]);
  const router = useRouter();

  const navigate = () => {
    if (!goRoot) return;

    router.push(
      pathname.split("/")[1].includes("admin")
        ? "/admin"
        : pathname.split("/")[1].includes("lider")
        ? "/lider"
        : "/dashboard"
    );
  };
  return (
    <div className="bg-whit rounded-sm p-0.5 px-2">
      <Image
        className={cn(goRoot && "cursor-pointer", className)}
        onClick={navigate}
        src="/Coca-Cola_logo.png"
        alt="logo de tisog"
        height={height}
        width={width}
      />
    </div>
  );
};
