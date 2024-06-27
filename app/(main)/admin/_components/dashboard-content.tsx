"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Building, Building2Icon, Printer, User2, Users2, X } from "lucide-react";
import {
  FindingReport,
  ControlReport,
  Accidents,
  BusinessAreas,
  Contractor,
  User,
} from "@prisma/client";
import { AccidentIndicators } from "./accident-indicators/accident-indicators";
import { ControlIndicators } from "./control-indicators/control-indicators";
import { FindingIndicators } from "./finding-indicators/finding-indicators";
import { useLoading } from "@/components/providers/loading-provider";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { KpiCard } from "@/components/kpi-card";

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
  const [dataLoaded, setDataLoaded] = useState(false);
  const { companyFilter, dateFilter } = useLoading();
  const [contractor, setContractor] = useState<Contractor | null>(null);

  const { setCompanyFilter, setDateFilter } = useLoading();

  useEffect(() => {
    if (!companyFilter) return;
    const getContractor = async () => {
      const { data } = await axios.get(`/api/contractors/${companyFilter}`);
      setContractor(data);
    };
    getContractor();
  }, [companyFilter]);

  useEffect(() => {
    // Simula la carga de datos asíncrona
    setTimeout(() => {
      setDataLoaded(true);
    }, 1000);
  }, []);

  const handlePrint = () => {
    if (dataLoaded) {
      window.print();
    } else {
      alert("Los datos aún se están cargando...");
    }
  };

  const resetFilters = () => {
    setCompanyFilter(undefined);
    setDateFilter(undefined);
  };

  return (
    <div id="printableArea" className="w-full">
      <div className="flex gap-3 w-full justify-center flex-wrap my-5">
        <KpiCard name="Contratistas" number={numContractors} icon={Building2Icon} />
        <KpiCard name="Interventores / Analistas" number={numControllers} icon={Users2} />
      </div>
      <div className="p-4 flex flex-col items-center justify-center bg-primary">
        <h2 className="text-2xl text-center font-bold text-white">
          Indicadores de resultados
        </h2>
      </div>

      {(!!dateFilter || (!!companyFilter && !!contractor)) && (
        <div
          id="filter-app"
          className="fadeIn flex-col text-sm border border-blue-300 w-full bg-blue-500 text-white py-1 px-3 relative"
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
            <div className="flex gap-2 text-sm">
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

      <FindingIndicators findingReports={findingReports} />
      <ControlIndicators controlReports={controlReport} areas={areas} />
      <AccidentIndicators accidents={accidents} />

      <Button
        onClick={handlePrint}
        className="non-print fixed w-[70px] bottom-1 right-3 shadow-sm rounded-full p-1 px-2.5 bg-blue-800 hover:bg-blue-900 text-white"
      >
        <Printer className="w-5 h-5" />
      </Button>
    </div>
  );
};
