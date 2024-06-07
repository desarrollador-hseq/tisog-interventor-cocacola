import { HTMLInputTypeAttribute, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface DebouncedInput {
  value: string;
  onChange: (value: string) => void;
  debounce?: number;
  type: HTMLInputTypeAttribute | undefined;
  min?: number;
  max?: number;
  placeholder?: string;
  list?: string;
  className?: string;
  focus?: boolean;
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  type,
  list,
  className,
  focus,
  ...props
}: DebouncedInput) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce]);

  return (
    <Input
      type={type}
      value={value}
      autoFocus={focus}
      onChange={(e) => setValue(e.target.value)}
      className={cn("h-7 rounded-none placeholder:text-slate-400 placeholder:text-xs text-slate-700 border", className)}
      list={list}
      {...props}
    />
  );
}

export default DebouncedInput;
