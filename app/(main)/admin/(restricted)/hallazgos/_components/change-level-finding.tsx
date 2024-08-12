"use client";

import { useLoading } from "@/components/providers/loading-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { ControlReport, FindingReport } from "@prisma/client";
import axios from "axios";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ChangeLevelFinding = ({
  id,
  level,
  disabled,
  findingReport,
}: {
  id: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  disabled?: boolean;
  findingReport: FindingReport & {
    controlReport:
      | (ControlReport & {
          contractor: { name: string | null } | null;
          businessArea: { name: string | null } | null;
        })
      | null;
  };
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();

  const onChange = async (e: string) => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/finding-report/${id}`, { findingLevel: e });

      if (e === "HIGH") {
        try {
          await axios.post(`/api/finding-report/${id}/mail`, {});
        } catch (error) {
          toast.error("Error al enviar el email");
        }
        try {
          const {data} = await axios.post(`/api/messages/`, {
            message: `[TISOG] Se acaba de registrar una condicion critica en CC FEMSA. Contratista: ${
              findingReport.controlReport?.contractor?.name
            }, area: ${
              findingReport.controlReport?.businessArea?.name
            } fecha: ${
              findingReport.controlReport?.date
                ? format(findingReport.controlReport.date, "dd-MM-yyyy", {locale: es})
                : "-"
            }. https://bit.ly/3Sm4SAB`,
          });
          console.log({sms: data})
        } catch (error) {
          toast.error("Error al enviar el SMS");
        }
      }

      toast.info("nivel de criticidad cambiado correctamente");
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error");
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="flex flex-col">
      <span className="font-bold text-sm">Nivel: </span>
      <Select
        defaultValue={level}
        onValueChange={(e) => onChange(e)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="LOW">Bajo</SelectItem>
          <SelectItem value="MEDIUM">Medio</SelectItem>
          <SelectItem value="HIGH">Alto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
