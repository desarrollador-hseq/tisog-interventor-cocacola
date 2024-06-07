// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { companyTableColumns } from "./_components/company-table-columns";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";

const bcrumb = [{ label: "Empresas", path: "/admin/empresas" }];

const CompanyPage = async () => {
  const companies = await db.company.findMany({
    where: {
      active: true,
    },
    include: {
      city: {
        select: {
          realName: true,
        },
      },
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de empresas" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/empresas/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={companies}
        columns={companyTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/empresas` }}
      />
    </CardPage>
  );
};

export default CompanyPage;
