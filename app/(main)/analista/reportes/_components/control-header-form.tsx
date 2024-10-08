"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CommandList } from "cmdk";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
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
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z
  .object({
    source: z.string().min(1, { message: "Campo es requerido" }),
    description: z.string().nullable(),
    exactLocation: z.string().min(1, { message: "Campo es requerido" }),
    businessAreaId: z.string().min(1, { message: "Campo es requerido" }),
    contractorId: z.string().optional(),
    projectAuditor: z.string().min(1, { message: "Campo es requerido" }),
    controllerId: z.string().min(1, { message: "Campo es requerido" }),
    typeRisk: z.string().min(1, { message: "Campo es requerido" }),
    date: z.date(),
  })
  .refine(
    (data) => {
      // Si el tipo es "checklist", contractorId debe ser obligatorio
      if (data.source === "checklist" && !data.contractorId) {
        return false;
      }
      return true;
    },
    {
      message:
        "Contratista es requerido cuando el tipo es una lista de chequeo.",
      path: ["contractorId"],
    }
  );

const selectType = [
  { value: "checklist", label: "Lista de chequeo" },
  { value: "findingReport", label: "Reporte de hallazgo" },
];

const typeRisks = [
  { value: "CHEMICAL_RISK", label: "Riesgo Químico" },
  { value: "ELECTRICAL_RISK", label: "Riesgo eléctrico" },
  { value: "MECHANICAL_RISK", label: "Riesgo mecánico" },
  { value: "LOCATIVE_RISK", label: "Riesgo locativo" },
  {
    value: "SAFE_TRANSIT",
    label: "Tránsito seguro y acceso a zonas restringidas",
  },
  { value: "ORDER_AND_CLEANLINESS", label: "Orden y aseo, BHM" },
  { value: "ROAD_BEHAVIOR", label: "Comportamiento Vial" },
  { value: "PPE_USE", label: "Uso de EPP" },
  { value: "ERGONOMICS_AND_STORAGE", label: "Ergonomía y almacenamiento" },
  { value: "WASTE_MANAGEMENT", label: "Gestión de residuos" },
  {
    value: "HIGH_RISK_TASKS",
    label: "Tareas de alto riesgo/Actividades de mantenimiento",
  },
];

const projectInterveners = [
  { value: "ECOHL", label: "ECOHL" },
  { value: "GIRO", label: "GIRO" },
];

export const ControlHeaderForm = ({
  control,
  areas,
  contractors,
  actualUserId,
  controllers,
  disabled,
  isAdmin,
}: {
  control?: ControlReport;
  areas: BusinessAreas[];
  contractors: Contractor[];
  actualUserId?: string;
  controllers: User[];
  disabled?: boolean;
  isAdmin: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const isEdit = useMemo(() => !!control, [control]);

  const pathArray = usePathname().split("/");
  const path = pathArray[pathArray.length - 1];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: control?.source || "",
      description: control?.description || "",
      businessAreaId: control?.businessAreaId || "",
      exactLocation: control?.exactLocation || "",
      contractorId: control?.contractorId || "",
      controllerId: control?.controllerId || actualUserId || "",
      projectAuditor: control?.projectAuditor || "",
      typeRisk: control?.typeRisk || "",
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
            <div className="col-span-1 md:col-span-2 flex justify-center ">
              <div className="max-w-[400px] w-full mb-3 bg-slate-200 p-2 rounded-sm">
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="font-semibold text-primary">
                        Tipo:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled || !!control}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "font-medium ",
                              !!!field.value && "text-muted-foreground "
                            )}
                          >
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectType.map((type) => (
                            <SelectItem key={type.value} value={`${type.value}`}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <FormField
                  control={form.control}
                  name="controllerId"
                  disabled={disabled}
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="font-semibold text-primary">
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
                                    (controller) =>
                                      controller.id === field.value
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
                            <ScrollArea className="h-[300px] w-[350px] p-1">
                              <CommandGroup>
                                <CommandList>
                                  {controllers?.map((controller, index) => (
                                    <CommandItem
                                      value={`${controller.name}`}
                                      key={controller.id + index}
                                      onSelect={() => {
                                        setValue(
                                          "controllerId",
                                          controller.id,
                                          {
                                            shouldValidate: true,
                                          }
                                        );
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
                            </ScrollArea>
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
                      <FormLabel className="font-semibold text-primary ">
                        Contratista
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild disabled={watch("source") !== "checklist"}>
                          <FormControl>
                            <Button
                              disabled={watch("source") !== "checklist" || disabled}
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? contractors?.find(
                                    (contractor) =>
                                      contractor.id === field.value
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

                {/* <InputForm
                  control={form.control}
                  label="Contratista"
                  name="contractorId"
                  disabled={disabled}
                /> */}
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="typeRisk"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="font-semibold text-primary">
                        Riesgo asociado:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "font-medium ",
                              !!!field.value && "text-muted-foreground "
                            )}
                          >
                            <SelectValue placeholder="Selecciona el riesgo asociado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {typeRisks.map((option) => (
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
                  name="projectAuditor"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel className="font-semibold text-primary">
                        Interventor del proyecto:
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={disabled}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "font-medium ",
                              !!!field.value && "text-muted-foreground "
                            )}
                          >
                            <SelectValue placeholder="Selecciona un interventor del proyecto" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectInterveners.map((option) => (
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
            </div>
            {/* =========================================== */}
            <div className="space-y-2">
              <div>
                <FormField
                  control={form.control}
                  name="businessAreaId"
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
                            <ScrollArea className="h-[300px] w-[350px] p-1">
                              <CommandGroup>
                                <CommandList>
                                  {areas?.map((area, index) => (
                                    <CommandItem
                                      value={`${area.name}`}
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
                            </ScrollArea>
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
                  label="Lugar exacto (breve descripción)"
                  name="exactLocation"
                  disabled={disabled}
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha"
                  name="date"
                  className="w-full"
                  disabled={path !== "crear"}
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <TextAreaForm
                control={form.control}
                label="Descripción de la actividad"
                name="description"
                disabled={disabled}
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
// path !== "crear"
