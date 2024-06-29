import { DeleteAspect } from "../../_components/delete-aspect";
import { TitleOnPage } from "@/components/title-on-page";
import { CardPage } from "@/components/card-page";
import { db } from "@/lib/db";
import { AddAspectForm } from "../../_components/add-aspect-form";

const bcrumb = [
  { label: "Aspectos", path: "/admin/aspectos" },
  { label: "Editar", path: "/admin/editar" },
];

const EditToolPage = async ({ params }: { params: { questionId: string } }) => {
  const aspect = await db.securityQuestion.findUnique({
    where: {
      id: params.questionId,
      active: true,
    },
  });

  const categories = await db.securityCategory.findMany({
    where: {
      active: true,
    },
  });

  if (!aspect) {
    return <CardPage>Pregunta no encontrada</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar aspecto" bcrumb={bcrumb}>
          <DeleteAspect aspect={aspect} />
        </TitleOnPage>
      }
    >
      <AddAspectForm aspect={aspect} categories={categories} />
    </CardPage>
  );
};

export default EditToolPage;
