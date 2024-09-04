"use client";

import { Chart } from "@/components/chart";
import {
  Accidents,
  BusinessAreas,
  Contractor,
  ControlReport,
  FindingReport,
} from "@prisma/client";

interface FindingWithArea extends FindingReport {
  contractor: Contractor | null;
  controlReport: ControlReport | null;
  area: BusinessAreas | null;
}

interface ControlAreaPieProps {
  accidents: Accidents[] | null | undefined;
  title: string;
  areas: BusinessAreas[];
}

export const AccidentAreaBar = ({ accidents, title, areas }: ControlAreaPieProps) => {
  // Función para contar los accidentes por ID de área
  const countAccidentsByAreaId = () => {
    return accidents?.reduce((acc, accident) => {
      const areaId = accident.areaId || "Desconocido";
      if (!acc[areaId]) {
        acc[areaId] = 0;
      }
      acc[areaId]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const accidentCountsByAreaId = countAccidentsByAreaId() || {};

  // Calcular el total de accidentes para el cálculo de porcentajes
  const totalAccidents = accidents?.length || 0;

  // Mapear los IDs de área a nombres de área y calcular el porcentaje
  const chartData = Object.entries(accidentCountsByAreaId).map(
    ([areaId, count]) => {
      const area = areas.find((a) => a.id === areaId);
      const percentage = ((count / totalAccidents) * 100).toFixed(); // Calcular porcentaje
      return {
        value: count,
        name: area ? `${area.name}` : `Desconocido`, // Añadir porcentaje al nombre
      };
    }
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const { name, value } = params[0];
        const percentage = ((value / totalAccidents) * 100).toFixed(2);
        return `${name}: ${value} (${percentage}%)`;
      },
    },
    legend: {
      show: false,
      top: "0%",
      left: "center",
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.name),
      axisLabel: {
        rotate: 45,
        fontWeight: 'bold'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: "Accidentes por Área",
        type: "bar",
        data: chartData.map(item => item.value),
        label: {
          show: true,
          position: 'inside',
          fontWeight: "bold",
          formatter(param: any) {
            const percentage = ((param.value / totalAccidents) * 100).toFixed(2);
            return `${param.value} (${percentage}%)`; // Mostrar cantidad y porcentaje
          },
        },
        emphasis: {
          focus: 'series'
        },
        itemStyle: {
          color: (params: any) => {
            const colors = [
              "#4e71b1",
              "#bae0fc",
              "#82c9ff",
              "#9ed0ff",
              "#b2d8ff",
              "#c6e0ff"
            ];
            return colors[params.dataIndex % colors.length];
          }
        }
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