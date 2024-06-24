"use client";

import { Chart } from "@/components/chart";
import { Accidents } from "@prisma/client";

interface AccidentClassificationBarProps {
  accidents: Accidents[] | null | undefined;
  title: string;
}

export const AccidentClassificationBar = ({
  accidents,
  title,
}: AccidentClassificationBarProps) => {
  // Función para contar los accidentes por tipo
  const countAccidentsByType = () => {
    return accidents?.reduce((acc, accident) => {
      const type = accident.classification || "Desconocido";
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {} as Record<string, number>);
  };

  const accidentCountsByType = countAccidentsByType() || {};

  // Calcular el total de accidentes para el cálculo de porcentajes
  const totalAccidents = accidents?.length || 0;

  // Mapa para traducir los tipos de accidentes/ incidentes al español
  const typeTranslations: Record<string, string> = {
    FIRST_AID: "Primeros auxilios",
    MEDICAL_TREATMENT: "Tratamiento médico",
    LOST_WORKDAY: "Incidente día perdido",
    NEAR_MISS: "Casi accidente",
    Desconocido: "Desconocido",
  };

  // Preparar los datos para el gráfico y asignar colores específicos
  const chartData = Object.entries(accidentCountsByType).map(
    ([type, count]) => {
      const translatedType = typeTranslations[type] || type; // Obtener la traducción o mantener el valor original

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
