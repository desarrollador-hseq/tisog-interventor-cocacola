
import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AddCompanyForm } from "../_components/add-company-form";


const bcrumb = [
  { label: "Interventores", path: "/admin/interventores" },
  { label: "Agregar", path: "/admin/crear" },
];

const CreateSupervisorPage = async () => {
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


  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Agregar Interventor`} bcrumb={bcrumb}>
         <Link
            className={cn(buttonVariants({variant: "secondary"}))}
            href={`/admin/lideres/cargar`}
          >
            Cargar
          </Link>
        </TitleOnPage>
      }
    >
      <AddCompanyForm cities={cities}  />
    </CardPage>
  );
};

export default CreateSupervisorPage;
