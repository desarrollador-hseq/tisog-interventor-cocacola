"use client";
import React from "react";
import { useSearchParams } from "next/navigation";

import { LogoMain } from "@/components/logo-main";
import { LoginForm } from "./_components/login-form";

const LoginPage = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  return (
    <div className="bg-slate-5 h-screen ">
      <div className="relative p-1 h-[150px] max-h-[150px] w-full flex items-end">
        <div className="mx-auto w-full max-w-[1500px] mt-1 flex justify-center">
          <div className="mx-3 flex flex-col items-center">
            <div className="p-2 flex gap-1 bg-white">
              <LogoMain width={120} height={120} />
            </div>
            <span className="text-lg font-bold p-2 w-full flex items-center justify-center">
              Interventor
            </span>
          </div>
        </div>
      </div>
      <div className="container w-full flex flex-col items-center justify-start h-fit">
        <div className="mb-4">{/* <TitleApp /> */}</div>
        {!!redirect && (
          <h3 className="font-bold text-lg text-blue-600">
            ¡Hola! Parece que necesitas iniciar sesión para continuar.
          </h3>
        )}

        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
