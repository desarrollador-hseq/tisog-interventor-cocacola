import React from "react";
import { AtSign } from "lucide-react";
import { CardPage } from "@/components/card-page";

import { db } from "@/lib/db";
import { HeaderForm } from "../_components/header-form";
import { TitleOnPage } from "@/components/title-on-page";

const CreateAts = async () => {
  const businessAreas = await db.businessAreas.findMany({
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
    <CardPage pageHeader={<TitleOnPage text="Crear Reporte de control" />}>
      <HeaderForm areas={businessAreas} contractors={contractors} />
    </CardPage>
  );
};

export default CreateAts;
