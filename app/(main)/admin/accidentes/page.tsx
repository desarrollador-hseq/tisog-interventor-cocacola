import Link from "next/link";
// import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { accidentTableColumns } from "./_components/accidents-table-columns";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const bcrumb = [{ label: "Accidentes", path: "/admin/accidentes" }];

const AccidentsPage = async () => {
  const accidents = await db.accidents.findMany({
    where: {
      active: true,
    },
    include: {
      contractor: {
        select: {
          name: true,
        }
      },
      area: {
        select: {
          name: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });


  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de accidentes" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={`/admin/accidentes/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={accidents}
        columns={accidentTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/accidentes` }}
      />
    </CardPage>
  );
};

export default AccidentsPage;
