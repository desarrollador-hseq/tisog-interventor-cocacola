import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { DefaultTool, Tool, TypeTool } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { useLoading } from "@/components/providers/loading-provider";

import { cn } from "@/lib/utils";
import { SimpleModal } from "@/components/simple-modal";
import { ModalSelectTool } from "./modal-select-tool";

interface ToolsListProps {
  currents: Tool[];
  disabled?: boolean;
  controlId: string;
  defaultsToolssWithType: any[];
  groupedToolsByType: any[];
}

interface defaultsToolssWithType extends DefaultTool {
  typeTool: TypeTool | null;
}

// Mapeamos defaultsToolssWithType para acceso rápido
const mapDefaultsToHazard = (defaults: defaultsToolssWithType[]) => {
  return defaults.reduce((acc, tool) => {
    acc[tool.id] = tool;
    return acc;
  }, {} as Record<string, DefaultTool & { typeTool: TypeTool | null }>);
};

const groupCurrentsByHazard = (
  currents: Tool[],
  defaultsMap: Record<string, DefaultTool & { typeTool: TypeTool | null }>
) => {
  return currents.reduce((acc, tool) => {
    const defaultTool = defaultsMap[tool.toolDefaultId || ""];
    console.log({ defaultTool, defaultsMap, as: tool.toolDefaultId, currents });
    let typeId = defaultTool?.typeToolId;
    let typeName = defaultTool?.typeTool?.name;

    // Si el defaultControlId es nulo, agrégalos bajo la categoría "Otros"
    if (!typeId) {
      typeId = "otros";
      typeName = "Otros";
    }

    if (!acc[typeId]) {
      acc[typeId] = {
        typeTool: typeName,
        tools: [],
      };
    }
    acc[typeId].tools.push(tool);

    return acc;
  }, {} as Record<string, { typeTool: string | undefined; tools: Tool[] }>);
};

export const ToolsList = ({
  currents,
  defaultsToolssWithType,
  groupedToolsByType,
  disabled,
  controlId,
}: ToolsListProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [currentsTools, setCurrentsTools] = useState(currents);

  useEffect(() => {
    setCurrentsTools(currents);
  }, [currents]);

  const handleToggle = async (tool?: Tool) => {
    setLoadingApp(true);
    try {
      await axios.delete(`/api/controls/${controlId}/tools/${tool?.id}`);
      toast.info("Item eliminado");
      router.refresh();
    } catch (error) {
      toast.error("Error al actualizar el item");
    } finally {
      setLoadingApp(false);
    }
  };

  const defaultsMap = mapDefaultsToHazard(defaultsToolssWithType);
  const groupedTools = groupCurrentsByHazard(currentsTools, defaultsMap);

  console.log({ groupedTools, defaultsToolssWithType });

  return (
    <div
      className={cn("w-full flex flex-col flex-wrap gap-1 justify-start m-2")}
    >
      <div className="flex justify-between">
        <div className="text-2xl font-bold text-primary mb-3">Herramientas</div>

        {!disabled && (
          <ModalSelectTool
            groupedToolsArray={groupedToolsByType}
            controlId={controlId}
            tools={currents}
          />
        )}
      </div>
      <div className="flex gap-2 h-full">
        {Object.keys(groupedTools).map((typeId) => (
          <div
            key={typeId}
            className="border border-secondary bg-slate-300 rounded-md p-2 h-full"
          >
            <h3 className="text-lg font-bold px-4 py-2 uppercase">
              {groupedTools[typeId].typeTool}
            </h3>
            {groupedTools[typeId].tools.map((tool, index) => {
              const isSelected = true;
              return (
                <div
                  key={tool.id}
                  className={cn(
                    "h-full max-h-[200px] flex flex-col gap-2 rounded-md items-center justify-between px-5 border p-3 bg-primary"
                  )}
                >
                  <div className="w-full flex items-center justify-between">
                    <p
                      className={cn(
                        "text-base capitalize text-white",
                        isSelected && "font-bold"
                      )}
                    >
                      {tool.name}
                    </p>
                    <SimpleModal
                      title="Eliminar"
                      large={false}
                      textBtn={
                        <span className="h-fit w-fit p-1 bg-red-500 hover:bg-red-600 rounded-sm">
                          <Trash2 className="w-4 h-4" />
                        </span>
                      }
                      btnClass="p-1 h-fit"
                      onAcept={() => handleToggle(tool)}
                    >
                      ¿Estas seguro que deseas eliminar la herramienta?
                    </SimpleModal>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
