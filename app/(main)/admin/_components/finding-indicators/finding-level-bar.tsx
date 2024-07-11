"use client";

import { Chart } from "@/components/chart";
import { ControlReport, FindingReport } from "@prisma/client";

interface ControlWithAreaAndContractor extends FindingReport {
  controlReport:
    | (ControlReport & {
        businessArea: { name: string | null };
        contractor: { name: string | null };
        controller: { name: string | null };
      })
    | null;
}

interface FindingIndicatorsProps {
  findingReports: ControlWithAreaAndContractor[];
}


export const FindingLevelBar = ({ findingReports }: FindingIndicatorsProps) => {
  // Función para contar hallazgos por nivel
  const countFindingsByLevel = () => {
    return findingReports?.reduce((acc, finding) => {
      const level = finding.findingLevel || "Desconocido";
      if (!acc[level]) {
        acc[level] = 0;
      }
      acc[level]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const findingCountsByLevel = countFindingsByLevel() || {};


  delete findingCountsByLevel["Desconocido"];

  const levelTranslations: Record<string, string> = {
    LOW: "Bajo",
    MEDIUM: "Medio",
    HIGH: "Alto",
  };

 
  const levels = Object.keys(findingCountsByLevel);
  
  const counts = levels.map(level => findingCountsByLevel[level]);

  const colors: Record<string, string> = {
    Bajo: "#67747e",    // gris
    Medio: "#FFD700",   // amarillo
    Alto: "#FF0000",    // rojo
  };

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      formatter: function (params: any) {
        const level = params[0].name;
        const count = params[0].value;
        return `${level}: ${count}`;
      },
    },
    legend: {
      data: ["Bajo", "Medio", "Alto"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: levels.map(level => levelTranslations[level] || level),
      axisLabel: {
        rotate: 45,
        fontWeight: "bold",
      },
    },
    yAxis: {
      type: "value",
    },
    title: {
      show: levels.length === 0,
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
          formatter: (params: any) => {
            const level = levelTranslations[params.name] || params.name;
            return `${level}: ${params.value}`;
          },
        },
        data: levels.map(level => ({
          value: findingCountsByLevel[level],
          name: levelTranslations[level] || level,
          itemStyle: {
            color: colors[levelTranslations[level] || level],
          },
        })),
      },
    ],
  };

  return <Chart title={"Criticidad"} option={option} />;
};
