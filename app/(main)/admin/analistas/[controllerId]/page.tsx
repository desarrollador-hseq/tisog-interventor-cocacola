import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { AddControllerForm } from "../_components/add-controller-form";
import { DeleteUserController } from "../_components/delete-user-controller";

const bcrumb = [
  { label: "Analistas", path: "/admin/analistas" },
  { label: "Editar", path: "/admin/editar" },
];

const CreateControllerPage = async ({
  params,
}: {
  params: { controllerId: string };
}) => {
  const controller = await db.user.findUnique({
    where: {
      id: params.controllerId,
      role: "USER",
    },
  });

  if (!controller) {
    return <CardPage>Analista no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar analista`} bcrumb={bcrumb}>
          <DeleteUserController controller={controller} />
        </TitleOnPage>
      }
    >
      <AddControllerForm controller={controller} />
    </CardPage>
  );
};

export default CreateControllerPage;
