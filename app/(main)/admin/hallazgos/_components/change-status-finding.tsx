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

export const ChangeStatusFinding = ({
  id,
  status,
  disabled,
}: {
  id: string;
  status: "OPEN" | "CLOSED" | "CANCELED";
  disabled?: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();


  const onChange = async (e: string) => {
    setLoadingApp(true);
    try {
      await axios.patch(`/api/finding-report/${id}`, { status: e });

      toast.info("Estado cambiado correctamente");
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error");
    } finally {
      setLoadingApp(false);
    }
  };
  return (
    <div className="flex flex-col">
      <span className="font-bold text-sm">Estado: </span>
      <Select
        defaultValue={status}
        onValueChange={(e) => onChange(e)}
        disabled={disabled}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="OPEN">ABIERTO</SelectItem>
          <SelectItem value="CLOSED">CERRADO</SelectItem>
          <SelectItem value="CANCELED">CANCELADO</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
