"use client"

import { useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export const LogoGHseq = ({
  goRoot,
  className,
  height = 100,
  width = 110,
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
    window.location.assign('https://grupohseq.com/')
    
  };
  return (
    <div
      onClick={navigate}
      className={cn(
        "inline",
        goRoot &&
          "cursor-pointer"
      )}
    >
      <Image
        className={cn("inline", goRoot && "cursor-pointer", className)}
        src="/hseq.png"
        alt="logo de GrupoHSEQ"
        height={height}
        width={width}
        style={{
          width: "auto",
          height: "auto",
        }}
        priority
      />
    </div>
  );
};
