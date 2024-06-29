import React from "react";
import Link from "next/link";
// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { userTableColumns } from "./_components/user-table-columns";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";

const bcrumb = [{ label: "Usuarios", path: "/admin/usuarios" }];

const UsersPage = async () => {
  const users = await db.user.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de usuarios" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/usuarios/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={users}
        columns={userTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/usuarios` }}
        nameDocument="usuarios"
      />
    </CardPage>
  );
};

export default UsersPage;
