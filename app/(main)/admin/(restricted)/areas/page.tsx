import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { SimpleModal } from "@/components/simple-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddAreaForm } from "./_components/add-area-form";
import { db } from "@/lib/db";
import { Edit2 } from "lucide-react";
import { DeleteArea } from "./_components/delete-area";

const AreasPage = async () => {
  const areas = await db.businessAreas.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div>
      <CardPage className="border-none shadow-none p-0">
        <TitleOnPage text="Listado de Áreas">
          <SimpleModal
            title={<TitleOnPage text="Agregar Área" />}
            textBtn="Agregar"
            btnClass="w-fit"
          >
            <AddAreaForm />
          </SimpleModal>
        </TitleOnPage>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areas.map((area) => (
              <TableRow key={area.id}>
                <TableCell className="font-medium">{area.name}</TableCell>

                <TableCell className="font-medium flex gap-2">
                  <SimpleModal
                    btnClass="p-1 h-auto bg-slate-400 hover:bg-slate-600"
                    textBtn={<Edit2 className="w-4 h-4 " />}
                    title={<TitleOnPage text="Editar la categoria" />}
                  >
                    <AddAreaForm businessArea={area} />
                  </SimpleModal>
                  <DeleteArea businessArea={area} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardPage>
    </div>
  );
};

export default AreasPage;
