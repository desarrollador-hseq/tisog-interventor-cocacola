"use client"

import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import { Control, FieldValues, UseControllerProps } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";

interface TextAreaFormProps<T extends FieldValues>
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
}

export const TextAreaForm: React.FC<TextAreaFormProps<any>> = ({
  control,
  name,
  label,
  isSubmitting,
  readOnly,
  disabled,
}) => {
  return (
    <FormField
      disabled={disabled}
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel className="font-semibold text-primary" htmlFor={name}>
            {label}
          </FormLabel>
          <FormControl>
            <Textarea id={name} placeholder="" readOnly={readOnly} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
