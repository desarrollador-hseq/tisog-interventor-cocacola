"use client";

import React, { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import debounce from "lodash/debounce";
import { ControlReport } from "@prisma/client";
import { useLoading } from "@/components/providers/loading-provider";
import { Form } from "@/components/ui/form";
import { InputForm } from "@/components/input-form";

const formSchema = z.object({
  personNameUnsafe: z.string(),
  personDocUnsafe: z.string(),
});

export const UnsafeActForm = ({
  control,
  disabled,
}: {
  control: ControlReport;
  disabled?: boolean;
}) => {
  const { setLoadingApp } = useLoading();
  const router = useRouter();
  const isEdit = useMemo(() => !!control, [control]);
  const [isClient, setIsClient] = useState(false);

  const [controlData, setControlData] = useState(control);

  const wasUnsafeAct = useMemo(
    () => controlData.source === "reporte-acto-inseguro",
    [controlData]
  );

  useEffect(() => {
    setControlData(control);
  }, [control]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personNameUnsafe: controlData?.personNameUnsafe || "",
      personDocUnsafe: controlData?.personDocUnsafe || "",
    },
  });

  const { setValue, getValues, watch } = form;

  useEffect(() => {
    setIsClient(true);
  }, []);

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setLoadingApp(true);
        try {
          if (isEdit) {
            await axios.patch(`/api/controls/${control?.id}`, values);
          }
          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setLoadingApp(false);
        }
      }, 1000),
    [controlData, isEdit, router, setLoadingApp]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      if (isEdit) {
        debouncedSave(values as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, isEdit]);

  useEffect(() => {
    if (wasUnsafeAct || !isClient) return;
    setValue("personNameUnsafe", "", { shouldValidate: true });
    setValue("personDocUnsafe", "", { shouldValidate: true });
  }, [wasUnsafeAct]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingApp(true);
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
      setLoadingApp(false);
    }
  };

  return (
    <div className="w-auto min-w-min">
      {wasUnsafeAct && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full flex p-3"
          >
            <InputForm
              control={form.control}
              label="Persona del acto inseguro"
              name="personNameUnsafe"
              className="w-1/2"
            />

            <InputForm
              control={form.control}
              label="Número de documento"
              name="personDocUnsafe"
              className="w-1/2"
            />

            {/* {!isEdit && <Button type="submit">Seguir</Button>} */}
          </form>
        </Form>
      )}
    </div>
  );
};
