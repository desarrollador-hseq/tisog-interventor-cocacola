"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Printer } from "lucide-react";
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

export const DashboardContent = ({
  findingReports,
  controlReport,
  accidents,
  areas,
}: {
  findingReports: any;
  controlReport: any;
  accidents: any;
  areas: BusinessAreas[];
}) => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { companyFilter, dateFilter } = useLoading();
  const [contractor, setContractor] = useState<Contractor | null>(null);

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
  return (
    <div id="printableArea" className="w-full">
      <div className="p-4 flex flex-col items-center justify-center bg-primary">
        <h2 className="text-2xl text-center font-bold text-white">
          Indicadores de resultados
        </h2>
      </div>
      <div
        id="filter-app"
        className=" flex-col text-sm border w-full bg-blue-500 text-white py-1 px-3"
      >
        <span className="text-base font-semibold">Filtrando por:</span>
        {companyFilter && contractor && (
          <div className="flex gap-2">
            <span>Contratista: </span>
            <span>{contractor?.name}</span>
          </div>
        )}
        {dateFilter?.from && dateFilter?.to && (
          <div className="flex gap-2 text-sm">
            <span>Fecha: </span>
            <span>desde {formatDate(dateFilter?.from)}</span>
            <span>hasta {formatDate(dateFilter?.to)}</span>
          </div>
        )}
      </div>
      <FindingIndicators findingReports={findingReports} />
      <ControlIndicators controlReports={controlReport} areas={areas} />
      <AccidentIndicators accidents={accidents} />

      <Button
        onClick={handlePrint}
        variant="secondary"
        className="non-print fixed w-[120px] mx-auto bottom-1 left-0 right-0 rounded-full p-1 px-2.5"
      >
        <Printer className="w-5 h-5" />
      </Button>
    </div>
  );
};
