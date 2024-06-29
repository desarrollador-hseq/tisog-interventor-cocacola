"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddUserFormProps {
  user?: User | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre requerido",
  }),
  numDoc: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  email: z
    .string()
    .min(1, { message: "correo electrónico es requerido" })
    .email("Ingrese un correo válido"),
  role: z.enum(["ADMIN", "USER", "VIEWER"]),
});

export const AddUserForm = ({ user }: AddUserFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!user, [user]);

  if (isEdit && !user) {
    router.replace("/admin/usuarios/");
    toast.error("Usuario no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || "",
      numDoc: user?.numDoc || "",
      email: user?.email || "",
      role: user?.role || "USER",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/user/${user?.id}`, values);
        toast.success("Usuario actualizado");
      } else {
        const { data } = await axios.post(`/api/user/`, values);
        router.push(`/admin/usuarios/`);
        toast.success("Usuario creado correctamente");
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
            errorMessage.includes("Documento ya registrado en otro usuario")
          ) {
            setError("numDoc", {
              type: "manual",
              message: "Documento ya registrado en otro usuario",
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
            label="Nombres"
            name="name"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="N. Documento"
            name="numDoc"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="Correo electrónico"
            name="email"
            className="w-full"
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-primary">Rol</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="VIEWER">Observador</SelectItem>
                    <SelectItem value="USER">Interventor/Analista</SelectItem>
                    <SelectItem value="ADMIN">ADMINISTRADOR</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
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
