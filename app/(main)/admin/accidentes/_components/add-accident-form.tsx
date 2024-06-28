"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Accidents,
  BusinessAreas,
  Contractor,
} from "@prisma/client";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CalendarInputForm } from "@/components/calendar-input-form";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TextAreaForm } from "@/components/textarea-form";

interface AddAccidentFormProps {
  accident?: Accidents | null;
  contractors: Contractor[];
  areas: BusinessAreas[];
}

const formSchema = z.object({
  numDoc: z.string().min(1, {
    message: "Campo requerido",
  }),
  date: z.date(),
  birthdate: z.date().optional(),
  type: z.enum(["ACCIDENT", "INCIDENT"]),
  contractorId: z.string().min(1, {
    message: "Campo requerido",
  }),
  origin: z.enum(["ACT", "CONDITION"]),
  status: z.enum(["OPEN", "CLOSED"]),
  classification: z.enum([
    "FIRST_AID",
    "MEDICAL_TREATMENT",
    "LOST_WORKDAY",
    "NEAR_MISS",
  ]),
  level: z.coerce.number(),
  name: z.string().min(1, {
    message: "Campo requerido",
  }),
  position: z.string().min(1, {
    message: "Campo requerido",
  }),
  areaId: z.string().min(1, {
    message: "Campo requerido",
  }),
  desc: z.string().min(1, {
    message: "Campo requerido",
  }),
  correction: z.string().optional(),
  correctiveAction: z.string().optional(),
  closedDate: z.date().optional(),
  typeInjury: z.string().min(1, {
    message: "Campo requerido",
  }),
});

export const AddAccidentForm = ({
  accident,
  contractors,
  areas,
}: AddAccidentFormProps) => {
  const router = useRouter();
  const isEdit = useMemo(() => !!accident, [accident]);

  if (isEdit && !accident) {
    router.replace("/admin/accidentes/");
    toast.error("Accidente no encontrado, redirigiendo...");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: accident?.date || new Date(),
      type: accident?.type || "ACCIDENT",
      contractorId: accident?.contractorId || "",
      origin: accident?.origin || "ACT",
      classification: accident?.classification || "FIRST_AID",
      level: accident?.level || 0,
      name: accident?.name || "",
      numDoc: accident?.numDoc || "",
      position: accident?.position || "",
      areaId: accident?.areaId || "",
      desc: accident?.desc || "",
      correction: accident?.correction || "",
      correctiveAction: accident?.correctiveAction || "",
      closedDate: accident?.closedDate || new Date(),
      typeInjury: accident?.typeInjury || "",
      status: accident?.status || "OPEN",
      birthdate: accident?.birthdate || undefined,
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/accidents/${accident?.id}`, values);
        toast.success("Accidente actualizado");
      } else {
        const { data } = await axios.post(`/api/accidents/`, values);
        router.push(`/admin/accidents/`);
        toast.success("Accidente guardado correctamente");
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
    <div className="max-w-[1500px]  h-full mx-auto bg-slate-100 border overflow-y-hidden p-3 rounded-md shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-center">
          <div className="grid grid-cols-2 items-center mt-2 p-2 w-full gap-4">
            <CalendarInputForm
              control={form.control}
              label="Fecha"
              name="date"
              className="w-full"
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Tipo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACCIDENT">Accidente</SelectItem>
                      <SelectItem value="INCIDENT">Incidente</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contractorId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-primary">Contratista:</FormLabel>
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
                        <CommandInput placeholder="Buscar contratista" />
                        <CommandEmpty>Contratista no encontrada</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {contractors?.map((contractor) => (
                              <CommandItem
                                value={`${contractor.name}`}
                                key={contractor.id}
                                onSelect={() => {
                                  form.setValue("contractorId", contractor.id, {
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
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Origen</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un origen " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ACT">ACTO</SelectItem>
                      <SelectItem value="CONDITION">CONDICION</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Clasificacion</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un origen " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FIRST_AID">
                        Primeros auxilios
                      </SelectItem>
                      <SelectItem value="MEDICAL_TREATMENT">
                        Tratamiento medico
                      </SelectItem>
                      <SelectItem value="LOST_WORKDAY">
                        Incidente, dias perdidos
                      </SelectItem>
                      <SelectItem value="NEAR_MISS">Near miss</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary">Clasificacion</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una clasificación" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Nivel 0</SelectItem>
                      <SelectItem value="1">Nivel 1</SelectItem>
                      <SelectItem value="2">Nivel 2</SelectItem>
                      <SelectItem value="3">Nivel 3</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <InputForm
              control={form.control}
              label="Nombre"
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
              label="Cargo"
              name="position"
              className="w-full"
            />

            <CalendarInputForm
              control={form.control}
              label="Fecha de nacimiento"
              name="birthdate"
              className="w-full"
            />

            <FormField
              control={form.control}
              name="areaId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel className="text-primary">Área:</FormLabel>
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
                            ? areas?.find((area) => area.id === field.value)
                                ?.name
                            : "Selecciona un area"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command className="w-full">
                        <CommandInput placeholder="Buscar area" />
                        <CommandEmpty>Área no encontrada</CommandEmpty>
                        <CommandGroup>
                          <CommandList>
                            {areas?.map((area) => (
                              <CommandItem
                                value={`${area.name}`}
                                key={area.id}
                                onSelect={() => {
                                  form.setValue("areaId", area.id, {
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

            <TextAreaForm
              control={form.control}
              label="Descripción"
              name="desc"
              className="w-full"
            />
            <TextAreaForm
              control={form.control}
              label="Tipo de lesión"
              name="typeInjury"
              className="w-full"
            />
            <TextAreaForm
              control={form.control}
              label="Corrección"
              name="correction"
              className="w-full"
            />
            <TextAreaForm
              control={form.control}
              label="Acción correctiva"
              name="correctiveAction"
              className="w-full"
            />

            <CalendarInputForm
              control={form.control}
              label="Fecha de nacimiento"
              name="closedDate"
              className="w-full"
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary"> Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un origen " />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OPEN">Abierto</SelectItem>
                      <SelectItem value="CLOSED">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            disabled={isSubmitting || !isValid}
            className="w-full max-w-[500px] gap-3 mx-auto"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Actualizar" : "Agregar"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
