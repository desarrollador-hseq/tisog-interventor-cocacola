import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChecklistItem, SecurityQuestion } from "@prisma/client";
import { toast } from "sonner";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoading } from "@/components/providers/loading-provider";
import { differenceInCalendarDays, parseISO } from "date-fns";
import { cn } from "@/lib/utils";

export const AspectsList = ({
  aspects,
  disabled,
  controlId,
  controlCreationDate,
}: {
  aspects: (SecurityQuestion & { checklistItems: ChecklistItem[] })[];
  disabled: boolean;
  controlId: string;
  controlCreationDate: Date;
}) => {
  const [daysElapsed, setDaysElapsed] = useState(0);

  // Agrupar los aspectos por categoría
  const groupedAspects = aspects.reduce((groups, aspect) => {
    const categoryName = aspect.category?.name || "Sin Categoría"; // Asegurar que hay una categoría
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(aspect);
    return groups;
  }, {} as Record<string, (SecurityQuestion & { checklistItems: ChecklistItem[] })[]>);

  useEffect(() => {
    const calculateDaysElapsed = () => {
      if (!controlCreationDate) {
        console.error("Creation date is not provided or invalid");
        return;
      }

      const currentDate = new Date();
      const creation = parseISO(controlCreationDate.toISOString()); // Convertir la fecha de creación desde el string ISO

      if (isNaN(creation.getTime())) {
        console.error("Invalid creation date format");
        return;
      }

      const daysDifference = differenceInCalendarDays(creation, currentDate);
      setDaysElapsed(daysDifference);
    };

    calculateDaysElapsed();
  }, [controlCreationDate]);

  return (
    <div>
      <div className="space-y-4">
        {Object.keys(groupedAspects).map((category) => (
          <div key={category}>
            <h3 className="bg-primary p-3 text-slate-100">{category}</h3>
            {groupedAspects[category].map((aspect, index) => (
              <div key={index} className={cn("flex flex-col border border-slate-500 rounded-md p-2 items-center",daysElapsed === 0 && "flex-row gap-2")}>
                <span className="h-full flex items-center">{aspect.question}</span>
                <div>
                  <DailyReport
                    controlId={controlId}
                    daily={
                      aspect.checklistItems.length > 0
                        ? aspect.checklistItems.filter(
                            (d) => d.securityQuestionId === aspect.id
                          )
                        : [{ securityQuestionId: aspect.id }] // Pasar un valor predeterminado si no hay registros
                    }
                    creationDate={daysElapsed}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const translateDay = (day: string): string => {
  const translations: Record<string, string> = {
    day1: "día 1",
    day2: "día 2",
    day3: "día 3",
    day4: "día 4",
    day5: "día 5",
    day6: "día 6",
    day7: "día 7",
  };
  return translations[day] || day;
};

const DailyReport = ({
  daily,
  controlId,
  numDateCreated,
}: {
  daily: ChecklistItem[];
  controlId: string;
  numDateCreated: number; // Fecha de creación del control en formato ISO string
}) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const days = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];


  const onChangeState = async (
    dayName: string,
    value: string,
    questionId: string
  ) => {
    if (!questionId) {
      questionId = daily[0]?.securityQuestionId || ""; // Usar el primer valor de daily si questionId es null
    }
    try {
      setLoadingApp(true);
      const { data } = await axios.patch(
        `/api/controls/${controlId}/aspects/`,
        {
          securityQuestionId: questionId,
          [dayName]: value,
        }
      );
      toast.success("Estado actualizado");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    }
    setLoadingApp(false);
  };

  return (
    <div className={cn("grid grid-cols-7 gap-4 justify-center items-center", numDateCreated === 0 && "grid grid-cols-1")}>
      {days.map((day, index) => (
        <div key={index} className={cn(index > numDateCreated && "hidden")}>
          <span className={cn(numDateCreated === 0 && "hidden")}>
            {translateDay(day)}
          </span>
          <Select
            onValueChange={(value) =>
              onChangeState(
                day,
                value,
                daily[0]?.securityQuestionId || daily[0]?.aspectId
              )
            }
            defaultValue={daily.length > 0 ? daily[0][day] || "NA" : "NA"}
            disabled={index > numDateCreated} // Deshabilitar selectores de días futuros
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Seleccione un valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="C">C</SelectItem>
              <SelectItem value="NC">NC</SelectItem>
              <SelectItem value="NA">NA</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
