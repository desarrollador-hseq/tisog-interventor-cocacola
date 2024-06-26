import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TableDefault } from "@/components/table-default";
import { TitleOnPage } from "@/components/title-on-page";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { toolsTableColumns } from "./_components/tools-table-columns";
import { SimpleModal } from "@/components/simple-modal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddTypeToolForm } from "./_components/add-typetool-form";
import { Edit2, Trash2 } from "lucide-react";
import { DeleteTypeTool } from "./_components/delete-type-tool";

const bcrumb = [{ label: "Herramientas", path: "/admin/herramientas" }];

const ToolPage = async () => {
  const tools = await db.defaultTool.findMany({
    where: {
      active: true,
    },
    include: {
      typeTool: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const toolTypes = await db.typeTool.findMany({
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
        <TitleOnPage text="Listado de herramientas" bcrumb={bcrumb}>
          <Link
            className={cn(buttonVariants())}
            href={`/admin/herramientas/crear`}
          >
            Agregar
          </Link>
        </TitleOnPage>
      }
    >
      <TableDefault
        data={tools}
        columns={toolsTableColumns}
        editHref={{ btnText: "Editar", href: `/admin/herramientas/editar` }}
        deleteHref={`/api/tools/`}
      />

      <SimpleModal
        title={<TitleOnPage text="Tipos de herramientas" />}
        large
        textBtn="gestionar tipos de herramientas"
      >
        <CardPage
          className="border-none shadow-none"
          pageHeader={
            <SimpleModal
              title={<TitleOnPage text="Agregar tipo de herramienta" />}
              textBtn="Agregar"
              btnClass="w-fit"
            >
              <AddTypeToolForm />
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
              {toolTypes.map((toolType) => (
                <TableRow key={toolType.id}>
                  <TableCell className="font-medium">{toolType.name}</TableCell>
                  <TableCell className="font-medium flex gap-2">
                    <SimpleModal
                      btnClass="p-1 h-auto bg-slate-400 hover:bg-slate-600"
                      textBtn={<Edit2 className="w-4 h-4 " />}
                      title={<TitleOnPage text="Editar tipo de herramienta" />}
                    >
                      <AddTypeToolForm typeTool={toolType} />
                    </SimpleModal>
                    <DeleteTypeTool typeTool={toolType} />
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

export default ToolPage;
