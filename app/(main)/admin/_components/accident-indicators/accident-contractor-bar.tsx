"use client";

import { Chart } from "@/components/chart";
import { Contractor, Accidents } from "@prisma/client";

interface accidentWithContractor extends Accidents {
  contractor: Contractor  | null
}

interface accidentByContractorBarProps {
  accidents: accidentWithContractor[] | null | undefined;
  title: string;
}

export const AccidentsContractorBar = ({
  accidents,
  title,
}: accidentByContractorBarProps) => {
  // Función para contar los accidentes por tipo y contratista
  const countAccidentsByContractor = () => {
    return accidents?.reduce((acc, accident) => {
      const contractorName = accident?.contractor?.name || 'Desconocido';
      if (!acc[contractorName]) {
        acc[contractorName] = {
          accidents: 0,
          incidents: 0,
        };
      }
      if (accident.type === 'ACCIDENT') {
        acc[contractorName].accidents++;
      } else if (accident.type === 'INCIDENT') {
        acc[contractorName].incidents++;
      }
      return acc;
    }, {} as Record<string, { accidents: number; incidents: number }>);
  };

  const contractorData = countAccidentsByContractor() || {};

  const contractors = Object.keys(contractorData);
  const accidentCounts = contractors.map((contractor) => contractorData[contractor].accidents);
  const incidentCounts = contractors.map((contractor) => contractorData[contractor].incidents);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      
    },
    legend: {
      data: ['Accidentes', 'Incidentes'],
      show: true,
      top: '0%',
      left: 'center',
    },
    xAxis: {
      type: 'category',
      data: contractors,
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Accidentes',
        type: 'bar',
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
        },
        data: accidentCounts,
        itemStyle: {
          color: '#cd2418',
        },
      },
      {
        name: 'Incidentes',
        type: 'bar',
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
        },
        data: incidentCounts,
        itemStyle: {
          color: '#fff64f',
        },
      },
    ],
  };

  return <Chart title={title} option={option} />;
};
