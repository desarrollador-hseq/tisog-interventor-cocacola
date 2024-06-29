"use client"

import { useLoading } from "@/components/providers/loading-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const ChangeLevelFinding = ({
  id,
  level,
  disabled,
}: {
  id: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  disabled?: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();


  const onChange = async (e: string) => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/finding-report/${id}`, { findingLevel: e });

      if(e === "HIGH") {
        await axios.post(`/api/finding-report/${id}/mail`, {})
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
