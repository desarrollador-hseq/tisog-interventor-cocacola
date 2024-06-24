"use client";

import { Chart } from "@/components/chart";
import { BusinessAreas, Contractor, ControlReport } from "@prisma/client";

interface ControlWithContractorAndArea extends ControlReport {
  contractor: Contractor | null;
  businessArea: BusinessAreas | null;
}

interface ControlSourcePieProps {
  controlReports: ControlWithContractorAndArea[] | null | undefined;
  title: string;
}

export const ControlSourcePie = ({
  controlReports,
  title,
}: ControlSourcePieProps) => {
  // Función para contar los controles por fuente
  const countControlsBySource = () => {
    return controlReports?.reduce((acc, control) => {
      const source = control.source || "Desconocido";
      if (!acc[source]) {
        acc[source] = 0;
      }
      acc[source]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const controlCountsBySource = countControlsBySource() || {};

  // Calcular el total de controles para el cálculo de porcentajes
  const totalControls = controlReports?.length || 0;

  // Preparar los datos para el gráfico, incluyendo los porcentajes
  const chartData = Object.entries(controlCountsBySource).map(
    ([source, count]) => {
      const percentage = ((count / totalControls) * 100).toFixed(2); // Calcular porcentaje
      return {
        value: count,
        name: source,
        percentage, // Guardar el porcentaje para usar en el formatter
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
        name: "Controles por Fuente",
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
        ], // Puedes añadir más colores si tienes más fuentes
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
