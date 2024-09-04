import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { Control, FieldValues, UseControllerProps } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { cn, formatDate } from "@/lib/utils";
import { Calendar } from "./ui/calendar";

interface CalendarInputFormProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name" | "type"
    > {
  control: Control<T>;
  label: string;
  isSubmitting?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute | undefined;
}

export const CalendarInputForm: React.FC<CalendarInputFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  disabled,
}) => {
  return (
    <FormField
      disabled={isSubmitting || disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel className="text-primary">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild disabled={disabled} className="w-full">
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    " pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    formatDate(field.value)
                  ) : (
                    <span>Selecciona la fecha</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={es}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={((date) => date < new Date("1900-01-01")) || disabled}
                initialFocus
                fromYear={2000}
                toYear={2050}
                captionLayout="dropdown-buttons"
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
