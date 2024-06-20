"use client";

import { useEffect, useState } from "react";
import {
  BusinessAreas,
  ChecklistItem,
  Contractor,
  ControlReport,
  DefaultTool,
  SecurityCategory,
  SecurityQuestion,
  Tool,
} from "@prisma/client";
import { HeaderForm } from "./header-form";
import { ToolsList } from "./toolList";
import { AspectsList } from "./aspect-list";
import { CheckPrimeOptions } from "crypto";
import { UnsafeActForm } from "./unsafe-act-form";

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
  isAdmin
}: {
  control: ControlReport;
  tools: Tool[] | null;
  areas: BusinessAreas[];
  aspects: (SecurityQuestion & {
    checklistItems: ChecklistItem[];
    category: SecurityCategory | null;
  })[];
  contractors: Contractor[];
  companyId: string;
  defaultsToolsWithType: any[];
  toolDefaults: DefaultTool[];
  disabled: boolean;
  isAdmin: boolean;
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

  console.log({ create: control.createdAt });

  return (
    <div className="w-full flex flex-col gap-3 relative m-3">
      <div className="bg-white rounded-lg overflow-hidden">
        <HeaderForm
          control={controlData}
          areas={areas}
          contractors={contractors}
          disabled={disabled}
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
          controlCreationDate={controlData.createdAt}
          isAdmin={isAdmin}
        />
      </div>
    
    </div>
  );
};
