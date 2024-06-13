"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CommandList } from "cmdk";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import debounce from "lodash/debounce";

import { useLoading } from "@/components/providers/loading-provider";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Contractor, ControlReport } from "@prisma/client";
import { CalendarInputForm } from "@/components/calendar-input-form";

const formSchema = z.object({
  description: z.string().optional(),
  workArea: z.string().optional(),
  contractorId: z.string().optional(),
  //   date: z.date(),
});

export const HeaderForm = ({
  control,
  areas,
  contractors,
  disabled,
}: {
  control?: ControlReport;
  areas: any[];
  contractors: Contractor[];
  companyId: string;
  disabled: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const [areasDefaults, setAreasDefaults] = useState(
    areas.map((area) => area.name)
  );
  const isEdit = useMemo(() => !!control, [control]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: control?.description || "",
      workArea: control?.workArea || "",
      contractorId: control?.contractorId || "",
      //   date: control?.createdAt || undefined,
    },
  });

  const { setValue, getValues, watch } = form;

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setLoadingApp(true);
        try {
          if (isEdit) {
            await axios.patch(`/api/controls/${control?.id}`, values);
          } else {
            const { data } = await axios.post(`/api/job-analysis/`, values);
            toast.info("Control actualizado");
            router.push(`/interventor/reporte/${data.id}`);
          }
          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setLoadingApp(false);
        }
      }, 1000),
    [control, isEdit, router, setLoadingApp]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      if (isEdit) {
        debouncedSave(values);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, isEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingApp(true);
    try {
      if (isEdit) {
        await axios.patch(`/api/controls/${control?.id}`, values);
        toast.info("Actualizado correctamente");
      } else {
        const { data } = await axios.post(`/api/controls/`, values);
        toast.info("Control creado");
        router.push(`/interventor/reportes/${data.id}#steps`);
      }
      router.refresh();
    } catch (error) {
      toast.error("Ocurrió un error");
    } finally {
      setLoadingApp(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full grid grid-cols-3 items-start gap-6 p-2 borde"
      >
        <TextAreaForm
          control={form.control}
          label="Descripción de la actividad"
          name="description"
        />

        <FormField
          control={form.control}
          name="workArea"
          disabled={disabled}
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel className="font-semibold text-primary uppercase">
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
                        ? areasDefaults?.find((area) => area === field.value)
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
                        {areasDefaults?.map((area, index) => (
                          <CommandItem
                            value={`${area}`}
                            key={area + index}
                            onSelect={() => {
                              setValue("workArea", area, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                area === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {area}
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
                        ? areasDefaults?.find((area) => area === field.value)
                        : "Selecciona un area"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar areas registradas" />
                    <CommandEmpty>Contratista no encontrado!</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {contractors?.map((contractor, index) => (
                          <CommandItem
                            value={`${contractor}`}
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

        <div className="w-full flex flex-col gap-6 ">
          <CalendarInputForm
            control={form.control}
            label="Fecha de realización"
            name="date"
            className="w-full"
          />
        </div>

        {!isEdit && <Button type="submit">Seguir</Button>}
      </form>
    </Form>
  );
};
