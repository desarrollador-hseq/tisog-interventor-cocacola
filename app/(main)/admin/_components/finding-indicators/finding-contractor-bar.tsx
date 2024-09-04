"use client";

import { Chart } from "@/components/chart";
import { Contractor, ControlReport, FindingReport } from "@prisma/client";

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
export const FindingsContractorBar = ({
  findingReports,
}: FindingIndicatorsProps) => {
  // Agrupar hallazgos por contratista y estado
  const contractorData = findingReports.reduce((acc, finding) => {
    if (finding.controlReport?.source !== "checklist") {
      return acc; // Saltar si el source no es "checklist"
    }
    const contractorId =
      finding.controlReport?.contractor?.name || "Desconocido";

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
      axisLabel: {
        rotate: 45,
        fontWeight: "bold",
        fontSize: 10,
        formatter: function (value: string) {
          const maxWidth = 17; // Define el número máximo de caracteres
          if (value.length > maxWidth) {
            return value.slice(0, maxWidth) + "..."; // Recorta y añade "..."
          }
          return value;
        },
      },
      data: contractors,
    },
    yAxis: {
      type: "value",
    },
    title: {
      show: contractors.length === 0,
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
        name: "Abiertas",
        type: "bar",
        label: {
          show: true,
          position: "inside",
        },
        data: openCounts,
        itemStyle: {
          color: "#ff0023",
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
          color: "#54b265",
        },
      },
    ],
  };

  return <Chart title="Hallazgos por contratista" option={option} />;
};
