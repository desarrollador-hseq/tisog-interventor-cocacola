"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BusinessAreas,
  Contractor,
  ControlReport,
  FindingReport,
} from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Form } from "@/components/ui/form";

import { CalendarInputForm } from "@/components/calendar-input-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { InputForm } from "@/components/input-form";
import { useEffect, useMemo, useState } from "react";
import { HeaderForm } from "@/app/(main)/analista/reportes/_components/header-form";
import { debounce } from "lodash";
import { useLoading } from "@/components/providers/loading-provider";

interface AddFindingReportFormProps {
  findingReport?:
    | (FindingReport & { controlReport: ControlReport | null })
    | null;
  contractors: Contractor[];
  businessAreas: BusinessAreas[];
}

const formSchema = z.object({
  findingDesc: z.string().min(1, {
    message: "Nombre completo es requerido",
  }),
  actionToTake: z.string().min(1, {
    message: "Nombre completo es requerido",
  }),
  actionInmediate: z.string().min(1, {
    message: "Nombre completo es requerido",
  }),
  proposedClosureDate: z.date().nullable(),
  actualClosureDate: z.date().nullable(),
});

export const AddFindingReportForm = ({
  findingReport,
  contractors,
  businessAreas,
}: AddFindingReportFormProps) => {
  const router = useRouter();
  const [findingReportData, setFindingReportData] = useState(findingReport);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      findingDesc: findingReportData?.findingDesc || "",
      actionToTake: findingReportData?.actionToTake || "",
      actionInmediate: findingReportData?.actionInmediate || "",
      proposedClosureDate: findingReportData?.proposedClosureDate || null,
      actualClosureDate: findingReportData?.actualClosureDate || null,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError, watch, getValues } = form;
  const { setLoadingApp } = useLoading();

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setLoadingApp(true);
        try {
          await axios.patch(`/api/finding-report/${findingReport?.id}`, values);

          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setLoadingApp(false);
        }
      }, 1000),
    [findingReport, router, setLoadingApp]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      debouncedSave(values);
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { data } = await axios.patch(
        `/api/finding-report/${findingReport?.id}`,
        values
      );
      setFindingReportData(data);
      toast.success("reporte actualizado");

      // router.push(`/dashboard/entrenamiento/colaboradores`);
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
            setError("actualClosureDate", {
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
    } finally {
      form.reset();
    }
  };

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center mt-8 p-2"
          >
            <div className="space-y-4">
              <div>
                <InputForm
                  control={form.control}
                  label="Hallazgo"
                  name="findingDesc"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Acción inmediata"
                  name="actionInmediate"
                />
              </div>
              <div>
                <InputForm
                  control={form.control}
                  label="Acción a tomar"
                  name="actionToTake"
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha propuesta de Cierre"
                  name="proposedClosureDate"
                  disabled={false}
                />
              </div>
              <div>
                <CalendarInputForm
                  control={form.control}
                  label="Fecha Real de Cierre"
                  name="actualClosureDate"
                  disabled={false}
                />
              </div>
            </div>

            {/* <Button
              disabled={isSubmitting || !isValid}
              className="w-full max-w-[500px] gap-3"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Actualizar
            </Button> */}
          </form>
        </Form>
        {/* 2 Column */}
        <div className="space-y-4">
          <div>
            {/* <InputForm control={form.control} label="" name="" /> */}
            <HeaderForm
              control={findingReport?.controlReport}
              contractors={contractors}
              areas={businessAreas}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
