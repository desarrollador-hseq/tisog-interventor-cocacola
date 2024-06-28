"use client";

import { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { useLoading } from "@/components/providers/loading-provider";

interface CheckReceiveNotificationsProps {
  id: string;
  check: boolean;
}

const formSchema = z.object({
  receiveNotifications: z.boolean().default(false),
});

export const CheckReceiveNotifications = ({
  id,
  check,
}: CheckReceiveNotificationsProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();

  const [isChecked, setIsChecked] = useState(check);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiveNotifications: check,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoadingApp(true);
    try {
      const { data } = await axios.patch(`/api/user/${id}`, values);
      if (data) {
        if (data.receiveNotifications) {
          toast.success(
            "Ahora recibirás correos de notificación de reportes críticos"
          );
        } else {
          toast.info(
            "Ya no recibirás correos de notificación de reportes críticos"
          );
        }
      }

      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoadingApp(false);
    }
  };

  return (
    <div className="border bg-slate-100 rounded-md p-4 shadow-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="receiveNotifications"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center gap-2 mt-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(newValue) => {
                      field.onChange(newValue);
                      form.handleSubmit(onSubmit)();
                    }}
                    className="mt-2"
                  />
                </FormControl>
                <p
                  onClick={() => {
                    setIsChecked(!isChecked);
                    form.setValue("receiveNotifications", !isChecked);
                    form.handleSubmit(onSubmit)();
                  }}
                  className={`mt-0 cursor-pointer ${
                    isChecked ? "text-primary" : "text-slate-600"
                  }`}
                >
                  {isChecked
                    ? "Recibir notificaciones de reportes críticos"
                    : "No recibir notificaciones de reportes críticos"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};
