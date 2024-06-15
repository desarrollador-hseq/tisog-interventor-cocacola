import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import React from "react";

import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { EditControlReport } from "../_components/edit-control-report";

const EditJobAnalysisPage = async ({
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
        }
      },
    },
  });

  return (
    <EditControlReport
      companyId=""
      control={control!}
      contractors={contractors}
      aspects={aspects}
      areas={[]}
      //   areas={businessAreas.map((area) => area)}
      tools={tools}
      toolDefaults={toolDefaults}
      defaultsToolsWithType={toolDefaults}
      disabled={false}
    />
  );
};

export default EditJobAnalysisPage;
