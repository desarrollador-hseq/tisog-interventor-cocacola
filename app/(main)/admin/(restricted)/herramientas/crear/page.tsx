import { TypeTool } from "@prisma/client";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { AddtoolForm } from "../_components/add-tool-form";
import { db } from "@/lib/db";

const bcrumb = [
  { label: "Herramientas", path: "/admin/herramientas" },
  { label: "Agregar", path: "/admin/agregar" },
];

const CreateToolPage = async () => {
  const typeTools = await db.typeTool.findMany({
    where: {
      active: true,
    },
  });

 

  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar herramienta" bcrumb={bcrumb} />}
    >
      <AddtoolForm typeTools={typeTools} />
    </CardPage>
  );
};

export default CreateToolPage;
