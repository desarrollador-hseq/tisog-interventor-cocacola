import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ChecklistItem, SecurityQuestion } from "@prisma/client";

export const AspectsList = ({
  aspects,
  disabled,
}: {
  aspects: SecurityQuestion[];
  disabled: boolean;
}) => {
  // Agrupar los aspectos por categoría
  const groupedAspects = aspects.reduce((groups, aspect) => {
    const categoryName = aspect.category.name;
    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }
    groups[categoryName].push(aspect);
    return groups;
  }, {} as Record<string, SecurityQuestion[]>);

  console.log({ aaa: aspects.map((d) => d.checklistItems) });
  return (
    <div>
      <div className="space-y-4">
        {Object.keys(groupedAspects).map((category) => (
          <div key={category}>
            <h3>{category}</h3>
            {groupedAspects[category].map((aspect, index) => (
              <div key={index}>
                <span>{aspect.question}</span>
                <div>
                  <DailyReport daily={aspect.checklistItems.map(d => d.day1)} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyReport: React.FC<{ daily: ChecklistItem }> = ({ daily }) => {
  const days = [
    { name: "day1", value: daily.day1 },
    { name: "day2", value: daily.day2 },
    { name: "day3", value: daily.day3 },
    { name: "day4", value: daily.day4 },
    { name: "day5", value: daily.day5 },
    { name: "day6", value: daily.day6 },
    { name: "day7", value: daily.day7 },
  ];
  console.log({ days, dailydd: daily.day1 });
  return (
    <div>
      <div className="grid grid-cols-7">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col">
            <span className="">{day.name}</span>
            <span>{day.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
