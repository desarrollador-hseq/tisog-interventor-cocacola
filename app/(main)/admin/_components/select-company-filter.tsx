"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Contractor } from "@prisma/client";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLoading } from "@/components/providers/loading-provider";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  companyId: z.string().optional(),
});

export const SelectCompanyFilter = ({
  companies,
}: {
  companies: Contractor[];
}) => {
  const { setCompanyFilter, companyFilter } = useLoading();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyId: companyFilter,
    },
  });
  const { watch, setValue } = form;

  const handleClearInput = () => {
    setValue("companyId", "", { shouldValidate: true });
  };

  useEffect(() => {
    setCompanyFilter(watch("companyId"));
  }, [watch("companyId")]);

  return (
    <Form {...form}>
      <form className="max-w-[200px] w-full mx-auto relative">
        <Button
          onClick={handleClearInput}
          variant="default"
          type="button"
          className={cn(
            `absolute top-3 right-1 w-4 h-4 p-0 rounded-sm bg-red-700 hover:bg-red-800`,
            !!!companyFilter && "hidden"
          )}
        >
          <X className="w-3 h-3" />
        </Button>
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between font-bold text-base pr-7",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? companies?.find(
                            (company) => company.id === field.value
                          )?.name
                        : "Contratista"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command className="w-full">
                    <CommandInput placeholder="Buscar contratista" />
                    <CommandEmpty>Contratista no encontrado</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {companies?.map((company) => (
                          <CommandItem
                            value={`${company.name}`}
                            key={company.id}
                            onSelect={() => {
                              form.setValue("companyId", company.id, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                company.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {company.name}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
