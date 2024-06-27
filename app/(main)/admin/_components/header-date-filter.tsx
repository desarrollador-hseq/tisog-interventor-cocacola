"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/components/date-filter";
import { useLoading } from "@/components/providers/loading-provider";
import { SelectCompanyFilter } from "./select-company-filter";
import { Contractor } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { LogoMain } from "@/components/logo-main";
// import { SelectLevelFilter } from "./select-level-filter";

export const HeaderDateFilter = ({
  companies,
}: {
  companies: Contractor[];
}) => {
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(false);

  const { cityFilter, dateFilter, companyFilter } = useLoading();

  const handleScroll = () => {
    setPrevScrollPos(window.scrollY);
    setVisible(prevScrollPos > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);
  return (
    <div
      className={cn(
        "top-0 h-fit w-full p-1 bg-primary flex flex-col md:flex-row  items-center justify-between gap-2 bg-blue-900",
        visible &&
          "fixed py-1 px-3 top-0 left-0 right-0 z-50 h-fit rounded-b-lg shadow-md gap-1 fadeIn border-b border-blue-500 min-w-full max-w-[100vw] mx-auto w-full"
      )}
    >
      <div
        className={cn(
          " gap-1 relative items-center hidden",
          visible && "md:flex"
        )}
      >
        <LogoMain goRoot width={65} />

        <span className="font-semibold text-lg text-white">
          Interventoría HSE
        </span>
      </div>
      <h2 className=" text-3xl font-bold text-white self-center  text-center">
        Panel
      </h2>

      <div className="flex gap-0 items-center flex-col md:flex-row">
        <span className="text-white text-sm text-right mx-2 leading-3">
          {!!dateFilter || !!cityFilter || !!companyFilter ? (
            "Filtrando por:"
          ) : (
            <span></span>
          )}
        </span>
        <div className="flex gap-2">
          <SelectCompanyFilter companies={companies} />
          <DateFilter />
        </div>
      </div>
    </div>
  );
};
