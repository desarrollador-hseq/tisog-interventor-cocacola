import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddFindingReportForm } from "../_components/add-finding-report-form";

const bcrumb = [
  { label: "Hallazgo", path: "/admin/hallazgos" },
  { label: "Editar", path: "/admin/editar" },
];

const CreateControllerPage = async ({
  params,
}: {
  params: { findingId: string };
}) => {
  const findingReport = await db.findingReport.findUnique({
    where: {
      id: params.findingId,
      active: true,
    },
    include: {
      controlReport: true,
    },
  });

  if (!findingReport) {
    return <CardPage>Hallazgo no encontrado</CardPage>;
  }

  const contractors = await db.contractor.findMany({
    where: {
      active: true,
    },
  });
  const businessAreas = await db.businessAreas.findMany({
    where: {
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage text={`Editar hallazgo`} bcrumb={bcrumb}>
          {/* <DeleteUserController controller={controller} /> */}
        </TitleOnPage>
      }
    >
      <AddFindingReportForm
        findingReport={findingReport}
        contractors={contractors}
        businessAreas={businessAreas}
      />
    </CardPage>
  );
};

export default CreateControllerPage;
