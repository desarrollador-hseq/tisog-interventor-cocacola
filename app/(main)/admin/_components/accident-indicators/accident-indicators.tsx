"use client";

import { Accidents, BusinessAreas, Contractor } from "@prisma/client";
import { endOfDay } from "date-fns";
import { useLoading } from "@/components/providers/loading-provider";
import { AccidentTypePie } from "./accident-type-pie";
import { AccidentOriginPie } from "./accident-origin-pie";
import { AccidentsContractorBar } from "./accident-contractor-bar";
import { AccidentClassificationBar } from "./accident-classification-bar";
import { AccidentLevelBar } from "./accident-level-bar";

interface accidentWithContractorAndArea extends Accidents {
  contractor: Contractor | null;
  area: BusinessAreas | null;
}

interface AccidentIndicatorsProps {
  accidents: accidentWithContractorAndArea[] | null | undefined;
}

export const AccidentIndicators = ({ accidents }: AccidentIndicatorsProps) => {
  const { userRole, dateFilter, cityFilter, companyFilter } = useLoading();

  let filteredReports =
    !dateFilter || (!dateFilter.from && !dateFilter.to)
      ? accidents
      : accidents?.filter((report) => {
          const startDate = report.date;
          if (!startDate) return false;
          return (
            (!dateFilter.from || startDate >= dateFilter.from) &&
            (!dateFilter.to || startDate <= endOfDay(dateFilter.to))
          );
        });

  if (companyFilter) {
    filteredReports = filteredReports?.filter(
      (report) => report?.contractorId === companyFilter
    );
  }

  return (
    <div className="border-4 border-primary shadow-lg w-full">
      <div className="shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3  lg:grid-rows-1 mt-0 w-full min-w-full">
          <h3 className="text-center col-span-3 p-3 font-bold text-2xl backdrop-blur-sm bg-blue-900 text-slate-100">
            Accidentes / Incidentes
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-1 mb-3 lg:grid-cols-2 w-full min-w-full backdrop-blur-sm bg-primary/60">
          <div className="flex flex-col p-2 ">
            <AccidentTypePie
              accidents={filteredReports}
              title="Tipo de evento"
            />
          </div>
          <div className="flex flex-col p-2 ">
            <AccidentOriginPie accidents={filteredReports} title="Origen" />
          </div>
          <div className="flex flex-col p-2 ">
            <AccidentsContractorBar
              accidents={filteredReports}
              title="Contratista y tipo de evento"
            />
          </div>
          <div className="flex flex-col p-2 ">
            <AccidentClassificationBar
             accidents={filteredReports}
             title="Clasificación"
            />
          </div>
          <div className="flex flex-col p-2 ">
            <AccidentLevelBar
             accidents={filteredReports}
             title="Nivel"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
