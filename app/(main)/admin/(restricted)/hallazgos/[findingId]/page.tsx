import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { db } from "@/lib/db";
import { AddFindingReportForm } from "../_components/add-finding-report-form";
import { ChangeStatusFinding } from "../_components/change-status-finding";
import { ChangeLevelFinding } from "../_components/change-level-finding";
import { cn } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

const bcrumb = [
  { label: "Hallazgo", path: "/admin/hallazgos" },
  { label: "Editar", path: "/admin/editar" },
];

const CreateControllerPage = async ({
  params,
}: {
  params: { findingId: string };
}) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div>Usuario no autorizado</div>;
  }
  const findingReport = await db.findingReport.findUnique({
    where: {
      id: params.findingId,
      // active: true,
    },
    include: {
      controlReport: {
        include: {
          contractor: {
            select: {
              name: true,
            },
          },
          businessArea: {
            select: {
              name: true,
            },
          },
        },
      },
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

  const aspects = await db.securityQuestion.findMany({
    where: {
      active: true,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
      checklistItems: {
        where: {
          controlReportId: findingReport.controlReport?.id,
        },
      },
    },
  });

  const controllers = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage
          text={`Editar hallazgo`}
          bcrumb={bcrumb}
          className={cn(
            findingReport.findingLevel === "HIGH"
              ? "bg-red-400"
              : findingReport.findingLevel === "MEDIUM"
              ? "bg-yellow-300"
              : "bg-slate-300"
          )}
        >
          <div className="flex gap-1">
            <ChangeStatusFinding
              id={findingReport.id}
              status={findingReport.status}
            />
            <ChangeLevelFinding
              id={findingReport.id}
              level={findingReport.findingLevel || "LOW"}
              findingReport={findingReport}
            />
          </div>
        </TitleOnPage>
      }
    >
      <AddFindingReportForm
        findingReport={findingReport}
        contractors={contractors}
        businessAreas={businessAreas}
        aspects={aspects}
        controllers={controllers}
        // actualUserId={session.user.id}
      />
    </CardPage>
  );
};

export default CreateControllerPage;
