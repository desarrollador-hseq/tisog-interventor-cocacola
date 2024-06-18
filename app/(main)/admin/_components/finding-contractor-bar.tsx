"use client";

import { Chart } from "@/components/chart";
import { ControlReport, FindingReport } from "@prisma/client";

interface FindingsByContractorBarChartProps {
  findingReports: FindingReport &
    {
      controlReport:
        | (ControlReport & { contractor: { name: string | null } })
        | null;
    }[];
}

export const FindingsContractorBar = ({
  findingReports,
}: FindingsByContractorBarChartProps) => {
  // Agrupar hallazgos por contratista y estado
  const contractorData = findingReports.reduce((acc, finding) => {
    const contractorId = finding.controlReport?.contractor.name;
    if (!contractorId) return acc;

    if (!acc[contractorId]) {
      acc[contractorId] = { open: 0, closed: 0 };
    }

    if (finding.status === "OPEN") {
      acc[contractorId].open += 1;
    } else if (finding.status === "CLOSED") {
      acc[contractorId].closed += 1;
    }

    return acc;
  }, {} as Record<string, { open: number; closed: number }>);

  // Preparar datos para el gráfico
  const contractors = Object.keys(contractorData);
  const openCounts = contractors.map(
    (contractor) => contractorData[contractor].open
  );
  const closedCounts = contractors.map(
    (contractor) => contractorData[contractor].closed
  );

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: ["Abiertas", "Cerradas"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: contractors,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Abiertas",
        type: "bar",
        label: {
          show: true,
          position: "inside",
        },
        data: openCounts,
        itemStyle: {
          color: "#4e71b1",
        },
      },
      {
        name: "Cerradas",
        type: "bar",
        label: {
          show: true,
          position: "inside",
        },
        data: closedCounts,
        itemStyle: {
          color: "#bae0fc",
        },
      },
    ],
  };

  return <Chart title="" option={option} />;
};
