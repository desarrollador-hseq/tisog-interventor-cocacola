import React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";;
import { es } from "date-fns/locale";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";


const getBase64ImageFromUrl = async (imageUrl: string) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const FindingExcelEvidence = async (findingReport: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("hallazgos");

  // Definir las columnas
  worksheet.columns = [
    { header: "Evidencia del hallazgo", key: "imgUrl", width: 30 },
    { header: "Área", key: "businessArea", width: 20 },
    { header: "Contratista", key: "contractor", width: 20 },
    { header: "Descripción", key: "findingDesc", width: 50 },
    { header: "Interventor", key: "interventor", width: 20 },
    { header: "Fecha", key: "date", width: 15 },
    { header: "Fecha propuesta cierre", key: "proposedClosureDate", width: 20 },
    { header: "Fecha real de cierre", key: "actualClosureDate", width: 20 },
    { header: "Tipo de acción", key: "typeAction", width: 20 },
    { header: "Acción inmediata", key: "actionInmediate", width: 50 },
    { header: "Acción a tomar", key: "actionToTake", width: 50 },
    { header: "Criticidad", key: "findingLevel", width: 15 },
    { header: "Estado", key: "status", width: 15 },
    { header: "Evidencia del cierre", key: "closingEvidence", width: 30 },
  ];

  // Aplicar estilos a los encabezados
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { horizontal: "center" };
  });
  worksheet.getRow(1).height = 30;

  // Agregar filas y procesar imágenes
  for (const report of findingReport) {
    const row = worksheet.addRow({
      imgUrl: "",
      businessArea: report.controlReport?.businessArea?.name,
      contractor: report.controlReport?.contractor?.name,
      findingDesc: report.findingDesc,
      interventor: report.controlReport?.controller?.name || "No asignado",
      date: report.controlReport?.date
        ? format(report.controlReport?.date, "P", { locale: es })
        : "",
      proposedClosureDate: report.proposedClosureDate
        ? format(report.proposedClosureDate, "P", { locale: es })
        : "",
      actualClosureDate: report.actualClosureDate
        ? format(report.actualClosureDate, "P", { locale: es })
        : "",
      typeAction:
        report.typeAction === "CORRECTIVE"
          ? "Correctivo"
          : report.typeAction === "IMPROVEMENT"
          ? "De mejora"
          : "No especificado",
      actionInmediate: report.actionInmediate,
      actionToTake: report.actionToTake,
      findingLevel:
        report.findingLevel === "HIGH"
          ? "ALTA"
          : report.findingLevel === "MEDIUM"
          ? "MEDIA"
          : "BAJA",
      status: report.status === "OPEN" ? "Abierto" : "Cerrado",
      closingEvidence: "",
    });

    // Alinear el texto en la parte superior izquierda y ajustar el texto
    ["findingDesc", "actionInmediate", "actionToTake"].forEach((key) => {
      row.getCell(key).alignment = {
        vertical: "top",
        horizontal: "left",
        wrapText: true,
      };
    });

    // Procesar la imagen de "Evidencia del hallazgo"
    if (report.imgUrl) {
      const base64ImgUrl = (await getBase64ImageFromUrl(
        report.imgUrl
      )) as string;
      const imageId = workbook.addImage({
        base64: base64ImgUrl,
        extension: "png",
      });
      worksheet.addImage(imageId, {
        tl: { col: 0, row: row.number - 1 },
        ext: { width: 100, height: 100 },
      });
      worksheet.getRow(row.number).height = 100;
    }

    // Procesar la imagen de "Evidencia del cierre"
    if (report.closingEvidence) {
      const base64ClosingEvidence = (await getBase64ImageFromUrl(
        report.closingEvidence
      )) as string;
      const imageId = workbook.addImage({
        base64: base64ClosingEvidence,
        extension: "png",
      });
      worksheet.addImage(imageId, {
        tl: { col: 13, row: row.number - 1 },
        ext: { width: 100, height: 100 },
      });
      worksheet.getRow(row.number).height = 100;
    }
  }

  // Guardar el archivo
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `hallazgos-${format(new Date(), "dd-MM-yyyy")}.xlsx`);
};

export const ButtonFindingExcelEvidence = ({
  findingReport,
}: {
  findingReport: any[];
}) => {
  const { setLoadingApp } = useLoading();
  const handleExport = async () => {
    setLoadingApp(true);
    try {
      await FindingExcelEvidence(findingReport);
    } catch (error) {
      console.error("Error exporting to Excel: ", error);
    } finally {
      setLoadingApp(false);
    }
  };

  return <Button className="w-fit non-print" onClick={handleExport}>Exportar a Excel</Button>;
};
