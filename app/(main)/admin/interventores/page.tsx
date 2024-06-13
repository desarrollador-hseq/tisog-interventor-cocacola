// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { userTableColumns } from "./_components/user-table-columns";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const bcrumb = [{ label: "interventores", path: "/admin/empresas" }];

const ControllersPage = async () => {
  const users = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
    },
    include: {
      contractor: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de interventores" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/interventores/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={users}
        columns={userTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/interventores` }}
      />
    </CardPage>
  );
};

export default ControllersPage;
