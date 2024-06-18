"use client";

import { Chart } from "@/components/chart";
import { FindingReport } from "@prisma/client";

interface FindingResumePieProps {
  findingReports: FindingReport[];
  title: string
}

export const FindingResumePie = ({ findingReports, title }: FindingResumePieProps) => {
  const countExecutedInspections = () => {
    return findingReports.reduce((count, inspection) => {
      if (inspection.status === "OPEN") {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const openCount = countExecutedInspections();
  const totalCount = findingReports.length;
  const closedCount = totalCount - openCount;

  const chartData = [
    { value: openCount, name: "Abiertas" },
    { value: closedCount, name: "Cerradas" },
  ];

  const option = {
    tooltip: {
      trigger: "item",
      formatter: "{b}: {d}%",
    },
    legend: {
      show: false,
      top: "0%",
      left: "center",
    },
    series: [
      {
        name: "",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: true,
          fontWeight: "bold",
          formatter(param: any) {
            return param.name + ": " + param.value + "";
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
        data: findingReports.length !== 0 ? chartData : [],
        color: ["#4e71b1", "#bae0fc"],
      },
    ],
    title: {
      show: openCount === 0 && closedCount === 0,
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
