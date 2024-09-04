"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BusinessAreas,
  ChecklistItem,
  Contractor,
  ControlReport,
  DefaultTool,
  SecurityCategory,
  SecurityQuestion,
  Tool,
  User,
} from "@prisma/client";
import { ControlHeaderForm } from "./control-header-form";
import { ToolsList } from "./toolList";
import { AspectsList } from "./aspect-list";
import { CheckPrimeOptions } from "crypto";
import { UnsafeActForm } from "./unsafe-act-form";
import {
  shouldControlBeManaged,
  shouldControlBeManagedSameDay,
} from "@/lib/utils";
import { CloudLightning } from "lucide-react";
import { ReleasePermit } from "./release-permit";
import { Button } from "@/components/ui/button";

import { Toggle } from "@/components/ui/toggle";
import { Form, useFormField } from "@/components/ui/form";
import { debounce } from "lodash";
import { z } from "zod";
import { usePathname, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  isCondition: z.boolean(),
});

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

  const handleSource = () => {};

  const canEdit = shouldControlBeManagedSameDay(controlData.date) || isAdmin;

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const isEdit = useMemo(() => !!control, [control]);

  const pathArray = usePathname().split("/");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isCondition: control?.isCondition || false,
    },
  });

  const { setValue, getValues, watch } = form;

  const debouncedSave = useMemo(
    () =>
      debounce(async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
          if (isEdit) {
            await axios.patch(`/api/controls/${control?.id}`, values);
          }
          router.refresh();
        } catch (error) {
          toast.error("Ocurrió un error");
        } finally {
          setIsLoading(false);
        }
      }, 1000),
    [control, isEdit, router]
  );

  useEffect(() => {
    const subscription = watch((values) => {
      if (isEdit) {
        debouncedSave(values as any);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave, isEdit]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {};

  return (
    <div className="w-full flex flex-col gap-3 relative m-3">
      <div className="bg-white rounded-lg overflow-hidden">
        <ControlHeaderForm
          control={controlData}
          areas={areas}
          contractors={contractors}
          disabled={!canEdit}
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
          disabled={!canEdit}
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
