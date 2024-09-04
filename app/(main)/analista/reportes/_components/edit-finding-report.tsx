"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  BusinessAreas,
  Contractor,
  ControlReport,
  FindingReport,
  User,
} from "@prisma/client";
import { debounce } from "lodash";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { CalendarInputForm } from "@/components/calendar-input-form";
import { TextAreaForm } from "@/components/textarea-form";
import { UploadImageForm } from "@/components/upload-image-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { FieldUpdateForm } from "@/components/field-update-form";
import { Separator } from "@/components/ui/separator";

interface AddFindingReportFormProps {
  findingReport?:
    | (FindingReport & { controlReport: ControlReport | null })
    | null;
}

const formSchema = z.object({
  findingDesc: z.string().min(1, {
    message: "Descripción es requerido",
  }),
  actionToTake: z.string().min(1, {
    message: "Accion a tomar es requerido",
  }),
  typeAction: z.string().min(1, {
    message: "tipo es requerido",
  }),
  actionInmediate: z.string().min(1, {
    message: "Accion inmediata es requerido",
  }),
  proposedClosureDate: z.date().nullable(),
  actualClosureDate: z.date().nullable(),
});

export const EditFindingReportForm = ({
  findingReport,
}: AddFindingReportFormProps) => {
  const router = useRouter();
  const [findingReportData, setFindingReportData] = useState(findingReport);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      findingDesc: findingReportData?.findingDesc || "",
      actionToTake: findingReportData?.actionToTake || "",
      actionInmediate: findingReportData?.actionInmediate || "",
      proposedClosureDate: findingReportData?.proposedClosureDate || null,
      actualClosureDate: findingReportData?.actualClosureDate || null,
      typeAction: findingReportData?.typeAction || "CORRECTIVE",
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const { setValue, setError, watch, getValues } = form;

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
          await axios.patch(`/api/finding-report/${findingReport?.id}`, values);

          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setIsLoading(false);
        }
      }, 1000),
    [findingReport, router, setIsLoading]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      debouncedSave(values as any);
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
    <div className=" max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden">
      <div className="relative grid lg:grid-cols-3 gap-1 max-h-fit">
        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm bg-white/30">
            <Loader2 className="w-7 h-7 animate-spin text-primary fade-in-5" />
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="items-center mt-1 w-full grid grid-cols-2 gap-2 bg-slate-100 rounded-md p-3 col-span-3 "
          >
            <div className="col-span-2">
      <span className="text-xs text-slate-400">
        id: {findingReportData?.id}
      </span>
              <TextAreaForm
                control={form.control}
                label="Descripción del Hallazgo"
                name="findingDesc"
              />
            </div>
            <div className="w-full flex col-span-2 gap-2">
              <div>
                <FormField
                  control={form.control}
                  name="typeAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de acción</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-fit">
                            <SelectValue placeholder="Selecciona un tipo de acción" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="CORRECTIVE">Corrección</SelectItem>
                          <SelectItem value="IMPROVEMENT">Mejora</SelectItem>
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full flex gap-1">
                <TextAreaForm
                  control={form.control}
                  label="Correción"
                  name="actionInmediate"
                />

                <TextAreaForm
                  control={form.control}
                  label="Acción correctiva"
                  name="actionToTake"
                />
              </div>
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
          </form>
        </Form>
      </div>

      <div className="grid md:grid-cols-2 p-4 gap-3 bg-slate-300 my-2 rounded-md">
        <h2 className="text-center text-2xl md:col-span-2 text-primary font-bold ">
          Evidencia
        </h2>
        <UploadImageForm
          apiUrl="/api/upload/file"
          field="imgUrl"
          file={`${findingReport?.imgUrl}`}
          label="Registro fotográfico"
          ubiPath="control/images"
          update={`/api/finding-report/${findingReport?.id}/`}
        />
        <div>
          <FieldUpdateForm
            field="imgDescription"
            apiUrl={`/api/finding-report`}
            label="Detalles del hallazgo"
            id={findingReport?.id}
            value={findingReport?.imgDescription}
            defaultOpenUpdate={true}
            isTextArea
          />
        </div>

        <Separator className="w-full md:col-span-2 h-2 bg-primary" />

        <div className="md:col-span-2">
          <UploadImageForm
            apiUrl="/api/upload/file"
            field="closingEvidence"
            file={`${findingReport?.closingEvidence}`}
            label="Evidencia de cierre"
            ubiPath="control/images"
            update={`/api/finding-report/${findingReport?.id}/`}
          />
        </div>
      </div>
    </div>
  );
};
