"use client";

import { Chart } from "@/components/chart";
import { Accidents } from "@prisma/client";

interface AccidentLevelBarProps {
  accidents: Accidents[] | null | undefined;
  title: string;
}

export const AccidentLevelBar = ({
  accidents,
  title,
}: AccidentLevelBarProps) => {
  // Función para contar los accidentes por tipo
  const countAccidentsByType = () => {
    return accidents?.reduce((acc, accident) => {
      const type = accident.level || "Desconocido";
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const accidentCountsByType = countAccidentsByType() || {};

  const totalAccidents = accidents?.length || 0;

  const typeTranslations: Record<string, string> = {
    0: "Nivel 0",
    1: "Nivel 1",
    2: "Nivel 2",
    3: "Nivel 3",
    Desconocido: "Desconocido",
  };

  const chartData = Object.entries(accidentCountsByType).map(
    ([type, count]) => {
      const translatedType = typeTranslations[type] || type;

      return {
        value: count,
        name: translatedType,
      };
    }
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        return params
          .map((param: any) => {
            const totalAccidents = param.value;
            return `${param.marker}${param.axisValue}: ${totalAccidents}`;
          })
          .join("<br/>");
      },
    },
    legend: {
      show: true,
      top: "0%",
      left: "center",
      data: chartData.map((item) => item.name),
    },
    xAxis: {
      type: "category",
      data: chartData.map((item) => item.name), // Usar la traducción como nombre
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        data: chartData.map((item) => item.value),
        color: [
          "#4e71b1",
          "#bae0fc",
          "#82c9ff",
          "#9ed0ff",
          "#b2d8ff",
          "#c6e0ff",
        ],
        label: {
          show: true,
          position: "inside",
          formatter: "{c}",
        },
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
