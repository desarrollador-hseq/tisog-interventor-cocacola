"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, Contractor, User } from "@prisma/client";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Form } from "@/components/ui/form";

interface AddControllerFormProps {
  controller?: User | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre requerido",
  }),
  numDoc: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido",
  }),
});

export const AddControllerForm = ({ controller }: AddControllerFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!controller, [controller]);

  if (isEdit && !controller) {
    router.replace("/admin/analistas/");
    toast.error("Analista no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: controller?.name || "",
      numDoc: controller?.numDoc || "",
      email: controller?.email,
      // cityId: driver?.cityId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/user-controller/${controller?.id}`, values);
        toast.success("Analista actualizado");
      } else {
        const { data } = await axios.post(`/api/user-controller/`, values);
        router.push(`/admin/analistas/`);
        await axios.post(`/api/user/first-password`, values);
        toast.success("Analista creado correctamente");
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
            errorMessage.includes("Número de documento ya registrado")
          ) {
            setError("numDoc", {
              type: "manual",
              message: "Número de documento ya registrado",
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
    <div className="max-w-[1500px] w-[50%] h-full mx-auto bg-slate-100 border overflow-y-hidden p-3 rounded-md shadow-sm">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4"
        >
          <InputForm
            control={form.control}
            label="Nombre completo"
            name="name"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="Número de documento"
            name="numDoc"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="Correo electrónico"
            name="email"
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
