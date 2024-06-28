"use client";

import { Chart } from "@/components/chart";
import { Contractor, ControlReport } from "@prisma/client";

interface controlWithContractor extends ControlReport {
  contractor: Contractor  | null
}

interface controlByContractorBarChartProps {
  controlReports: controlWithContractor[] | null | undefined;
  title: string;
}

export const ControlsContractorBar = ({
  controlReports,
  title
}: controlByContractorBarChartProps) => {
  // Agrupar controles por contratista
  const contractorData = controlReports?.reduce((acc, controlReport) => {
    const contractorName = controlReport?.contractor?.name || "Desconocido";
    if (!acc[contractorName]) {
      acc[contractorName] = 0;
    }
    acc[contractorName]++;
    return acc;
  }, {} as Record<string, number>) || {};

  // Preparar datos para el gráfico
  const contractors = Object.keys(contractorData);
  const controlCounts = contractors.map((contractor) => contractorData[contractor]);

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const totalControls = params[0].value;
        return `${params[0].axisValue}: ${totalControls} controles`;
      },
    },
    xAxis: {
      type: "category",
      data: contractors,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Controles",
        type: "bar",
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
        },
        data: controlCounts,
        itemStyle: {
          color: "#4e71b1",
        },
      },
    ],
    title: {
      show: contractors.length === 0,
      textStyle: {
        color: "gray",
        fontSize: 20,
      },
      text: "Sin datos",
      left: "center",
      top: "center",
    },
  };  

  return <Chart title={title} option={option} />;
};