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

interface AddContractorFormProps {
  contractor?: Contractor | null;
  cities: City[] | null;
}

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Nombre requerido",
  }),
  nit: z.string().min(1, {
    message: "Número de documento requerido",
  }),
  // cityId: z.string().min(1, {
  //   message: "Empresa es requerida",
  // }),
});

export const AddContractorForm = ({ contractor, cities }: AddContractorFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!contractor, [contractor]);

  if (isEdit && !contractor) {
    router.replace("/admin/contratistas/");
    toast.error("Empresa no encontrada, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: contractor?.name || "",
      nit: contractor?.nit || "",
      // cityId: contractor?.cityId || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/contractors/${contractor?.id}`, values);
        toast.success("Empresa actualizada");
      } else {
        const { data } = await axios.post(`/api/contractors/`, values);
        router.push(`/admin/contratistas/`);
        toast.success("Empresa creada correctamente");
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
            errorMessage.includes("NIT ya registrado en otra contratista")
          ) {
            setError("nit", {
              type: "manual",
              message: "NIT ya registrado en otra contratista",
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
            label="Razón social"
            name="name"
            className="w-full"
          />
          <InputForm
            control={form.control}
            label="NIT"
            name="nit"
            className="w-full"
          />

          {/* <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel>Ciudad:</FormLabel>
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
                          ? cities?.find((city) => city.id === field.value)
                              ?.realName
                          : "Selecciona una ciudad"}
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
                          {cities?.map((city) => (
                            <CommandItem
                              value={`${city.realName}`}
                              key={city.id}
                              onSelect={() => {
                                form.setValue("cityId", city.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  city.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {city.realName}
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
          /> */}

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
