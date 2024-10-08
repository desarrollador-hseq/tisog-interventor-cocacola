import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { EditControlReport } from "../_components/edit-control-report";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { EditFindingReportForm } from "../_components/edit-finding-report";
import { ControlHeaderForm } from "../_components/control-header-form";

const EditControlPage = async ({
  params,
}: {
  params: { controlId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    redirect("/auth/login");
  }

  const { controlId } = params;

  const control = await db.controlReport.findUnique({
    where: {
      id: controlId,
    },
    include: {
      findingReport: {
        include: {
          controlReport: true,
        },
      },
    },
  });

  if (!control) {
    return <div>no analisis</div>;
  }

  const tools = await db.tool.findMany({
    where: {
      controlReportId: control.id,
    },
    include: {},
  });

  const toolDefaults = await db.defaultTool.findMany({
    where: {
      active: true,
    },
    include: {
      typeTool: {
        select: {
          name: true,
        },
      },
    },
  });

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
          controlReportId: control.id,
        },
      },
    },
    orderBy: {
      category: {
        num: "asc",
      },
    },
  });

  const controllers = await db.user.findMany({
    where: {
      role: "USER",
      active: true,
    },
  });

  return (
    <CardPage
      pageHeader={
        <TitleOnPage
          text={
            <div className="">
              <h1 className="text-3xl">Reporte de control</h1>
              <div className="text-[10px] font-normal">
                <span className="font-bold">Id:</span> {control.id}
              </div>
            </div>
          }
        ></TitleOnPage>
      }
    >
      {control.source === "checklist" ? (
        <EditControlReport
          companyId=""
          control={control!}
          contractors={contractors}
          controllers={controllers}
          aspects={aspects}
          areas={businessAreas}
          //   areas={businessAreas.map((area) => area)}
          tools={tools}
          toolDefaults={toolDefaults}
          defaultsToolsWithType={toolDefaults}
          disabled={false}
          isAdmin={session.user.role === "ADMIN"}
        />
      ) : (
        <>
          <ControlHeaderForm
            contractors={contractors}
            control={control}
            isAdmin={false}
            areas={businessAreas}
            controllers={controllers}
            disabled={false}
          />
          {control.findingReport[0] ? (
            <EditFindingReportForm findingReport={control.findingReport[0]} />
          ) : (
            <div className="text-lg font-bold text-red-600">
              Reporte de hallazgo asociado no encontrado!
            </div>
          )}
        </>
      )}
    </CardPage>
  );
};

export default EditControlPage;
