import { TypeTool } from "@prisma/client";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";

import { db } from "@/lib/db";
import { AddAspectForm } from "../_components/add-aspect-form";

const bcrumb = [
  { label: "Aspectos", path: "/admin/aspectos" },
  { label: "Agregar", path: "/admin/agregar" },
];

const CreateToolPage = async () => {
  const categories = await db.securityCategory.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={<TitleOnPage text="Agregar aspecto" bcrumb={bcrumb} />}
    >
      <AddAspectForm categories={categories} />
    </CardPage>
  );
};

export default CreateToolPage;
