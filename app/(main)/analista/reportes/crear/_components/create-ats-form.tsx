import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const HandleCreatedAts = () => {
  const [isFindReport, setIsFindReport] = useState(false);


  return (
    <>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecciona la fuente" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Selecciona la fuente</SelectLabel>
            <SelectItem value="1">Condición</SelectItem>
            <SelectItem value="2">Acto</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
};

