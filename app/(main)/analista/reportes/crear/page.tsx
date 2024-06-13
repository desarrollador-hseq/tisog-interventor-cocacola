import { AtSign } from "lucide-react";
import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { CardPage } from "@/components/card-page";
import { TitleIcon } from "@/components/title-icon";
import { AtsHeaderForm } from "../[jobAnalysisId]/_components/ats-header-form";
import { db } from "@/lib/db";
import { getCompany } from "@/actions/user/get-company";

const CreateAts = async () => {
  const company = await getCompany();

  if (!company) {
    redirect("/auth/login");
  }

  const businessAreas = await db.businessAreas.findMany({
    where: {
      companyId: company.id,
      active: true,
    },
  });

  console.log({businessAreas})

  return (
    <div>
      <TitleIcon icon={AtSign} text="df" />

      <CardPage>
        <AtsHeaderForm areas={businessAreas} companyId={company.id} />
      </CardPage>
    </div>
  );
};

export default CreateAts;
