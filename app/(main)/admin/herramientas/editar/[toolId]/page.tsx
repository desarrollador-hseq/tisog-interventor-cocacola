import { AddtoolForm } from "../../_components/add-tool-form";
import { DeleteTool } from "../../_components/delete-tool";
import { TitleOnPage } from "@/components/title-on-page";
import { CardPage } from "@/components/card-page";
import { db } from "@/lib/db";

const bcrumb = [
  { label: "Herramientas", path: "/admin/herramientas" },
  { label: "Editar", path: "/admin/editar" },
];

const EditToolPage = async ({
  params,
}: {
  params: { toolId: string };
}) => {
  const tool = await db.defaultTool.findUnique({
    where: {
      id: params.toolId,
      active: true,
    },
  });

  const typeTools = await db.typeTool.findMany({
    where: {
      active: true,
    },
  });

  if (!tool) {
    return <CardPage>Herramienta no encontrada</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar herramienta" bcrumb={bcrumb}>
          <DeleteTool tool={tool} />
        </TitleOnPage>
      }
    >
      <AddtoolForm tool={tool} typeTools={typeTools} />
    </CardPage>
  );
};

export default EditToolPage;
