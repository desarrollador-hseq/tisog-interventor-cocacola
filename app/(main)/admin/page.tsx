import React from "react";
import { Building } from "lucide-react";
import { HeaderDateFilter } from "./_components/header-date-filter";
import { db } from "@/lib/db";
import { KpiCard } from "@/components/kpi-card";
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

  const controlReports = await db.controlReport.findMany({
    where: {
      active: true,
    },
    select: {
      releasePermit: true,
      source: true,
      date: true,
      contractorId: true,
      controller: {
        select: {
          name: true,
        },
      },
      businessAreaId: true,
      contractor: {
        select: {
          name: true,
        },
      },
      businessArea: {
        select: {
          name: true,
        },
      },
      generalAspects: {
        select: {
          securityQuestion: {
            select: {
              // negativeQuestion: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
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
          contractor: {
            select: {
              name: true,
              id: true,
            },
          },
          // businessArea: {
          //   select: {
          //     name: true,
          //   },
          // },
          // controller: {
          //   select: {
          //     name: true,
          //   },
          // },
        },
      },
      securityQuestion: {
        select: {
          category: {
            select: {
              name: true,
            },
          },
        },
      },
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
      area: true,
    },
  });

  return (
    <div className="bg-blue-100">
      <HeaderDateFilter companies={contractors} />

      <DashboardContent
        controlReport={controlReports}
        findingReports={findingReports}
        accidents={accidents}
        areas={areas}
        numControllers={controllers.length || 0}
        numContractors={contractors.length}
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
