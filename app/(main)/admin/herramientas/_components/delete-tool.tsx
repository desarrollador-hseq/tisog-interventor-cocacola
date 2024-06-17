"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DefaultTool, Tool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteToolProps {
  tool: DefaultTool;
}

export const DeleteTool = ({ tool }: DeleteToolProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/tools/${tool.id}`);
      toast.success("Herramientas eliminada");
      router.push("/admin/herramientas/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar el cargo");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      la herramienta de nombre: <span className="font-bold ">{tool?.name}</span>
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
