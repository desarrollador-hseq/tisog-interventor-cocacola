import { Chart } from "@/components/chart";

export const ControlByCategory = ({
  controlReports,
}: {
  controlReports?: any[] | null;
}) => {
  // Función para contar controles por categoría
  const countControlsByCategory = () => {
    return controlReports?.reduce((acc, report) => {
      // Usar un conjunto para rastrear categorías únicas en cada informe
      const uniqueCategories = new Set();
      const generalAspects = report.generalAspects ;

      generalAspects.forEach((aspect: any) => {
        const category = aspect.securityQuestion?.category?.name || "Desconocido";
        uniqueCategories.add(category); // Añadir la categoría al conjunto
      });

      uniqueCategories.forEach((category: any) => {
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category]++;
      });

      return acc;
    }, {} as Record<string, number>);
  };

  const controlCountsByCategory = countControlsByCategory() || {};

  // Excluir la categoría "Desconocido" si no se desea mostrar
  delete controlCountsByCategory["Desconocido"];

  // Preparar datos para el gráfico
  const categories = Object.keys(controlCountsByCategory);
  const counts = categories.map(
    (category) => controlCountsByCategory[category]
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
      show: false
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
        name: "Controles", // Nombre de la serie
        type: "bar",
        label: {
          show: true,
          position: "inside",
        },
        data: categories.map((category, index) => ({
          value: controlCountsByCategory[category],
          name: category,
          itemStyle: {
            color: colorPalette[index % colorPalette.length], // Asignar color secuencialmente
          },
        })),
      },
    ],
  };

  return <Chart title={"Controles por Categoría"} option={option} />;
};