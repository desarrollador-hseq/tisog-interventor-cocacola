"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, CalendarSearch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLoading } from "./providers/loading-provider";

export const DateFilter = () => {
  const { dateFilter, setDateFilter } = useLoading();
  const [calendarOpen, setCalendarOpen] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [dateSelected, setDateSelected] = useState<DateRange | undefined>(
    undefined
  );

  useEffect(() => {
    if (!calendarOpen) {
      if (dateSelected?.from !== undefined && dateSelected.to !== undefined) {
        setDateFilter(dateSelected);
      } else {
        setDateFilter(undefined);
        setDateSelected(undefined);
        setIsFiltering(false);
      }
    }
  }, [calendarOpen, dateSelected, setDateFilter]);

  const handleClearInputCalendar = () => {
    setCalendarOpen(false);
    setDateSelected(undefined);
    setDateFilter(undefined);
  };

  useEffect(() => {
    if (!dateFilter) {
      setIsFiltering(false);
    }
  }, [dateFilter]);

  const onOpenFiltering = () => {
    setIsFiltering(true);
    setCalendarOpen(true);
  };

  return (
    <div className={cn("flex items-center ")}>
      {isFiltering ? (
        <div className="flex items-center relative transition">
          <Button
            onClick={handleClearInputCalendar}
            variant="default"
            type="button"
            className={cn(
              `absolute top-3 right-1 w-4 h-4 p-0 rounded-sm bg-red-700 hover:bg-red-800`,
              !!!dateFilter && "hidden"
            )}
          >
            <X className="w-3 h-3" />
          </Button>

          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              asChild
              className="pr-6 hover:bg-slate-200 hover:text-zinc-800"
            >
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "h-11 w-full justify-start text-left font-normal bg-slate-100",
                  !dateFilter && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFilter?.from ? (
                  dateFilter.to ? (
                    <span className="font-bold">
                      {format(dateFilter.from, "dd LLLL y", {
                        locale: es,
                      })}{" "}
                      - {format(dateFilter.to, "dd LLLL y", { locale: es })}
                    </span>
                  ) : (
                    format(dateFilter.from, "dd LLLL y", { locale: es })
                  )
                ) : (
                  <span>Selecciona un rango de fechas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto mr-4" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateSelected ? dateSelected.to : new Date()}
                selected={dateSelected}
                onSelect={setDateSelected}
                numberOfMonths={2}
                locale={es}
                className="mr-6 me-6"
              />
            </PopoverContent>
          </Popover>
          {!dateFilter && (
            <Button
              onClick={(e) => setIsFiltering(!isFiltering)}
              variant="secondary"
              className="absolute top-3 right-0.5 w-5 h-5 m-0 p-0"
            >
              <X className="w-4 h-4 text-white" />
            </Button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            className="text-slate-500 bg-slate-50"
            onClick={() => onOpenFiltering()}
          >
            <CalendarSearch className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
};
