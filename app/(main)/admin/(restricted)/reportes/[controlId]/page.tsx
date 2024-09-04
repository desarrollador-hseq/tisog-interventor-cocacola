import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { EditControlReport } from "../_components/edit-control-report";
import { CardPage } from "@/components/card-page";
import { TitleOnPage } from "@/components/title-on-page";
import { ModalDeleteReport } from "../_components/modal-delete-report";
import { ControlHeaderForm } from "../_components/control-header-form";
import { EditFindingReportForm } from "@/app/(main)/analista/reportes/_components/edit-finding-report";

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
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <h2 className="text-lg text-center text-red-600">
          Reporte no encontrado
        </h2>
      </div>
    );
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
        <TitleOnPage text={`${control.source === "checklist" ? "Reporte de control" : "Reporte de hallazgo"}`}>
          {session.user?.email === "desarrollador1@grupohseq.com" ||
          session.user?.email === "liderdeservicios3@grupohseq.com" ||
          session.user?.email === "gerencia@grupohseq.com" ? (
            <ModalDeleteReport report={control} />
          ) : (
            <div></div>
          )}
        </TitleOnPage>
      }
    >
      {/* <EditControlReport
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
      /> */}
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
