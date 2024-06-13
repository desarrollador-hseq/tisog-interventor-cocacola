
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddContractorForm } from "../_components/add-contractor-form";

const bcrumb = [
  { label: "Contratistas", path: "/admin/contratistas" },
  { label: "Agregar", path: "/admin/crear" },
];

const CreateContractorPage = async () => {
  const cities = await db.city.findMany({
    where: {
      active: true,
    },
    orderBy: {
      realName: "desc",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Agregar contratista`} bcrumb={bcrumb}></TitleOnPage>
      }
    >
      <AddContractorForm cities={cities} />
    </CardPage>
  );
};

export default CreateContractorPage;
