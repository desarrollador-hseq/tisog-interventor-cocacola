import { db } from "@/lib/db";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";

import { AddCompanyForm } from "../_components/add-company-form";
import { DeleteCompany } from "../_components/delete-company";

const bcrumb = [
  { label: "Empresas", path: "/admin/empresas" },
  { label: "Editar", path: "/admin/editar" },
];

const EditCompanyPage = async ({
  params,
}: {
  params: { companyId: string };
}) => {
  const company = await db.company.findUnique({
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

  if (!company) {
    return <CardPage>Empresa no encontrada</CardPage>;
  }

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text="Editar empresa" bcrumb={bcrumb}>
          <DeleteCompany company={company} />
        </TitleOnPage>
      }
    >
      <AddCompanyForm cities={cities} company={company} />
    </CardPage>
  );
};

export default EditCompanyPage;
