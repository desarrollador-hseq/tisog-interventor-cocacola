// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { contractorTableColumns } from "./_components/contractor-table-columns";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";

const bcrumb = [{ label: "Empresas", path: "/admin/empresas" }];

const ContractorPage = async () => {
  const companies = await db.contractor.findMany({
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
        <TitleOnPage text="Listado de contratistas" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/contratistas/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={companies}
        columns={contractorTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/contratistas` }}
        nameDocument="contratistas"
      />
    </CardPage>
  );
};

export default ContractorPage;
