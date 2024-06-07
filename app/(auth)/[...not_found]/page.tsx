import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="w-full  min-h-[calc(100vh-60px)] flex flex-col justify-center items-center gap-1">
      <h2 className="text-4xl font-bold text-primary">
        <span className="">404 | </span> Página no encontrada
      </h2>
      <p className="text-2xl">Lo sentimos pero la ruta ingresada no existe!</p>
      <Link className={cn(buttonVariants(), "mt-4 ")} href="/">
        <ArrowLeft /> Regresar al inicio
      </Link>
    </div>
  );
}
