import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DefaultTool, Tool } from "@prisma/client";
import { SimpleModal } from "@/components/simple-modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useLoading } from "@/components/providers/loading-provider";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export const ModalSelectTool = ({
  groupedToolsArray,
  tools,
  controlId,
}: {
  groupedToolsArray: any[];
  tools: Tool[];
  controlId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState<any[]>(groupedToolsArray);

  console.log({ groupedToolsArray });

  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const [currentsTools, setCurrentsTools] = useState(tools);

  useEffect(() => {
    setCurrentsTools(tools);
  }, [tools]);

  useEffect(() => {
    setOpen(true);
  }, []);

  useEffect(() => {
    const filtered = groupedToolsArray
      ? groupedToolsArray
          .map((group) => ({
            ...group,
            tools: group.tools
              .filter(
                (tool: Tool) =>
                  !currentsTools.some((c) => c.toolDefaultId === tool.id)
              ) // Filtrar tools en currents
              .filter((tool: Tool) =>
                tool.name?.toLowerCase().includes(searchTerm.toLowerCase())
              ), // Aplicar el filtro de búsqueda
          }))
          .filter((group) => group.tools.length > 0) // Filtrar grupos vacíos
      : [];
    setFilteredTools(filtered);
  }, [searchTerm, groupedToolsArray, currentsTools]);

  useEffect(() => {
    if (value === "") return;
    const handleAddTool = async () => {
      setLoadingApp(true);
      try {
        const selectedTool = groupedToolsArray
          .flatMap((group) => group.tools)
          .find((tool) => tool.id === value);

        await axios.post(`/api/controls/${controlId}/tools/`, {
          toolDefaultId: value,
          name: selectedTool?.name,
        });
        toast.info("Item agregado");

        router.refresh();
      } catch (error) {
        toast.error("Error al actualizar el item");
      } finally {
        setLoadingApp(false);
        setValue("");
      }
    };
    handleAddTool();
  }, [value]);

  return (
    <SimpleModal title textBtn="Agregar herramienta">
      <div className="relative min-h-[70vh] h-full flex justify-center items-start">
        <Command
          shouldFilter={false}
          className="max-w-[600px] flex justify-center h-fit"
        >
          <CommandInput
            placeholder="Buscar herramienta..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          {!filteredTools || filteredTools?.length === 0 ? (
            <CommandList>
              <CommandEmpty>Herrameinta no encontrada</CommandEmpty>
            </CommandList>
          ) : (
            filteredTools?.map((group) => (
              <div key={group.toolDefaultId} className="h-full">
                <h3 className="text-lg font-semibold px-4 py-2">
                  {group.typeTool ? group.typeTool : "Otros riesgos"}
                </h3>
                <CommandList className="h-full max-h-fit">
                  <CommandGroup className="h-fit">
                    {group.tools.map((tool: DefaultTool) => (
                      <CommandItem
                        key={tool.id}
                        value={tool.id}
                        onSelect={(currentValue) => {
                          setValue(currentValue === value ? "" : currentValue);
                          setOpen(false);
                        }}
                        className="flex w-full cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === tool.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex justify-between items-center w-full border-2 rounded-md bg-slate-200">
                          <span className="h-full flex justify-center font-semibold text-lg">
                            {tool.name}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </div>
            ))
          )}
        </Command>
      </div>
    </SimpleModal>
  );
};
