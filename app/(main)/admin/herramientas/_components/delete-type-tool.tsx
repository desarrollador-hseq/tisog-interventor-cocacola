"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TypeTool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteTypeToolProps {
  typeTool: TypeTool;
}

export const DeleteTypeTool = ({ typeTool }: DeleteTypeToolProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/type-tools/${typeTool.id}`);
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
      el tipo de herramienta de nombre:{" "}
      <span className="font-bold ">{typeTool?.name}</span>
    </p>
  );

  return (
    <ModalDeleteConfirm onConfirm={onConfirm} title={title}>
      <Button disabled={isLoading} variant="destructive" className="p-1 h-auto bg-red-500 hover:bg-red-600">
        <Trash2 className="w-4 h-4 " />
      </Button>
    </ModalDeleteConfirm>
  );
};
