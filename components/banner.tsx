"use client";

import { ReactNode, useState } from "react";
import { AlertTriangle, CheckCircleIcon, Info, X, XCircle } from "lucide-react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full ",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-400 text-yellow-800",
        success: "bg-emerald-700 border-emerald-800 text-white font-semibold",
        danger: "bg-red-500 border-red-700 text-white",
        info: "bg-blue-300 border-blue-400 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: string;
  children?: ReactNode;
  className?: string;
}

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  danger: XCircle,
  info: Info,
};

export const Banner = ({
  label,
  variant,
  children,
  className,
}: BannerProps) => {
  const Icon = iconMap[variant || "warning"];
  const [hide, setHide] = useState(false);

  return (
    <div className="flex w-full justify-end">
      <div
        className={cn(
          bannerVariants({ variant }),
          className,
          "flex justify-between items-center w-full relative rounded-sm",
          hide && "w-fit justify-end border-2 p-2"
        )}
      >
        <span
          className="flex justify-start gap-3 items-center w-full"
          onClick={() => setHide(false)}
        >
          <Icon className="w-5 h-5 " />
          <span className={cn("font-bold text-left", hide && "hidden")}> {label}</span>
        </span>
        <div className="flex">
          {children}
          {!hide && (
            <Button
              variant="ghost"
              className="p-0 h-fit z-20 hover:bg-inherit"
              onClick={() => setHide(!hide)}
            >
              <X className="w-4 h-4 text-current" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
