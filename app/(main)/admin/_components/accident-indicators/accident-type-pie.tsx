"use client";

import { Chart } from "@/components/chart";
import { Accidents } from "@prisma/client";



interface AccidentTypePieProps {
  accidents: Accidents[] | null | undefined;
  title: string;
}

export const AccidentTypePie = ({ accidents, title }: AccidentTypePieProps) => {
  // Función para contar los accidentes por tipo
  const countAccidentsByType = () => {
    return accidents?.reduce((acc, accident) => {
      const type = accident.type || 'Desconocido';
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
    ACCIDENT: 'Accidentes',
    INCIDENT: 'Incidentes',
    Desconocido: 'Desconocido', // Asegúrate de incluir una traducción para 'Desconocido' si es necesario
  };

  // Preparar los datos para el gráfico y asignar colores específicos
  const chartData = Object.entries(accidentCountsByType).map(([type, count]) => {
    const translatedType = typeTranslations[type] || type; // Obtener la traducción o mantener el valor original
    let color = '';
    if (type === 'ACCIDENT') {
      color = '#cd2418'; // Rojo para Accidente
    } else if (type === 'INCIDENT') {
      color = '#f3e048'; // Amarillo para Incidente
    } else {
      color = '#4e71b1'; 
    }
    const percentage = totalAccidents > 0 ? ((count / totalAccidents) * 100).toFixed(2) : '0';
    return {
      value: count,
      name: translatedType,
      percentage, 
      itemStyle: {
        color: color, 
      },
    };
  });

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)', // Mostrar valor y porcentaje en el tooltip
    },
    legend: {
      show: true,
      top: '0%',
      left: 'center',
    },
    series: [
      {
        name: 'Accidentes por tipo',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          fontWeight: 'bold',
          formatter(param: any) {
            const percentage = ((param.value / totalAccidents) * 100).toFixed(2);
            return `${param.name}: ${param.value} (${percentage}%)`; 
          },
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
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
        color: 'gray',
        fontSize: 20,
      },
      text: 'Sin datos',
      left: 'center',
      top: 'center',
    },
  };

  return <Chart option={option} title={title} />;
};