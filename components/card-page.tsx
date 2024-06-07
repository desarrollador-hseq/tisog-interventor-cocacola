import React, { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";

interface CardPageProps {
  pageHeader?: string | ReactNode;
  className?: string;
  children: ReactNode;
  pageFooter?: string | ReactNode;
}

export const CardPage = ({
  pageHeader,
  children,
  pageFooter,
  className,
}: CardPageProps) => {
  return (
    <Card
      className={cn(
        "w-full h-full rounded-sm min-h-[calc(100vh-62px)] overflow-hidden min-w-full max-w-max opacity-85 mb-2 bg-white",
        className
      )}
    >
      <CardHeader className="pt-0 m-0 px-0 ">{pageHeader}</CardHeader>
      <CardContent className="">{children}</CardContent>
      <CardFooter>{pageFooter}</CardFooter>
    </Card>
  );
};
