"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ControlReport, SecurityQuestion, Tool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteReportProps {
  report: ControlReport;
}

export const ModalDeleteReport = ({ report }: DeleteReportProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/controls/${report.id}`);
      toast.info("Reporte eliminado correctamente");
      router.push("/admin/reportes/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar el reporte");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el reporte de lista de control
    </p>
  );

  return (
    <ModalDeleteConfirm onConfirm={onConfirm} title={title}>
      <Button disabled={isLoading} variant="destructive" className="bg-red-700">
        <Trash2 className="w-5 h-5" />
      </Button>
    </ModalDeleteConfirm>
  );
};
