


"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessAreas, SecurityCategory, TypeTool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteAreaProps {
    businessArea: BusinessAreas;
}

export const DeleteArea = ({ businessArea }: DeleteAreaProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/areas/${businessArea.id}`);
      toast.success("Área eliminada");
      router.push("/admin/areas/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar el área");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el área de nombre:{" "}
      <span className="font-bold ">{businessArea?.name}</span>
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
