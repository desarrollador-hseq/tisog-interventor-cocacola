"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Contractor } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteContractorProps {
  contractor: Contractor;
}

export const DeleteContractor = ({ contractor }: DeleteContractorProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/contractors/${contractor.id}`);
      toast.success("Contratista eliminado");
      router.push("/admin/contratistas/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar el contratista");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el contratista de nombre:{" "}
      <span className="font-bold ">{contractor?.name}</span>
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
