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

export const ControlAreaBar = ({ controlReports, title, areas }: ControlAreaPieProps) => {
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
      return {
        value: count,
        name: area ? `${area.name}` : `Desconocido`,
        percentage: ((count / totalControls) * 100).toFixed(2), // Calcular porcentaje
      };
    }
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: 'shadow' },
      formatter: (params: any) => {
        const { name, value } = params[0];
        const percentage = ((value / totalControls) * 100).toFixed(2);
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
        name: "Controles por Área",
        type: "bar",
        data: chartData.map(item => item.value),
        label: {
          show: true,
          position: 'inside',
          fontWeight: "bold",
          formatter(param: any) {
            const percentage = ((param.value / totalControls) * 100).toFixed(2);
            return `${param.value} (${percentage}%)`;
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

