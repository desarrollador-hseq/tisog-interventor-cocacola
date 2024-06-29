"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TypeTool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useLoading } from "@/components/providers/loading-provider";

interface AddTypeToolFormProps {
  typeTool?: TypeTool | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre es requerido",
  }),
});

export const AddTypeToolForm = ({ typeTool }: AddTypeToolFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const isEdit = useMemo(() => !!typeTool, [typeTool]);

  if (isEdit && !typeTool) {
    toast.error("Tipo de herramienta no encontrado, redirigiendo...");
    router.replace("/admin/herramientas/");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: typeTool?.name || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/type-tools/${typeTool?.id}`, values);
        toast.success("Tipo de herramienta actualizado");
      } else {
        const { data } = await axios.post(`/api/type-tools/`, values);
        router.push(`/admin/herramientas/`);
        toast.success("Tipo de herramienta agregado correctamente");
      }
      // router.push(`/admin/colaboradores`);
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const serverResponse = error.response;
        if (serverResponse && serverResponse.status === 400) {
          const errorMessage = serverResponse.data;
          if (
            typeof errorMessage === "string" &&
            errorMessage.includes("Tipo de herramienta ya se encuentra registrado")
          ) {
            setError("name", {
              type: "manual",
              message: "Tipo de herramienta ya se encuentra registrado",
            });
          } else {
            toast.error(errorMessage);
          }
        } else {
          toast.error("Ocurrió un error inesperado");
        }
      } else {
        console.error(error);
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="max-w-[1500px] w-[50%] h-full mx-auto bg-white  overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4"
        >
          <InputForm
            control={form.control}
            label="Nombre"
            name="name"
            className="w-full"
          />

          <Button
            disabled={isSubmitting || !isValid}
            className="w-full max-w-[500px] gap-3"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" : "Agregar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
