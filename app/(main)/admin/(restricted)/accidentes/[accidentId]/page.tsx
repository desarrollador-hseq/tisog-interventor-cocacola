import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import {
  AddAccidentForm,
} from "../_components/add-accident-form";
import { DeleteAccident } from "../_components/delete-accident";

const bcrumb = [
  { label: "Analistas", path: "/admin/analistas" },
  { label: "Editar", path: "/admin/editar" },
];

const CreateControllerPage = async ({
  params,
}: {
  params: { accidentId: string };
}) => {
  const accident = await db.accidents.findUnique({
    where: {
      id: params.accidentId,
    },
  });

  if (!accident) {
    return <CardPage>Accidente no encontrado</CardPage>;
  }

  const areas = await db.businessAreas.findMany({
    where: {
      active: true,
    },
  });
  const contractors = await db.contractor.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar accidente`} bcrumb={bcrumb}>
           <DeleteAccident accident={accident} /> 
        </TitleOnPage>
      }
    >
      <AddAccidentForm
        accident={accident}
        areas={areas}
        contractors={contractors}
      />
    </CardPage>
  );
};

export default CreateControllerPage;
