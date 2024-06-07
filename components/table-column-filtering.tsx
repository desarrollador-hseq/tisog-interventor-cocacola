import React, { useEffect, useState } from "react";
import DebouncedInput from "./debounced-input";
import { Button } from "./ui/button";
import { Search, SearchX } from "lucide-react";

function TableColumnFiltering({ column, table }: any) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();
  const [openSearch, setOpenSearch] = useState(false);

  const sortedUniqueValues = React.useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues(), firstValue]
  );

  useEffect(() => {
    if (openSearch) return;
    column.setFilterValue("");
  }, [openSearch]);

  return typeof firstValue === "number" ? (
    <div>
      <div>
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: any) => [value, old?.[1]])
          }
          placeholder="min"
          className="max-w-[50%] absolute -top-1 left-7 rounded-sm"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={columnFilterValue?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: any) => [old?.[0], value])
          }
          placeholder="max"
          className="max-w-[50%] absolute -top-1 left-7 rounded-sm"
        />
      </div>
    </div>
  ) : (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value) => (
          <option value={value as string} key={value as string} />
        ))}
      </datalist>
      <div className="flex gap-0.5 relative">
        <Button
          className="w-fit p-1 h-fit"
          onClick={() => setOpenSearch(!openSearch)}
          variant="secondary"
        >
          {openSearch ? (
            <SearchX className="w-3.5 h-3.5" />
          ) : (
            <Search className="w-3.5 h-3.5" />
          )}
        </Button>
        {openSearch && (
          <DebouncedInput
            className="max-w-[50%] absolute -top-1 left-7 rounded-sm"
            type="text"
            value={columnFilterValue ?? ""}
            onChange={(value) => column.setFilterValue(value)}
            list={column.id + "list"}
            placeholder={`Buscar... `}
            focus
          />
        )}
      </div>
    </>
  );
}

export default TableColumnFiltering;
