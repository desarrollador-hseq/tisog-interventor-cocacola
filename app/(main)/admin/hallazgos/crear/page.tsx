import Link from "next/link";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AddControllerForm } from "../_components/add-controller-form";

const bcrumb = [
  { label: "analistas", path: "/admin/analistas" },
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

  return (
    <CardPage
      pageHeader={<TitleOnPage text={`Agregar analista`} bcrumb={bcrumb} />}
    >
      <AddControllerForm />
    </CardPage>
  );
};

export default CreateSupervisorPage;
