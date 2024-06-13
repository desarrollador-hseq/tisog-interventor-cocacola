import { getServerSession } from "next-auth";
import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";



import { cn } from "@/lib/utils";
import { CardPage } from "@/components/card-page";
// import { ButtonCreateAts } from "./_components/button-create-ats";
import { buttonVariants } from "@/components/ui/button";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/auth-options";
import { findingReportColumns } from "./_components/finding-report-columns";

const ControlPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/login");
  }

  return (
    <CardPage>
      <TitleOnPage text="Analisis de trabajo seguro">
        {/* <Link
          className={cn(buttonVariants())}
          href={`/dashboard/analisis-de-trabajo-seguro/`}
        >
          Crear
        </Link> */}
        {/* <ButtonCreateAts /> */}
        <Link
          href={"/dashboard/analisis-de-trabajo-seguro/crear"}
          className={cn(buttonVariants())}
        >
          Crear
        </Link>
      </TitleOnPage>

      {/* <TableDefault
        columns={findingReportColumns}
        data={findingReports}
        editHref={{
          btnText: "editar",
          href: `/dashboard/analisis-de-trabajo-seguro/`,
        }}
      /> */}
    </CardPage>
  );
};

export default ControlPage;
