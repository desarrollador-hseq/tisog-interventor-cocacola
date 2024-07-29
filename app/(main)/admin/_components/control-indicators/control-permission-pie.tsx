"use client";

import { Chart } from "@/components/chart";
import { ControlReport, FindingReport } from "@prisma/client";

interface ControlPermissionPieProps {
  controlReports: ControlReport[];
  title: string;
}

export const ControlPermissionPie = ({
  controlReports,
  title,
}: ControlPermissionPieProps) => {
  const countExecutedInspections = () => {
    return controlReports.reduce((count, inspection) => {
      if (inspection.releasePermit) {
        return count + 1;
      }
      return count;
    }, 0);
  };

  const openCount = countExecutedInspections();
  const totalCount = controlReports.length;
  const closedCount = totalCount - openCount;

  const chartData = [
    { value: openCount, name: "Sí" },
    { value: closedCount, name: "No" },
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
            const percentage = ((param.value / totalCount) * 100).toFixed();
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
        data: controlReports.length !== 0 ? chartData : [],
        color: ["#54b265", "#ff0023"],
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

  return (
    <Chart
      option={option}
      title={
        <div className="flex gap-2 w-full">
          <span className="w-1/5" />
          <span className="w-3/5">{title}</span>{" "}
          <span className="w-1/5 text-base place-content-center">Total: {controlReports.length}</span>
        </div>
      }
    />
  );
};
