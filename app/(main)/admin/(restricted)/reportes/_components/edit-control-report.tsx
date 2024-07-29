"use client";

import { useEffect, useState } from "react";
import {
  BusinessAreas,
  ChecklistItem,
  Contractor,
  ControlReport,
  DefaultTool,
  SecurityQuestion,
  Tool,
  User,
} from "@prisma/client";
import { ControlHeaderForm } from "./control-header-form";
import { ToolsList } from "./toolList";
import { AspectsList } from "./aspect-list";
import { UnsafeActForm } from "./unsafe-act-form";
import { shouldControlBeManagedSameDay } from "@/lib/utils";
import { ReleasePermit } from "./release-permit";

export const EditControlReport = ({
  areas,
  contractors,
  aspects,
  tools,
  defaultsToolsWithType,
  companyId,
  toolDefaults,
  disabled,
  control,
  isAdmin,
  controllers,
}: {
  control: ControlReport;
  tools: Tool[] | null;
  areas: BusinessAreas[];
  aspects: (SecurityQuestion & {
    checklistItems: ChecklistItem[];
    category: { name: string | null } | null;
  })[];
  contractors: Contractor[];
  companyId: string;
  defaultsToolsWithType: any[];
  toolDefaults: DefaultTool[];
  disabled: boolean;
  isAdmin: boolean;
  controllers: User[];
}) => {
  const [controlData, setControlData] = useState(control);

  const groupedTools = defaultsToolsWithType.reduce((acc, tool) => {
    const typeToolId = tool.typeTool;

    if (!acc[typeToolId]) {
      acc[typeToolId] = {
        typeTool: tool.typeTool?.name,
        tools: [],
      };
    }

    acc[typeToolId].tools.push(tool);
    return acc;
  }, {});

  const groupedToolsByType = Object.values(groupedTools);

  useEffect(() => {
    setControlData(control);
  }, [control]);

  const canEdit = shouldControlBeManagedSameDay(controlData.date) || isAdmin;

  return (
    <div className="w-full flex flex-col gap-3 relative m-3">
      <div className="bg-white rounded-lg overflow-hidden">
        <ControlHeaderForm
          control={controlData}
          areas={areas}
          contractors={contractors}
          // disabled={!canEdit}
          controllers={controllers}
          isAdmin={isAdmin}
        />
      </div>

      <div className="border rounded-lg overflow-hidden shadow-md">
        <UnsafeActForm control={controlData} disabled={false} />
      </div>

      <div className="bg-slate-200 rounded-lg overflow-hidden">
        <ToolsList
          currents={tools || []}
          controlId={control.id}
          defaultsToolssWithType={toolDefaults}
          groupedToolsByType={groupedToolsByType}
          // disabled={!canEdit}
        />
      </div>

      <div className="border rounded-lg overflow-hidden p-2">
        <ReleasePermit
          controlId={controlData.id}
          disabled={false}
          permission={controlData.releasePermit}
        />
      </div>
      <div className="bg-slate-200 rounded-lg overflow-hidden">
        <div className="p-2">
          <h2 className="font-bold  text-center text-2xl">
            Listado de aspectos
          </h2>
          <span className="text-sm w-full text-center block">
            Para la revisión de cada uno de los ítems se deberá calificar de
            acuerdo a lo siguientes criterios C: Cumple; NC: No Cumple; NA: No
            aplica
          </span>
        </div>
        <AspectsList
          aspects={aspects}
          disabled={false}
          controlId={controlData.id}
          controlCreationDate={controlData.date!}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};
