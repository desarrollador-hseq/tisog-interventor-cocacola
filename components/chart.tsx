import React, { ReactNode, useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Loader2 } from "lucide-react";
import ReactEcharts from "echarts-for-react";
import { cn } from "@/lib/utils";

export const Chart = ({
  option,
  title,
  className,
}: {
  option: object;
  title: string | ReactNode;
  className?: string;
}) => {
  const [isChartLoaded, setIsChartLoaded] = useState(false);

  const onChartReady = () => {
    setTimeout(() => {
      setIsChartLoaded(true);
    }, 500);
  };

  return (
    <Card className={cn("rounded-md shadow-md w-full ", className)}>
      <CardHeader className="text-primary text-center">
        <span className="font-bold text-2xl">{title}</span>
      </CardHeader>

      <CardContent className="relative min-h-[300px]">
        {!isChartLoaded && (
          <div className="absolute w-full h-full top-0 bottom-0 right-0 left-0 flex justify-center items-center">
            <Loader2 className="w-7 h-7 z-0 animate-spin text-secondary" />
          </div>
        )}
        <div className="w-1/2"></div>

        <ReactEcharts
          className="z-10"
          onChartReady={onChartReady}
          option={option}
          showLoading={!isChartLoaded}
          theme="shine"
        />
      </CardContent>
    </Card>
  );
};
