"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SecurityCategory, TypeTool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModalDeleteConfirm } from "@/components/modal-delete-confirm";

interface DeleteCategoryAspectProps {
  category: SecurityCategory;
}

export const DeleteCategoryAspect = ({ category }: DeleteCategoryAspectProps) => {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  const onConfirm = async () => {
    setisLoading(true);
    try {
      await axios.delete(`/api/category-aspect/${category.id}`);
      toast.success("Categoria eliminada");
      router.push("/admin/aspectos/");
      // router.refresh()
    } catch (error) {
      toast.error("ocurrió un error al momento de eliminar la categoria");
    } finally {
      router.refresh();
      setisLoading(false);
    }
  };

  const title = (
    <p className="font-normal inline">
      la categoria de nombre:{" "}
      <span className="font-bold ">{category?.name}</span>
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
