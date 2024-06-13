import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { DeleteContractor } from "../_components/delete-contractor";
import { AddContractorForm } from "../_components/add-contractor-form";

const bcrumb = [
  { label: "Contratistas", path: "/admin/contratistas" },
  { label: "Editar", path: "/admin/editar" },
];

const EditContractorPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const contractor = await db.contractor.findUnique({
    where: {
      active: true,
      id: params.companyId,
    },
  });
  const cities = await db.city.findMany({
    where: {
      active: true,
    },
  });

  if (!contractor) {
    return <CardPage>Contratista no encontrado</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar contratista" bcrumb={bcrumb}>
          <DeleteContractor contractor={contractor} />
        </TitleOnPage>
      }
    >
      <AddContractorForm cities={cities} contractor={contractor} />
    </CardPage>
  );
};

export default EditContractorPage;
