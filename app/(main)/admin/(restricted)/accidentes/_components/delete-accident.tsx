"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Accidents, User } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteAccidentProps {
  accident: Accidents;
}

export const DeleteAccident = ({ accident }: DeleteAccidentProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/accidents/${accident.id}`);
      toast.success("Accidente eliminado");
      router.push("/admin/accidentes/");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error al momento de eliminar el Accidente registrado"
      );
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el accidente registrado?

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
