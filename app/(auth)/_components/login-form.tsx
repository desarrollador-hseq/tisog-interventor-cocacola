"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

const formSchema = z.object({
  email: z.string().min(1, {
    message: "Correo electrónico es requerido",
  }),
  password: z.string().min(5, {
    message: "digite al menos 5 caracteres",
  }),
});

export const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isEditing, setIsEditing] = useState(false);
  const [viewPass, setViewPass] = useState(false);

  const redirect = searchParams.get("redirect");

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsEditing(true);
    setViewPass(false);
    try {
      const signInResponse = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: !!redirect ? `${redirect}` : "/",
      });

      if (!signInResponse || signInResponse.ok !== true) {
        return toast.error("Correo electrónico y/o Contraseña incorrectos", {
          description: "Por favor revisa los datos ingresados",
          position: "bottom-center",
        });
      }

      if (redirect) {
        router.push(redirect.toString());
      } else {
        router.push("/"); // Si no hay redirección específica, ir a la página principal
      }

      router.refresh();
      toast.success("Bienvenido");
      toggleEdit();
    } catch (error) {
      toast.error("Something went wrong");
      console.log("errorr", error);
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <div className=" relative mt-3 bg-blue-900 border border-slate-600 rounded-md shadow-md flex text-white">
      <div className="p-4 sm:p-7 min-w-[400px] min-h-[400px] flex flex-col justify-center">
        <div className="text-center">
          <h1 className="block text-2xl font-bold text-white">
            Iniciar sesión
          </h1>
        </div>

        <div className="mt-5">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-y-4 space-y-3"
            >
              <div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="Correo electrónico"
                          className="h-14 bg-blue-200 shadow-inner placeholder:text-slate-800 text-slate-800"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="relative">
                      <FormControl>
                        <Input
                          type={viewPass ? "text" : "password"}
                          className="relative h-14 bg-blue-200 shadow-inner placeholder:text-slate-800 text-slate-8000"
                          disabled={isSubmitting}
                          placeholder="•••••••••"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      {field.value && (
                        <div
                          onClick={() => setViewPass(!viewPass)}
                          className="absolute top-2.5 right-2 "
                        >
                          {!viewPass ? (
                            <Eye className="w-5 h-5" />
                          ) : (
                            <EyeOff className="w-5 h-5" />
                          )}
                        </div>
                      )}
                      <FormMessage />
                      <FormDescription>
                        {/* <Link
                          href="/recuperar-contrasena"
                          className="w-full block text-sm text-blue-200 decoration-2 hover:underline font-medium text-end"
                        >
                          Olvidé la contraseña
                        </Link> */}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                disabled={!isValid || isSubmitting}
                className="w-full bg-blue-400 hover:bg-blue-500 disabled:cursor-not-allowed"
              >
                {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                Entrar
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
