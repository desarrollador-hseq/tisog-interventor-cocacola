"use client";

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const LogoMain = ({
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
    <Image
      className={cn(goRoot && "cursor-pointer", className)}
      onClick={navigate}
      src="/tisog-logo.svg"
      alt="logo de tisog"
      height={height}
      width={width}
    />
  );
};
