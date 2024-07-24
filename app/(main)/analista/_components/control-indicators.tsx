"use client";

import Link from "next/link";
import { BusinessAreas, Contractor, ControlReport } from "@prisma/client";
import { ControlSourcePie } from "../../admin/_components/control-indicators/control-source-pie";
import { ControlAreaBar } from "../../admin/_components/control-indicators/control-area-bar";
import { KpiCard } from "@/components/kpi-card";
import { SlidersVertical } from "lucide-react";
import { controlReportColumns } from "../reportes/_components/control-report-columns";
import { ControlTable } from "../reportes/_components/control-table";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface ControlWithContractorAndArea extends ControlReport {
  contractor: Contractor | null;
  businessArea: BusinessAreas | null;
  findingReport: { id: string | null }[] | null;
}

interface ControlIndicatorsProps {
  controlReports: ControlWithContractorAndArea[];
  areas: BusinessAreas[];
}

export const ControlIndicators = ({
  controlReports,
  areas,
}: ControlIndicatorsProps) => {
  return (
    <div className="border-4 border-primary shadow-lg w-full page-break min-h-screen">
      <div className="shadow-lg min-h-screen backdrop-blur-sm bg-primary/60">
        <div className="flex gap-3 w-full justify-center items-center flex-wrap p-5">
          <KpiCard name="Controles" number={controlReports.length} icon={SlidersVertical} />
          <Link
            href={"/analista/reportes/crear"}
            className={cn(buttonVariants())}
          >
            Registrar reporte
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3  lg:grid-rows-1 mt-0 w-full min-w-full">
          <h3 className="text-center col-span-3 p-3 font-bold text-2xl backdrop-blur-sm bg-blue-900 text-slate-100">
            Resumen de mis reportes
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-1  w-full min-w-full ">
          {/* <div className="flex flex-col p-2 ">
            <ControlSourcePie
              controlReports={controlReports}
              title={"Fuente"}
            />
          </div> */}
          <div className="flex flex-col p-2 ">
            <ControlAreaBar
              areas={areas}
              controlReports={controlReports}
              title="por áreas"
            />
          </div>
          <div className="col-span-2 px-2">
            <ControlTable
              columns={controlReportColumns}
              data={controlReports}
              editHref={{ btnText: "", href: "/analista/reportes" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
