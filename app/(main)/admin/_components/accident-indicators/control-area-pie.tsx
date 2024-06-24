"use client";

import { Chart } from "@/components/chart";
import { BusinessAreas, Contractor, ControlReport } from "@prisma/client";

interface ControlWithContractorAndArea extends ControlReport {
  contractor: Contractor | null;
  businessArea: BusinessAreas | null;
}

interface ControlAreaPieProps {
  controlReports: ControlWithContractorAndArea[] | null | undefined;
  title: string;
  areas: BusinessAreas[];
}

export const ControlAreaPie = ({
  controlReports,
  title,
  areas,
}: ControlAreaPieProps) => {
  // Función para contar los controles por ID de área
  const countControlsByAreaId = () => {
    return controlReports?.reduce((acc, control) => {
      const areaId = control.businessAreaId || "Desconocido";
      if (!acc[areaId]) {
        acc[areaId] = 0;
      }
      acc[areaId]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const controlCountsByAreaId = countControlsByAreaId() || {};

  // Calcular el total de controles para el cálculo de porcentajes
  const totalControls = controlReports?.length || 0;

  // Mapear los IDs de área a nombres de área y calcular el porcentaje
  const chartData = Object.entries(controlCountsByAreaId).map(
    ([areaId, count]) => {
      const area = areas.find((a) => a.id === areaId);
      const percentage = ((count / totalControls) * 100).toFixed(2); // Calcular porcentaje
      return {
        value: count,
        name: area ? `${area.name} ` : `Desconocido`, // Añadir porcentaje al nombre
      };
    }
  );

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)", // Mostrar valor y porcentaje en el tooltip
    },
    legend: {
      show: true,
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "Controles por Área",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          fontWeight: "bold",
          formatter(param: any) {
            const percentage = ((param.value / totalControls) * 100).toFixed(2);
            return `${param.name}: ${param.value} (${percentage}%)`; // Mostrar cantidad y porcentaje
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: chartData,
        color: [
          "#4e71b1",
          "#bae0fc",
          "#82c9ff",
          "#9ed0ff",
          "#b2d8ff",
          "#c6e0ff",
        ], // Puedes añadir más colores si tienes más áreas
      },
    ],
    title: {
      show: chartData.length === 0,
      textStyle: {
        color: "gray",
        fontSize: 20,
      },
      text: "Sin datos",
      left: "center",
      top: "center",
    },
  };

  return <Chart option={option} title={title} />;
};
