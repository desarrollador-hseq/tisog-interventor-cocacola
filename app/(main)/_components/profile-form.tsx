"use client";

import { User } from "@prisma/client";
import { FieldUpdateForm } from "@/components/field-update-form";
import { UpdatePasswordForm } from "./update-password-form";
import { CheckReceiveNotifications } from "../admin/_components/check-receive-notifications";
// import { CheckReceiveNotifications } from "../admin/_components/check-receive-notifications";

export const ProfileForm = ({ user }: { user: User | null }) => {
  if (!user) {
    return <div>Sin información del usuario</div>;
  }

  return (
    <div className="max-w-[1500px] w-full h-full mx-auto bg-white rounded-md shadow-sm overflow-y-hidden p-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-1 mb-7 w-full">
        <div className="space-y-4">
          <FieldUpdateForm
            field="name"
            disabled={false}
            apiUrl={`/api/user`}
            label="Nombre"
            id={user?.id}
            value={user?.name}
          />

          <FieldUpdateForm
            field="email"
            disabled={true}
            apiUrl={`/api/user`}
            label="Correo Electrónico"
            id={user?.id}
            value={user?.email}
          />

          {user.role !== "USER" && (
            <CheckReceiveNotifications
              id={user?.id}
              check={!!user?.receiveNotifications || false}
            />
          )}
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  );
};
