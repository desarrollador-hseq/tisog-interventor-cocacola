import React from "react";
import { Building, User } from "lucide-react";
import { HeaderDateFilter } from "./_components/header-date-filter";
import { db } from "@/lib/db";
import { FindingIndicators } from "./_components/finding-indicators/finding-indicators";
import { KpiCard } from "@/components/kpi-card";
import { ControlIndicators } from "./_components/control-indicators/control-indicators";
import { AccidentIndicators } from "./_components/accident-indicators/accident-indicators";
import { DashboardContent } from "./_components/dashboard-content";

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

  const findingReports = await db.findingReport.findMany({
    where: {
      NOT: {
        status: "CANCELED",
      },
    },
    include: {
      controlReport: {
        include: {
          contractor:true,
          businessArea: true,
          controller: true
        },
      },
    },
  });

  const controlReports = await db.controlReport.findMany({
    where: {
      active: true,
    },
    include: {
      contractor: true,
      businessArea: true,
    },
  });
  const areas = await db.businessAreas.findMany({
    where: {
      active: true,
    },
  });
  const accidents = await db.accidents.findMany({
    where: {
      active: true,
    },
    include: {
      contractor: true,
      area: true
    }
  });


  
  return (
    <div className="bg-blue-100">
      <div className="my-6 flex gap-3 w-full justify-center flex-wrap ">
      <HeaderDateFilter companies={contractors} />
        <KpiCard
          name="Contratistas"
          number={contractors.length}
          icon={Building}
        />
        <KpiCard name="Interventores" number={controllers.length} icon={User} />
      </div>

        <DashboardContent 
         controlReport={controlReports}
         findingReports={findingReports}
         accidents={accidents}
         areas={areas}
        />

      {/* <TableDefault 
        columns={}
        data={}
        editHref={}
      /> */}
    </div>
  );
};

export default AdminPage;
