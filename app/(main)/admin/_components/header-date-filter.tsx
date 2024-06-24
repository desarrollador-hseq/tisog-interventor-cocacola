"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/components/date-filter";
import { useLoading } from "@/components/providers/loading-provider";
import { SelectCompanyFilter } from "./select-company-filter";
import { Contractor } from "@prisma/client";
// import { SelectLevelFilter } from "./select-level-filter";

export const HeaderDateFilter = ({ companies }: { companies: Contractor[] }) => {
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
        "w-full top-0 h-[65px] p-5 bg-primary flex flex-col md:flex-row  items-center justify-between gap-2 bg-blue-900",
        visible &&
          "fixed py-1 px-5 top-0 left-0 right-0 z-50 h-fit  mx-auto rounded-b-lg gap-1 "
      )}

    >
      <h2 className=" text-3xl font-bold text-white self-center  text-center">
        Panel
      </h2>

      <div className="flex gap-2 items-center flex-col md:flex-row">
        <span className="text-white text-sm text-right mx-2 leading-3">
          {!!dateFilter || !!cityFilter || !!companyFilter ? (
            "Filtrando por:"
          ) : (
            <span></span>
          )}
        </span>
        <SelectCompanyFilter companies={companies} />
        {/* <SelectLevelFilter /> */}
        <DateFilter />
      </div>
    </div>
  );
};
