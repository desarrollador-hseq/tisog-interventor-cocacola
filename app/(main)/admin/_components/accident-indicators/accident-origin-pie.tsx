"use client";

import { Chart } from "@/components/chart";
import { Accidents } from "@prisma/client";

interface AccidentOriginPieProps {
  accidents: Accidents[] | null | undefined;
  title: string;
}

export const AccidentOriginPie = ({
  accidents,
  title,
}: AccidentOriginPieProps) => {
  // Función para contar los accidentes por tipo
  const countAccidentsByOrigin = () => {
    return accidents?.reduce((acc, accident) => {
      const origin = accident.origin || "Desconocido";
      if (!acc[origin]) {
        acc[origin] = 0;
      }
      acc[origin]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const accidentCountsByOrigin = countAccidentsByOrigin() || {};
  console.log({accidentCountsByOrigin})

  const totalAccidents = accidents?.length || 0;

  const originTranslations: Record<string, string> = {
    ACT: "Acto",
    CONDITION: "Condición",
    Desconocido: "Desconocido",
  };

  const chartData = Object.entries(accidentCountsByOrigin).map(
    ([origin, count]) => {
      const translatedOrigin = originTranslations[origin] || origin;
      let color = "";
      if (origin === "ACT") {
        color = "#cd2418";
      } else if (origin === "CONDITION") {
        color = "#f3e048";
      } else {
        color = "#4e71b1";
      }
      const percentage =
        totalAccidents > 0 ? ((count / totalAccidents) * 100).toFixed(2) : "0";
      return {
        value: count,
        name: translatedOrigin,
        percentage,
        itemStyle: {
          color: color,
        },
      };
    }
  );

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      show: true,
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "Accidentes por origen",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          fontWeight: "bold",
          formatter(param: any) {
            const percentage = ((param.value / totalAccidents) * 100).toFixed(
              2
            );
            return `${param.name}: ${param.value} (${percentage}%)`;
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
