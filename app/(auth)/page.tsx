"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { LogoMain } from "@/components/logo-main";
import { LoginForm } from "./_components/login-form";
import { LogoCocaCola } from "@/components/logo-cocacola";
import { Separator } from "@/components/ui/separator";
import { LogoGHseq } from "@/components/logo-ghseq";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="bg-slate-5 h-screen min-h-full flex flex-col items-center justify-around p-2 ">
      <div className="relative p-2 h-fit max-h-fit flex flex-col items-center gap-2 bg-blue-200 rounded-md ">
        <div className="mx-auto w-full max-w-[1500px] mt-1 flex justify-center">
          <div className="mx-1 flex flex-co items-center rounded-md px-1">
            <LogoMain width={130} height={130} />
          </div>
        </div>
        <Separator className="w-[130px] bg-blue-800 " />

        <div className="w-full flex flex-col items-center justify-start h-fit mb-2">
          <div className="mb-2">{/* <TitleApp /> */}</div>
          {!!redirect && (
            <h3 className="font-bold text-lg text-blue-800 bg-blue-600/30 p-1 rounded-md px-6">
              ¡Hola! Parece que necesitas iniciar sesión para continuar.
            </h3>
          )}
          <LoginForm />
        </div>
        <LogoCocaCola width={100} height={100} className="bg-transparent" />
      </div>
      <div className="flex gap-1">
        <span className="font-bold text-white h-fit">by</span>
        <LogoGHseq width={80} height={80} />
      </div>
      <div />
    </div>
  );
};

export default LoginPage;
