"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { City, Company, User } from "@prisma/client";
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

interface AddControllerFormProps {
  controller?: User | null;
  cities: City[] | null;
  companies: Company[] | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre requerido",
  }),
  numDoc: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  companyId: z.string().min(1, {
    message: "Empresa es requerida",
  }),
  email: z.string().email({
    message: "Ingrese un correo electrónico válido",
  }),
});

export const AddControllerForm = ({
  controller,
  companies,
}: AddControllerFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!controller, [controller]);

  if (isEdit && !controller) {
    router.replace("/admin/interventores/");
    toast.error("Interventor no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: controller?.name || "",
      numDoc: controller?.numDoc || "",
      companyId: controller?.companyId || "",
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
        toast.success("Interventor actualizado");
      } else {
        const { data } = await axios.post(`/api/user-controller/`, values);
        router.push(`/admin/interventores/`);
        toast.success("Interventor creado correctamente");
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
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Empresa:</FormLabel>
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
                          ? companies?.find(
                              (company) => company.id === field.value
                            )?.name
                          : "Selecciona una empresa"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar ciudad" />
                      <CommandEmpty>Ciudad no encontrada</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {companies?.map((company) => (
                            <CommandItem
                              value={`${company.name}`}
                              key={company.id}
                              onSelect={() => {
                                form.setValue("companyId", company.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  company.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {company.name}
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
