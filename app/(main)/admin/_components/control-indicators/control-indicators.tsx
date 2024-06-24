"use client";

import {
  ControlReport,
  Contractor,
  BusinessAreas,
} from "@prisma/client";
import { endOfDay } from "date-fns";
import { useLoading } from "@/components/providers/loading-provider";
import { ControlsContractorBar } from "./control-contractor-bar";
import { ControlSourcePie } from "./control-source-pie";
import { ControlAreaPie } from "./control-area-pie";

interface ControlIndicatorsProps {
  controlReports:
    | (ControlReport & {
        contractor: Contractor | null;
        businessArea: BusinessAreas | null;
      })[]
    | null;
    areas: BusinessAreas[]
}

export const ControlIndicators = ({
  controlReports,
  areas,
}: ControlIndicatorsProps) => {
  const { userRole, dateFilter, cityFilter, companyFilter } = useLoading();

  let filteredReports =
    !dateFilter || (!dateFilter.from && !dateFilter.to)
      ? controlReports
      : controlReports?.filter((report) => {
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
    <div className="border-4 border-primary shadow-lg">
      <div className="shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3  lg:grid-rows-1 mt-0 w-full min-w-full">
          <h3 className="text-center col-span-3 p-3 font-bold text-2xl backdrop-blur-sm bg-blue-900 text-slate-100">
            Controles
          </h3>
        </div>
        <div className="grid gap-1 lg:grid-cols-2 w-full min-w-full backdrop-blur-sm bg-primary/60">
          <div className="flex flex-col p-2 lg:col-span-2">
            <ControlSourcePie
              controlReports={filteredReports}
              title="Tipo de fuente"
            />
          </div>
          <div className="flex flex-col p-2 ">
            <ControlsContractorBar 
              controlReports={filteredReports}
              title="Contratistas"
            />
          </div>
          <div className="flex flex-col p-2 ">
            <ControlAreaPie 
              controlReports={filteredReports}
              areas={areas}
              title="Área del evento"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
