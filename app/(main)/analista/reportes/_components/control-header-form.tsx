"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CommandList } from "cmdk";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import debounce from "lodash/debounce";
import { Contractor, ControlReport, BusinessAreas, User } from "@prisma/client";
import { TextAreaForm } from "@/components/textarea-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { CalendarInputForm } from "@/components/calendar-input-form";
import { InputForm } from "@/components/input-form";

const formSchema = z.object({
  source: z.string().min(1, { message: "Campo es requerido" }),
  description: z.string().min(1, { message: "Campo es requerido" }),
  exactLocation: z.string().min(1, { message: "Campo es requerido" }),
  businessAreaId: z.string().min(1, { message: "Campo es requerido" }),
  contractorId: z.string().min(1, { message: "Campo es requerido" }),
  controllerId: z.string().min(1, { message: "Campo es requerido" }),
  date: z.date(),
});

const selectOptions = [
  { value: "inspeccion", label: "Inspección" },
  { value: "inspeccion-preoperacional", label: "Insp. Preoperacional" },
  {
    value: "reporte-condicion-insegura",
    label: "Reporte de condiciones inseguras",
  },
  { value: "reporte-acto-inseguro", label: "Reporte de actos inseguros" },
  { value: "observacion-en-campo", label: "Observaciones en campo" },
  { value: "sugerencia", label: "Sugerencia" },
];

export const ControlHeaderForm = ({
  control,
  areas,
  contractors,
  actualUserId,
  controllers,
  disabled,
}: {
  control?: ControlReport;
  areas: BusinessAreas[];
  contractors: Contractor[];
  actualUserId?: string;
  controllers: User[];
  disabled?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEdit = useMemo(() => !!control, [control]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: control?.source || "",
      description: control?.description || "",
      businessAreaId: control?.businessAreaId || "",
      exactLocation: control?.exactLocation || "",
      contractorId: control?.contractorId || "",
      controllerId: control?.controllerId || actualUserId || "",
      date: control?.date || new Date(),
    },
  });

  const { setValue, getValues, watch } = form;

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
          if (isEdit) {
            await axios.patch(`/api/controls/${control?.id}`, values);
          }
          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setIsLoading(false);
        }
      }, 1000),
    [control, isEdit, router]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      if (isEdit) {
        debouncedSave(values as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, isEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (isEdit) {
        await axios.patch(`/api/controls/${control?.id}`, values);
        toast.info("Actualizado correctamente");
      } else {
        const { data } = await axios.post(`/api/controls/`, values);
        toast.info("Control Creado");
        router.push(`/analista/reportes/${data.id}`);
      }
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-auto min-w-min my- relative p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" w-full flex flex-col items-center"
        >
          {isLoading && (
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm bg-white/30">
              <Loader2 className="w-7 h-7 animate-spin text-primary fade-in-5" />
            </div>
          )}
          <div className="w-full grid xl:grid-cols-2 items-start gap-1 space-y-0 p-0 my-0">
            <div>
              <FormField
                control={form.control}
                name="businessAreaId"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="font-semibold text-primary">
                      Área
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={disabled}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? areas?.find((area) => area.id === field.value)
                                  ?.name
                              : "Selecciona un area"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar areas registradas" />
                          <CommandEmpty>Area no encontrada!</CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {areas?.map((area, index) => (
                                <CommandItem
                                  value={`${area}`}
                                  key={area.id + index}
                                  onSelect={() => {
                                    setValue("businessAreaId", area.id, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      area.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {area.name}
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
            </div>
            <div>
              <InputForm
                control={form.control}
                label="Lugar exacto (opcional)"
                name="exactLocation"
              />
            </div>

            <div>
              <FormField
                control={form.control}
                name="source"
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel>Fuente</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una fuente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="controllerId"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="font-semibold text-primary uppercase">
                      Interventor / analista
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={disabled}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? controllers?.find(
                                  (controller) => controller.id === field.value
                                )?.name
                              : "Selecciona un interventor"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar interventores registrados" />
                          <CommandEmpty>
                            Interventor no encontrado!
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {controllers?.map((controller, index) => (
                                <CommandItem
                                  value={`${controller.name}`}
                                  key={controller.id + index}
                                  onSelect={() => {
                                    setValue("controllerId", controller.id, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      controller.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {controller.name}
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
            </div>

            <div>
              <FormField
                control={form.control}
                name="contractorId"
                disabled={disabled}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    <FormLabel className="font-semibold text-primary uppercase">
                      Contratista
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            disabled={disabled}
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? contractors?.find(
                                  (contractor) => contractor.id === field.value
                                )?.name
                              : "Selecciona un contratista"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command className="w-full">
                          <CommandInput placeholder="Buscar contratistas registrados" />
                          <CommandEmpty>
                            Contratista no encontrado!
                          </CommandEmpty>
                          <CommandGroup>
                            <CommandList>
                              {contractors?.map((contractor, index) => (
                                <CommandItem
                                  value={`${contractor.name}`}
                                  key={contractor.id + index}
                                  onSelect={() => {
                                    setValue("contractorId", contractor.id, {
                                      shouldValidate: true,
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      contractor.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {contractor.name}
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
            </div>
            <div>
              <CalendarInputForm
                control={form.control}
                label="Fecha"
                name="date"
                className="w-full"
              />
            </div>
            <div className="md:col-span-2">
              <TextAreaForm
                control={form.control}
                label="Descripción de la actividad"
                name="description"
              />
            </div>
          </div>

          {!isEdit && (
            <Button className="w-full max-w-[300px]" type="submit">
              Seguir
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};
