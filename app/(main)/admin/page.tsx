import React from "react";
import { Building, User } from "lucide-react";
import { HeaderDateFilter } from "./_components/header-date-filter";
import { db } from "@/lib/db";
import { FindingIndicators } from "./_components/finding-indicators";
import { KpiCard } from "@/components/kpi-card";

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

  const filteredReports = await db.findingReport.findMany({
    where: {
      NOT: {
        status: "CANCELED"
      }
    },
    include: {
      controlReport: {
        include: {
          contractor: {
            select: {
              name: true,
            }
          }
        }
      }
    }
  })

  return (
    <div className="bg-blue-100">
      <HeaderDateFilter companies={contractors} />
      <div className="my-6 flex gap-3 w-full justify-center flex-wrap ">
        <KpiCard name="Contratistas" number={contractors.length} icon={Building} />
        <KpiCard name="Interventores" number={controllers.length} icon={User} />
      </div>

      <FindingIndicators findingReports={filteredReports} />
      {/* <TableDefault 
        columns={}
        data={}
        editHref={}
      /> */}
    </div>
  );
};

export default AdminPage;

