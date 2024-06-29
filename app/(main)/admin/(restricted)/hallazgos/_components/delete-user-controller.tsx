"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteSupervisorProps {
    controller: User;
}

export const DeleteUserController = ({ controller }: DeleteSupervisorProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/user-controller/${controller.id}`);
      toast.success("Interventor eliminado");
      router.push("/admin/interventores/");
      router.refresh();
    } catch (error) {
      toast.error(
        "Ocurrió un error al momento de eliminar al interventor"
      );
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      el interventor con número de documento:{" "}
      <span className="font-bold ">{controller?.numDoc}</span>
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
