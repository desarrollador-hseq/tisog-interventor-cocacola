import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { Control, FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { cn } from '../lib/utils';

interface InputFormProps<T extends FieldValues>
  extends UseControllerProps<T>,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "defaultValue" | "name" | "type" | "disabled"
    > {
  control: Control<T>;
  label: string;
  isSubmitting?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  type?: HTMLInputTypeAttribute | undefined;
}

export const InputForm: React.FC<InputFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  type,
  readOnly,
  disabled,
  className
}) => {
  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="font-semibold text-primary " htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={name}
              placeholder=""
              type={type || "text"}
              readOnly={readOnly}
              {...field}
              className={className}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
