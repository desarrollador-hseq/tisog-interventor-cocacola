// import { CardPage } from "@/components/card-page";
import Link from "next/link";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { userTableColumns } from "./_components/user-table-columns";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bcrumb = [{ label: "analistas", path: "/admin/empresas" }];

const ControllersPage = async () => {
  const users = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de analistas" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/analistas/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={users}
        columns={userTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/analistas` }}
        nameDocument="analistas"
      />
    </CardPage>
  );
};

export default ControllersPage;
