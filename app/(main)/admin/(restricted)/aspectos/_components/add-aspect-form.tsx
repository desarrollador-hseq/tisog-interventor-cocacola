"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
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

import { useLoading } from "@/components/providers/loading-provider";
import { SecurityCategory, SecurityQuestion } from "@prisma/client";
import { TextAreaForm } from "@/components/textarea-form";

interface AddAspectFormProps {
  aspect?: SecurityQuestion | null;
  categories: SecurityCategory[];
}

const formSchema = z.object({
  question: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  negativeQuestion: z.string().min(1, {
    message: "Nombre es requerido",
  }),
  categoryId: z.string().min(1, {
    message: "tipo es requerido",
  }),
});

export const AddAspectForm = ({ aspect, categories }: AddAspectFormProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const isEdit = useMemo(() => !!aspect, [aspect]);

  if (isEdit && !aspect) {
    toast.error("aspecto no encontrado, redirigiendo...");
    router.replace("/admin/aspectos/");
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: aspect?.question || "",
      negativeQuestion: aspect?.negativeQuestion || "",
      categoryId: aspect?.categoryId || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;
  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await axios.patch(`/api/aspects/${aspect?.id}`, values);
        toast.success("aspecto actualizado");
      } else {
        const { data } = await axios.post(`/api/aspects/`, values);
        router.push(`/admin/aspectos/`);
        toast.success("aspecto agregado correctamente");
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
            errorMessage.includes("Pregunta ya se encuentra registrada")
          ) {
            setError("question", {
              type: "manual",
              message: "Pregunta ya se encuentra registrada",
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
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white  overflow-y-hidden p-3">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-8 p-2 w-full gap-4"
        >
          <TextAreaForm
            control={form.control}
            label="Pregunta"
            name="question"
            className="w-full"
          />
          <TextAreaForm
            control={form.control}
            label="Negativo"
            name="negativeQuestion"
            className="w-full"
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-primary font-semibold">
                  Categoria:
                </FormLabel>
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
                          ? categories?.find((type) => type.id === field.value)
                              ?.name
                          : "Selecciona una categoria"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-full">
                      <CommandInput placeholder="Buscar categoria" />
                      <CommandEmpty>Categoria no encontrada</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {categories?.map((type) => (
                            <CommandItem
                              value={`${type.name}`}
                              key={type.id}
                              onSelect={() => {
                                form.setValue("categoryId", type.id, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  type.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {type.name}
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
