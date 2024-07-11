"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Building2Icon, Users2, X } from "lucide-react";
import { BusinessAreas, Contractor, User } from "@prisma/client";
import { AccidentIndicators } from "./accident-indicators/accident-indicators";
import { ControlIndicators } from "./control-indicators/control-indicators";
import { FindingIndicators } from "./finding-indicators/finding-indicators";
import { useLoading } from "@/components/providers/loading-provider";
import { formatDate, formatDateCert } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";
import { ButtonPrint } from "@/components/button-print";

export const DashboardContent = ({
  findingReports,
  controlReport,
  accidents,
  numControllers,
  numContractors,
  areas,
}: {
  findingReports: any;
  controlReport: any;
  numContractors: number;
  numControllers: number;
  accidents: any;
  areas: BusinessAreas[];
}) => {
  const { companyFilter, dateFilter } = useLoading();
  const [contractor, setContractor] = useState<Contractor | null>(null);

  const { setCompanyFilter, setDateFilter } = useLoading();
  const today = new Date();

  useEffect(() => {
    if (!companyFilter) return;
    const getContractor = async () => {
      const { data } = await axios.get(`/api/contractors/${companyFilter}`);
      setContractor(data);
    };
    getContractor();
  }, [companyFilter]);

  const resetFilters = () => {
    setCompanyFilter(undefined);
    setDateFilter(undefined);
  };

  return (
    <div className="w-full">
      <div className="flex gap-3 w-full justify-center flex-wrap my-5">
        <KpiCard
          name="Contratistas"
          number={numContractors}
          icon={Building2Icon}
        />
        <KpiCard
          name="Interventores / Analistas"
          number={numControllers}
          icon={Users2}
        />
      </div>
      <div id="printableArea" className="w-full ">
        <span className="print mr-10 italic font-light text-sm text-slate-400 text-right w-full hidden">
          Generado el {formatDateCert(today)}
        </span>
        <div className="p-4 flex flex-col items-center justify-center bg-primary">
          <h2 className="text-2xl text-center font-bold text-white">
            Indicadores de resultados
          </h2>
        </div>

        {(!!dateFilter || (!!companyFilter && !!contractor)) && (
          <div
            id="filter-app"
            className="fadeIn flex-col text-xs border border-blue-300 w-full bg-blue-500 text-white py-1 px-3 relative"
          >
            <span className="text-base font-semibold">Filtrando por:</span>
            {companyFilter && contractor && (
              <>
                <div className="flex gap-2">
                  <span>Contratista: </span>
                  <span>{contractor?.name}</span>
                </div>
              </>
            )}

            {dateFilter?.from && dateFilter?.to && (
              <div className="flex gap-2 text-xs">
                <span>Fecha: </span>
                <span>desde {formatDate(dateFilter?.from)}</span>
                <span>hasta {formatDate(dateFilter?.to)}</span>
              </div>
            )}

            <div className="absolute top-3 right-3 non-print">
              <Button onClick={resetFilters} className="p-1 h-fit">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <ControlIndicators controlReports={controlReport} areas={areas} />
        <FindingIndicators findingReports={findingReports} />
        <AccidentIndicators accidents={accidents} areas={areas} />

        <ButtonPrint />
      </div>
    </div>
  );
};
