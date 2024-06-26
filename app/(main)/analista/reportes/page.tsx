import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { CardPage } from "@/components/card-page";
import { buttonVariants } from "@/components/ui/button";
import { TitleOnPage } from "@/components/title-on-page";
import { authOptions } from "@/lib/auth-options";
import { TableDefault } from "@/components/table-default";
import { controlReportColumns } from "./_components/control-report-columns";
import { db } from "@/lib/db";
import { ControlTable } from "./_components/control-table";

const ControlPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/login");
  }

  const controlReports = await db.controlReport.findMany({
    where: {
      active: true,
      controllerId: session.user.id,
    },
    // include: {
    // businessArea: {
    //   select: {
    //     name: true,
    //   },
    // },
    // contractor: {
    //   select: {
    //     name: true,
    //   },
    // },
    // findingReport: {
    //   select: {
    //     id: true,
    //   },
    // },
    // },
    orderBy: {
      date: "desc",
    },
  });

  return (
    <CardPage
      className="p-0"
      pageHeader={
        <TitleOnPage text="Reportes de control">
          <Link
            href={"/analista/reportes/crear"}
            className={cn(buttonVariants())}
          >
            Crear
          </Link>
        </TitleOnPage>
      }
    >
      <ControlTable
        data={controlReports}
        columns={controlReportColumns}
        editHref={{
          btnText: "editar",
          href: `/analista/reportes/`,
        }}
      />
    </CardPage>
  );
};

export default ControlPage;
