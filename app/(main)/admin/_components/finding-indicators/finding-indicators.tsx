"use client";

import { FindingReport, ControlReport } from "@prisma/client";
import { endOfDay } from "date-fns";
import { useLoading } from "@/components/providers/loading-provider";
import { FindingResumePie } from "./finding-resume-pie";
import { FindingsContractorBar } from "./finding-contractor-bar";
import { TableDefault } from "@/components/table-default";
import { findingReportColumns } from "@/app/(main)/admin/hallazgos/_components/finding-report-columns";
import { findingReportDescColumns } from "../../hallazgos/_components/finding-report-desc-columns";
import { FindingReportExportExcel } from "../../hallazgos/_components/finding-report-export-excel";

interface ControlWithAreaAndContractor extends FindingReport {
  controlReport:
    | (ControlReport & {
        businessArea: { name: string | null };
        contractor: { name: string | null };
        controller: { name: string | null };
      })
    | null;
}

interface FindingIndicatorsProps {
  findingReports: ControlWithAreaAndContractor[];
}

export const FindingIndicators = ({
  findingReports,
}: FindingIndicatorsProps) => {
  const { dateFilter, companyFilter } = useLoading();

  let filteredReports =
    !dateFilter || (!dateFilter.from && !dateFilter.to)
      ? findingReports
      : findingReports?.filter((report) => {
          const startDate = report.controlReport?.date;
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

  return (
    <div className="border-4 border-primary h-fit w-full">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3  lg:grid-rows-1 mt-0 w-full min-w-full">
          <h3 className="text-center col-span-3 p-3 font-bold text-2xl backdrop-blur-sm bg-blue-900 text-slate-100">
            Hallazgos
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 mb-3 lg:grid-rows-1 w-full min-w-full backdrop-blur-sm bg-primary/60">
          <div className="flex flex-col p-2 rounded-md w-full justify-center items-center">
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
            <FindingsContractorBar findingReports={filteredReports || []} />
          </div>
        </div>
        <div className="flex flex-col p-2">
          <TableDefault
            columns={findingReportColumns}
            data={filteredReports}
            deleteHref=""
          />
          <div className="page-break"></div>
          <div className="">
            <FindingReportExportExcel
              columns={findingReportDescColumns}
              data={filteredReports}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
