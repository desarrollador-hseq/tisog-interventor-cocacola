import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export const KpiCard = ({
  name,
  number,
  icon: Icon,
}: {
  name: string;
  number: number;
  icon: LucideIcon;
}) => {
  return (
    <Card className="shadow-sm border border-gray-200 rounded-lg max-w-[300px] w-full text-gray-600">
      <CardContent className="p-4 w-full">
        <div className="flex justify-between items-center">
          <Icon className="w-7 h-7" />
          <span className="font-medium text-xl text-gray-600">{name}</span>
        </div>
        <span className="block mt-1 font-bold text-2xl w-full text-right">
          {number}
        </span>
      </CardContent>
    </Card>
  );
};
