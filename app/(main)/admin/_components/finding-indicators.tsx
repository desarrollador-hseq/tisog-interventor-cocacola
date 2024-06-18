"use client";

import { FindingReport, ControlReport } from "@prisma/client";
import { endOfDay } from "date-fns";
import { useLoading } from "@/components/providers/loading-provider";
import { FindingResumePie } from "./finding-resume-pie";
import { FindingsContractorBar } from "./finding-contractor-bar";

interface FindingIndicatorsProps {
  findingReports:
    | (FindingReport & { controlReport: ControlReport | null })[]
    | null;
}

export const FindingIndicators = ({
  findingReports,
}: FindingIndicatorsProps) => {
  const { userRole, dateFilter, cityFilter, companyFilter } = useLoading();

  let filteredReports =
    !dateFilter || (!dateFilter.from && !dateFilter.to)
      ? findingReports
      : findingReports?.filter((report) => {
          const startDate = report.createdAt;
          if (!startDate) return false;
          return (
            (!dateFilter.from || startDate >= dateFilter.from) &&
            (!dateFilter.to || startDate <= endOfDay(dateFilter.to))
          );
        });

  if (companyFilter) {
    filteredReports = filteredReports?.filter(
      (report) => report?.controlReport?.contractorId === companyFilter
    );
  }

  const totalReports = filteredReports?.length || 0;
  const totalOpenReports =
    filteredReports?.filter((report) => report.status === "OPEN").length || 0;
  const totalClosedReports =
    filteredReports?.filter((report) => report.status === "CLOSED").length || 0;

  // const criticalReports =
  //   filteredReports?.filter((report) => report.isCritical) || [];
  // const criticalTotal = criticalReports.length;
  // const criticalOpenReports =
  //   criticalReports.filter((report) => report.status === "OPEN").length || 0;
  // const criticalClosedReports =
  //   criticalReports.filter((report) => report.status === "CLOSED").length || 0;

  return (
    <div className="border-4 border-primary mx-1">
      <div className="p-4 flex flex-col items-center justify-center bg-primary">
        <h2 className="text-2xl text-center font-bold text-white">
          Indicadores de resultados
        </h2>
      </div>

      <div className="p-2">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3  lg:grid-rows-1 mt-0 w-full min-w-full">
          <h3 className="text-center col-span-3 p-3 font-bold text-2xl backdrop-blur-sm bg-primary/60 text-slate-100">
            Hallazgos
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-3 lg:grid-rows-1 w-full min-w-full backdrop-blur-sm bg-primary/60">
          <div className="flex flex-col p-2">
            <FindingResumePie
              title="Por estados"
              findingReports={filteredReports || []}
            />
          </div>
          <div className="flex flex-col p-2">
            <FindingResumePie
              title="Críticos por estados"
              findingReports={
                filteredReports?.filter((f) => f.findingLevel === "HIGH") || []
              }
            />
          </div>
          <div className="flex flex-col p-2">
            <FindingsContractorBar
              // title="Críticos por estados"
              findingReports={filteredReports || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
