import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { TitleOnPage } from "@/components/title-on-page";

import { db } from "@/lib/db";

import { UserNotAuthorized } from "@/components/user-not-authorized";
import { authOptions } from "@/lib/auth-options";
import { ProfileForm } from "../../_components/profile-form";

const crumbs = [{ label: "Perfil", path: "perfil" }];

const ProfilePage = async () => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    redirect("/");
  }

  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
      active: true,
    },
  });

  if (!user) {
    return <UserNotAuthorized />;
  }

  return (
    <div>
      <TitleOnPage text="Datos de usuario" bcrumb={crumbs} />

      <div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
};

export default ProfilePage;
