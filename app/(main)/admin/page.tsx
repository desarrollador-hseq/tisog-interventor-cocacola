import React from "react";
import { HeaderDateFilter } from "./_components/header-date-filter";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Building, LucideIcon, User } from "lucide-react";


const AdminPage = async () => {
  const contractors = await db.contractor.findMany({
    where: {
      active: true,
    },
  });
  const controllers = await db.user.findMany({
    where: {
      active: true,
      role: "USER",
    },
  });


  return (
    <div className="">
      <HeaderDateFilter companies={contractors} />
      <div className="mt-6 flex gap-3 w-full justify-center flex-wrap">
        <KpiCard name="Empresas" number={contractors.length} icon={Building} />
        <KpiCard name="Interventores" number={controllers.length} icon={User} />
      </div>

      {/* <TableDefault 
        columns={}
        data={}
        editHref={}
      /> */}
    </div>
  );
};

export default AdminPage;

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
