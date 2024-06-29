import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";

import { AddAccidentForm } from "../_components/add-accident-form";

const bcrumb = [
  { label: "Accidentes", path: "/admin/accidentes" },
  { label: "Agregar", path: "/admin/crear" },
];

const CreateAccidentPage = async () => {
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
      pageHeader={<TitleOnPage text={`Registrar accidente`} bcrumb={bcrumb} />}
    >
      <AddAccidentForm areas={areas} contractors={contractors} />
    </CardPage>
  );
};

export default CreateAccidentPage;
