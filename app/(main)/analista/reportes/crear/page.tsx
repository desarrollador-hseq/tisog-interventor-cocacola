import React from "react";
import { AtSign } from "lucide-react";
import { CardPage } from "@/components/card-page";

import { db } from "@/lib/db";
import { ControlHeaderForm } from "../_components/control-header-form";
import { TitleOnPage } from "@/components/title-on-page";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const CreateAts = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Usuario no autorizado</div>;
  }
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
  const controllers = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
    },
  });

  return (
    <CardPage pageHeader={<TitleOnPage text="Crear Reporte de control" />}>
      <ControlHeaderForm
        areas={businessAreas}
        contractors={contractors}
        controllers={controllers}
        actualUserId={session.user.id}
      />
    </CardPage>
  );
};

export default CreateAts;
