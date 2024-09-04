"use client";

import { Chart } from "@/components/chart";
import { Contractor, ControlReport } from "@prisma/client";

interface controlWithContractor extends ControlReport {
  contractor: Contractor | null;
}

interface controlByContractorBarChartProps {
  controlReports: controlWithContractor[] | null | undefined;
  title: string;
}

export const ControlsContractorBar = ({
  controlReports,
  title,
}: controlByContractorBarChartProps) => {
  // Agrupar controles por contratista solo si el source es "checklist"
  const contractorData =
    controlReports?.reduce((acc, controlReport) => {
      if (controlReport.source !== "checklist") {
        return acc; // Saltar si el source no es "checklist"
      }

      // Verificar si existe el nombre del contratista, de lo contrario usar "Desconocido"
      const contractorName = controlReport.contractor?.name || "Desconocido";

      if (!acc[contractorName]) {
        acc[contractorName] = 0;
      }
      acc[contractorName]++;
      return acc;
    }, {} as Record<string, number>) || {};

  // Preparar datos para el gráfico
  const contractors = Object.keys(contractorData);
  const controlCounts = contractors.map(
    (contractor) => contractorData[contractor]
  );

  const colorPalette = [
    "#FFD700", // 2
    "#1E90FF", // 3
    "#32CD32", // 4
    "#FF4500", // 1
    "#8A2BE2", // 5
    "#FF69B4", // 6
    "#A52A2A", // 7
    "#5F9EA0", // 8
    "#D2691E", // 9
    "#2E8B57", // 10
    "#FF4500", // 1
    "#FFD700", // 2
    "#1E90FF", // 3
    "#32CD32", // 4
    "#8A2BE2", // 5
    "#FF69B4", // 6
    "#A52A2A", // 7
    "#5F9EA0", // 8
    "#D2691E", // 9
    "#2E8B57", // 10
  ];

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
      axisLabel: {
        rotate: 45,
        fontWeight: "bold",
        fontSize: 11,
        formatter: function (value: string) {
          const maxWidth = 17; // Define el número máximo de caracteres
          if (value.length > maxWidth) {
            return value.slice(0, maxWidth) + "..."; // Recorta y añade "..."
          }
          return value;
        },
      },
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
        data: controlCounts.map((control, index) => ({
          value: control,
          itemStyle: {
            color: colorPalette[index % colorPalette.length], // Asignar color secuencialmente
          },
        })),
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
