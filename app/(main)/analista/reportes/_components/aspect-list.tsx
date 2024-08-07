import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChecklistItem,
  SecurityCategory,
  SecurityQuestion,
} from "@prisma/client";
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
import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { SimpleModal } from "@/components/simple-modal";
import { UploadImageForm } from "@/components/upload-image-form";
import { FieldUpdateForm } from "@/components/field-update-form";

export const AspectsList = ({
  aspects,
  disabled,
  controlId,
  isAdmin,
  controlCreationDate,
}: {
  aspects: (SecurityQuestion & {
    checklistItems: ChecklistItem[];
    category: { name: string | null } | null;
  })[];
  disabled: boolean;
  isAdmin: boolean;
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

      const daysDifference = differenceInCalendarDays(currentDate, creation);
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
              <div
                key={index}
                className={cn(
                  "flex flex-col border border-slate-500 rounded-md p-2 items-center bg-slate-200",
                  daysElapsed === 0 && "flex-row gap-2"
                )}
              >
                <span className="h-full flex items-center">
                  {aspect.question}
                </span>
                <div>
                  <DailyReport
                    controlId={controlId}
                    questionId={aspect.id}
                    startDate={controlCreationDate}
                    isAdmin={isAdmin}
                    daily={
                      aspect.checklistItems.length > 0
                        ? aspect.checklistItems.filter(
                            (d) => d.securityQuestionId === aspect.id
                          )
                        : [] // Pasar un valor predeterminado si no hay registros
                    }
                    negativeQuestion={aspect.negativeQuestion}
                    numDateCreated={daysElapsed}
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

interface DailyReportProps {
  daily: any[];
  controlId: string;
  questionId: string;
  isAdmin: boolean;
  startDate: Date;
  negativeQuestion: string;
  numDateCreated: number; // Fecha de creación del control en formato ISO string
}

interface DayValues {
  [key: string]: string;
}

const DailyReport = ({
  daily,
  controlId,
  questionId,
  isAdmin,
  numDateCreated,
  negativeQuestion,
  startDate,
}: DailyReportProps) => {
  const router = useRouter();
  const { setLoadingApp } = useLoading();
  const days = ["day1", "day2", "day3", "day4", "day5", "day6", "day7"];

  const [isClient, setIsClient] = useState(false);
  const [controlCheckId, setControlCheckId] = useState<string | undefined>();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<{
    dayName: string;
    value: string;
    questionId: string;
    previousValue: string;
  } | null>(null);
  const [dayValues, setDayValues] = useState<DayValues>(() => {
    const initialValues: DayValues = {};
    days.forEach((day) => {
      initialValues[day] = daily.length > 0 ? daily[0][day] || "NA" : "NA";
    });
    return initialValues;
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onChangeState = async (
    dayName: string,
    value: string,
    questionId: string
  ) => {
    if (value === "NC") {
      setSelectedDay({
        dayName,
        value,
        questionId,
        previousValue: dayValues[dayName],
      });
      setShowConfirmModal(true);
    } else {
      await updateState(dayName, value, questionId);
    }
    setDayValues((prev) => ({ ...prev, [dayName]: value }));
  };

  const updateState = async (
    dayName: string,
    value: string,
    questionId: string
  ) => {
    try {
      setLoadingApp(true);
      const { data } = await axios.patch(
        `/api/controls/${controlId}/aspects/`,
        {
          securityQuestionId: questionId,
          [dayName]: value,
          negativeQuestion: negativeQuestion,
        }
      );

      if (value === "NC") {
        setControlCheckId(data.id);
      }

      toast.success("Estado actualizado");
      setDayValues((prev) => ({ ...prev, [dayName]: value }));
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado");
    } finally {
      setLoadingApp(false);
    }
  };

  const handleConfirmNC = async () => {
    if (selectedDay) {
      const { dayName, value, questionId } = selectedDay;
      await updateState(dayName, value, questionId);
    }
    setShowConfirmModal(false);
  };

  const handleCancelNC = () => {
    if (selectedDay) {
      const { dayName, previousValue } = selectedDay;
      setDayValues((prev) => ({ ...prev, [dayName]: previousValue }));
    }
    setShowConfirmModal(false);
  };

  const handleImageNonCompliance = () => {
    console.log({ first: "sadfasddf" });
    setControlCheckId(undefined);
  };

  const formatDate = (dayIndex: number) => {
    const date = addDays(new Date(startDate), dayIndex);
    return format(date, "dd/MM/yyyy");
  };

  return (
    <>
      {isClient && (
        <div
          className={cn(
            "w-full gap-2 justify-center items-center border-2 border-primary rounded-md overflow-hidden flex-wrap flex",
            numDateCreated === 0 && "flex"
          )}
        >
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "border px-1 py-1 flex flex-col gap- items-center bg-slate-400 my-0.5 ",
                index > numDateCreated && "hidden", index == numDateCreated && "bg-slate-600"
              )}
            >
              <span className="block col-span-2 text-[10px] text-white">{formatDate(index)}</span>
              <span
                className={cn(
                  "text-xs text-white font-semibold capitalize",
                  numDateCreated === 0 && "hidden"
                  )}
              >
                {`Día ${index + 1}`}
              </span>
              <Select
                onValueChange={(value) => onChangeState(day, value, questionId)}
                value={dayValues[day]} 
                disabled={!isAdmin && index !== numDateCreated} 
              >
                <SelectTrigger
                  className={cn(
                    "w-fit text-sm font-bold h-fit p-1",
                    dayValues[day] === "NC"
                      ? "bg-red-500 text-white"
                      : dayValues[day] === "C"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  <SelectValue placeholder="Seleccione un valor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C" className="text-xs">
                    C
                  </SelectItem>
                  <SelectItem value="NC" className="text-xs">
                    NC
                  </SelectItem>
                  <SelectItem value="NA">NA</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      <SimpleModal
        title="Confirmar No Cumple"
        large={false}
        onAcept={handleConfirmNC}
        onClose={handleCancelNC} // Manejar el cancelar confirmación
        btnClass="hidden"
        openDefault={showConfirmModal}
      >
        <p>¿Está seguro de que desea marcarlo como No Cumple (NC)?</p>
      </SimpleModal>

      <SimpleModal
        title="Evidencia"
        large={true}
        textBtn=""
        openDefault={controlCheckId !== undefined}
        btnClass="hidden"
      >
        <div className="grid md:grid-cols-2">
          <UploadImageForm
            apiUrl="/api/upload/file"
            field="imgUrl"
            file={``}
            label="Registro fotográfico"
            ubiPath="control/images"
            update={`/api/finding-report/${controlCheckId}/`}
            defaultOpenUpload={true}
          />

          <FieldUpdateForm
            field="imgDescription"
            apiUrl={`/api/finding-report`}
            label="Detalles del hallazgo"
            id={controlCheckId}
            value={``}
            defaultOpenUpdate={true}
            isTextArea
          />
        </div>
      </SimpleModal>
    </>
  );
};
