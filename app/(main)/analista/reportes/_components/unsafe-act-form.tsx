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
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
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

  const [wasUnsafeAct, setWasUnsafeAct] = useState(
    !!control.personNameUnsafe || !!control.personDocUnsafe
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      personNameUnsafe: control?.personNameUnsafe || "",
      personDocUnsafe: control?.personDocUnsafe || "",
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

  useEffect(() => {
    if (wasUnsafeAct) return;
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
      <div className="items-top flex space-x-2 border-2 border-slate-300 my-3">
        <Checkbox
          id="notify"
          checked={wasUnsafeAct}
          onCheckedChange={(e) => setWasUnsafeAct(!!e)}
        />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="notify"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            ¿Hubo acto inseguro?
          </label>
        </div>
      </div>

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
