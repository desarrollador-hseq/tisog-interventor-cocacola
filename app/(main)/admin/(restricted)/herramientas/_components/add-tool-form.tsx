"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultTool, Tool, TypeTool } from "@prisma/client";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useLoading } from "@/components/providers/loading-provider";

interface AddToolFormProps {
  tool?: DefaultTool | null;
  typeTools: TypeTool[]
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  typeToolId: z.string().min(1, {
    message: "tipo es requerido",
  }),
});

export const AddtoolForm = ({ tool, typeTools }: AddToolFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const isEdit = useMemo(() => !!tool, [tool]);

  if (isEdit && !tool) {
    toast.error("Herramienta no encontrado, redirigiendo...");
    router.replace("/admin/herramientas/");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tool?.name || "",
      typeToolId: tool?.typeToolId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/tools/${tool?.id}`, values);
        toast.success("Herramienta actualizado");
      } else {
        const { data } = await axios.post(`/api/tools/`, values);
        router.push(`/admin/herramientas/`);
        toast.success("Herramienta agregado correctamente");
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
            errorMessage.includes("Herramienta ya se encuentra registrada")
          ) {
            setError("name", {
              type: "manual",
              message: "Herramienta ya se encuentra registrada",
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
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white  overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4 "
        >
          <InputForm
            control={form.control}
            label="Nombre"
            name="name"
            className="w-full"
          />

          <FormField
            control={form.control}
            name="typeToolId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-primary font-semibold">
                  Tipo:
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? typeTools?.find(
                              (type) => type.id === field.value
                            )?.name
                          : "Selecciona un tipo de herramienta"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar empresa" />
                      <CommandEmpty>Tipo de herramienta no encontrado</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {typeTools?.map((type) => (
                            <CommandItem
                              value={`${type.name}`}
                              key={type.id}
                              onSelect={() => {
                                form.setValue("typeToolId", type.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  type.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {type.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
