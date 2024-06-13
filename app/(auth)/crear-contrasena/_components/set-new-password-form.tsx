"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { PasswordResetToken } from "@prisma/client";
import { InputForm } from "@/components/input-form";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Banner } from "@/components/banner";
import { useLoading } from "@/components/providers/loading-provider";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const formSchema = z
  .object({
    password: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
    repeatPassword: z.string().min(5, {
      message: "digite al menos 5 caracteres",
    }),
  })
  .superRefine(({ repeatPassword, password }, ctx) => {
    if (repeatPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
      });
    }
  });

export const SetNewPasswordForm = ({
  token,
  invalidToken,
  messageError,
}: {
  token: string;
  invalidToken: boolean;
  passwordResetToken: PasswordResetToken | null;
  messageError?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [wasSend, setWasSend] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  const [msg, setMsg] = useState<string>();
  const [tokenInvalid, setTokenInvalid] = useState<boolean>();

  const router = useRouter();
  const toggleEdit = () => setIsEditing((current) => !current);
  const { setLoadingApp } = useLoading();

  useEffect(() => {
    setLoadingApp(true);
    setTokenInvalid(invalidToken);
    setMsg(messageError);
    setLoadingApp(false);
  }, [invalidToken, messageError, setLoadingApp]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "", repeatPassword: "" },
  });
  const { isSubmitting, isValid } = form.formState;
  const { watch } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    try {
      const { data } = await axios.post(
        `/api/user/recover-password/${token}`,
        values
      );

      setWasSend(true);
      router.push("/");
      toast.success("Contraseña creada correctamente, inicie sesión",{closeButton: true, duration: 10000});
      toggleEdit();
    } catch (error) {
      toast.error(
        "Ocurrió un error inesperado, por favor intentelo nuevamente"
      );
      console.log("errorr", error);
    } finally {
      setIsEditing(false);
      form.reset();
    }
  };

  return (
    <Card className="flex flex-col items-center w-full max-w-[400px]">
      <CardHeader>
        <h2 className="font-bold text-xl"> Ingresar nueva contraseña</h2>
        {!!msg && <Banner variant="danger" label={msg} />}
        {wasSend && !!!msg && (
          <Banner
            variant="success"
            label={"Contraseña cambiada correctamente, ya puede iniciar sesión"}
          />
        )}
      </CardHeader>
      <CardContent>
        {(wasSend && !!!msg) || !!msg ? (
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "font-medium dark:text-blue-500"
            )}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar al inicio de sesión
          </Link>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-4 w-full "
            >
              <div>
                {!tokenInvalid && (
                  <div className="space-y-3">
                    <div>
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem className="relative">
                            <FormLabel
                              className="font-semibold"
                              htmlFor="password"
                            >
                              Nueva contraseña
                            </FormLabel>

                            <FormControl>
                              <Input
                                id="password"
                                type={viewPass ? "text" : "password"}
                                disabled={isSubmitting || tokenInvalid}
                                {...field}
                              />
                            </FormControl>
                            {watch().password.length > 0 &&
                              (!viewPass ? (
                                <Eye
                                  className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                                  onClick={() => setViewPass(true)}
                                />
                              ) : (
                                <EyeOff
                                  className="w-5 h-5 absolute bottom-3 right-3 text-primary"
                                  onClick={() => setViewPass(false)}
                                />
                              ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* repeatpassword */}
                    <div>
                      <InputForm
                        control={form.control}
                        isSubmitting={isSubmitting}
                        disabled={tokenInvalid}
                        label="Repetir nueva contraseña"
                        name="repeatPassword"
                        type="password"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* <Link href="/dashboard" className="w-full">
      Entrar
    </Link> */}
              {!tokenInvalid && (
                <Button disabled={!isValid || isSubmitting} className="w-full">
                  {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Guardar contraseña
                </Button>
              )}
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};
