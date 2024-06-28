import React from "react";
import { getServerSession } from "next-auth";
import { ControlIndicators } from "./_components/control-indicators";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth-options";
import { UserNotAuthorized } from "@/components/user-not-authorized";

const UserControllerPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user.email) {
    return <UserNotAuthorized />;
  }

  const { user } = session;

  const controls = await db.controlReport.findMany({
    where: {
      controllerId: user.id,
    },
    include: {
      contractor: true,
      businessArea: true,
      findingReport: {
        select: {
          id: true,
        }
      }
    },
  });

  const areas = await db.businessAreas.findMany({
    where: {
      active: true,
    },
  });

  return (
    <div>
      <ControlIndicators controlReports={controls} areas={areas} />
    </div>
  );
};

export default UserControllerPage;
