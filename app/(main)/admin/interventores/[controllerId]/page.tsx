import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { AddControllerForm } from "../_components/add-controller-form";
import { DeleteUserController } from "../_components/delete-user-controller";

const bcrumb = [
  { label: "Interventores", path: "/admin/interventores" },
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

  const cities = await db.city.findMany({
    where: {
      active: true,
    },
    orderBy: {
      realName: "desc",
    },
  });

  const companies = await db.company.findMany({
    where: {
      active: true,
    },
  });

  if (!controller) {
    return <CardPage>Interventor no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar Interventor`} bcrumb={bcrumb}>
          <DeleteUserController controller={controller} />
        </TitleOnPage>
      }
    >
      <AddControllerForm
        cities={cities}
        companies={companies}
        controller={controller}
      />
    </CardPage>
  );
};

export default CreateControllerPage;
