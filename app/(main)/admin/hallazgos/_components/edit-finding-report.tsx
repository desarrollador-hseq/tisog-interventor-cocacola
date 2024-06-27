"use client";

import { useEffect, useState } from "react";
import {
  BusinessAreas,
  ChecklistItem,
  Contractor,
  ControlReport,
  DefaultTool,
  FindingReport,
  SecurityQuestion,
  Tool,
  User,
} from "@prisma/client";
import { AddFindingReportForm } from "./add-finding-report-form";

export const EditFindingReport = ({
  areas,
  contractors,
  aspects,
  tools,
  defaultsToolsWithType,
  toolDefaults,
  disabled,
  findingReport,
  controllers,
  actualUserId,
}: {
  findingReport:
    | (FindingReport & { controlReport: ControlReport | null })
    | null;
  tools: Tool[] | null;
  areas: BusinessAreas[];
  aspects: SecurityQuestion & { checklistItems: ChecklistItem | null }[];
  contractors: Contractor[];
  companyId: string;
  defaultsToolsWithType: any[];
  toolDefaults: DefaultTool[];
  disabled: boolean;
  controllers: User[];
  actualUserId: string;
}) => {
  const [controlData, setControlData] = useState(findingReport);

  return (
    <div className="w-full flex flex-col gap-3 relative m-3">
      <div className="bg-white rounded-lg overflow-hidden">
        <AddFindingReportForm
          findingReport={findingReport}
          controllers={controllers}
          actualUserId={actualUserId}
          isAdmin={true}
          aspects={aspects}
          businessAreas={areas}
          contractors={contractors}
        />
      </div>
      <div className="bg-slate-200 rounded-lg overflow-hidden"></div>
    </div>
  );
};
