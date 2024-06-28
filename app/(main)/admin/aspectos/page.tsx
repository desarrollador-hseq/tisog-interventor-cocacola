import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { aspectsTableColumns } from "./_components/aspects-table-columns";
import { SimpleModal } from "@/components/simple-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddCategoryAspectForm } from "./_components/add-category-aspect-form";
import { Edit2 } from "lucide-react";
import { DeleteCategoryAspect } from "./_components/delete-category-aspect";

const bcrumb = [{ label: "Aspectos", path: "/admin/aspectos" }];

const AspectPage = async () => {
  const aspects = await db.securityQuestion.findMany({
    where: {
      active: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const categories = await db.securityCategory.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Listado de aspectos" bcrumb={bcrumb}>
          <Link className={cn(buttonVariants())} href={`/admin/aspectos/crear`}>
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={aspects}
        columns={aspectsTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/aspectos/editar` }}
        deleteHref={`/api/aspects/`}
        nameDocument="aspectos"
      />

      <SimpleModal
        title={<TitleOnPage text="Categorias de aspectos" />}
        large
        textBtn="gestionar categorias de los aspectos"
      >
        <CardPage
          className="border-none shadow-none"
          pageHeader={
            <SimpleModal
              title={<TitleOnPage text="Agregar tipo de aspecto" />}
              textBtn="Agregar"
              btnClass="w-fit"
            >
              <AddCategoryAspectForm />
            </SimpleModal>
          }
        >
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-medium flex gap-2">
                    <SimpleModal
                      btnClass="p-1 h-auto bg-slate-400 hover:bg-slate-600"
                      textBtn={<Edit2 className="w-4 h-4 " />}
                      title={<TitleOnPage text="Editar la categoria" />}
                    >
                      <AddCategoryAspectForm category={category} />
                    </SimpleModal>
                    <DeleteCategoryAspect category={category} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardPage>
      </SimpleModal>
    </CardPage>
  );
};

export default AspectPage;
