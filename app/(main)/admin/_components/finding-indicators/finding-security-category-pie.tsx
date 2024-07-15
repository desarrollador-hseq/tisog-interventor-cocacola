import { Chart } from "@/components/chart";
import {
  FindingReport,
  SecurityCategory,
  SecurityQuestion,
} from "@prisma/client";
import React from "react";

interface FindingIndicatorsProps {
  findingReports: any[];
}

export const FindingBySecurityCategory = ({
  findingReports,
}: FindingIndicatorsProps) => {
  // Función para contar hallazgos por categoría de SecurityQuestion
  const countFindingsByCategory = () => {
    return findingReports?.reduce((acc, finding) => {
      const category =
        finding.securityQuestion?.category?.name || "Desconocido";
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const findingCountsByCategory = countFindingsByCategory() || {};

  // Excluir la categoría "Desconocido" si no se desea mostrar
  delete findingCountsByCategory["Desconocido"];

  // Preparar datos para el gráfico
  const categories = Object.keys(findingCountsByCategory);
  const counts = categories.map(
    (category) => findingCountsByCategory[category]
  );

  // Definir un conjunto fijo de colores
  const colorPalette = [
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
        const category = params[0].name;
        const count = params[0].value;
        return `${category}: ${count}`;
      },
    },
    legend: {
      data: ["Hallazgos"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: categories,
      axisLabel: {
        rotate: 45,
        fontWeight: "bold",
      },
    },
    yAxis: {
      type: "value",
    },
    title: {
      show: categories.length === 0,
      textStyle: {
        color: "gray",
        fontSize: 20,
      },
      text: "Sin datos",
      left: "center",
      top: "center",
    },
    series: [
      {
        name: "Hallazgos",
        type: "bar",
        label: {
          show: true,
          position: "inside",
        },
        data: categories.map((category, index) => ({
          value: findingCountsByCategory[category],
          name: category,
          itemStyle: {
            color: colorPalette[index % colorPalette.length], // Asignar color secuencialmente
          },
        })),
      },
    ],
  };

  return <Chart title={"Hallazgos por peligros y/o riesgos"} option={option} />;
};
