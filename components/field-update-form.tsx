"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Pencil, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputForm } from "@/components/input-form";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface FieldUpdateFormProps {
  value?: string | null;
  field: string;
  label: string;
  id?: string;
  disabled?: boolean;
  apiUrl: string;
  isAdd?: boolean;
}

export const FieldUpdateForm = ({
  value,
  field,
  id,
  apiUrl,
  label,
  disabled,
  isAdd = false
}: FieldUpdateFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const toggleEdit = () => setIsEditing((current) => !current);

  const formSchema = z.object({
    [`${field}`]: z.string().min(1, {
      message: `${label} es requerido`,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { [`${field}`]: value || "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log({values});
    if (!id || disabled) return;
    setLoadingApp(true);
    try {
      if(isAdd) {
        console.log({isAdd});
        await axios.post(`${apiUrl}/${id}`, values);
        toast.success(`${label} creado correctamente`);
      } else {

        await axios.patch(`${apiUrl}/${id}`, values);
        toast.success(`${label} actualizado correctamente`);
      }
      toggleEdit();
        router.refresh();
      //   router.push(pathname);
    } catch {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
    } finally {
      setLoadingApp(false);
    }
  };

  return (
    <Card className={`mt-1 border ${disabled ? "bg-slate-50" : "bg-blue-50"} p-1  relative`}>
      <CardHeader className="p-1">
        <div className="font-medium flex items-center justify-center ">
          <span className="font-bold">{label}</span>
          {!disabled && (
            <Button
              className={cn(
                "text-white hover:text-white p-1 h-6 rounded-none absolute top-0 right-0 rounded-bl-md shadow-md",
                isEditing
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-secondary/80 hover:bg-secondary"
              )}
              onClick={toggleEdit}
              variant="ghost"
            >
              {isEditing ? (
                <>
                  <X className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Pencil className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-1">

      {!isEditing && <p className="text-sm mt-2 text-center">{value}</p>}
      {isEditing && !disabled && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <InputForm control={form.control} label="" name={field} />

            <div className="flex items-center justify-end gap-x-2 w-full">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Actualizar
              </Button>
            </div>
          </form>
        </Form>
      )}
      </CardContent>

    </Card>
  );
};