"use client"

import { useEffect, useState } from "react";
import { Contractor, ControlReport, DefaultTool, SecurityQuestion, Tool } from "@prisma/client";
import { HeaderForm } from "./header-form";
import { ToolsList } from "./toolList";
import { AspectsList } from "./asptect-list";

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
}: {
  control: ControlReport;
  tools: Tool[] | null;
  areas: any;
  aspects: SecurityQuestion[];
  contractors: Contractor[];
  companyId: string;
  defaultsToolsWithType: any[];
  toolDefaults: DefaultTool[];
  disabled: boolean;
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


  return (
    <div className="w-full flex flex-col gap-3 relative">
      <div className="bg-white rounded-lg overflow-hidden p-3">
        <HeaderForm
          control={controlData}
          areas={areas}
          contractors={contractors}
          companyId={companyId}
          disabled={disabled}
        />
      </div>

      <div className="bg-slate-200 rounded-lg overflow-hidden m-4">
        <ToolsList
          currents={tools || []}
          controlId={control.id}
          defaultsToolssWithType={toolDefaults}
          groupedToolsByType={groupedToolsByType}
        />
      </div>
      <div className="bg-slate-200 rounded-lg overflow-hidden m-4">
       <AspectsList 
        aspects={aspects}
        disabled={false}
       />
      </div>
    </div>
  );
};
