import React from "react";

import { db } from "@/lib/db";
import { SetNewPasswordForm } from "../_components/set-new-password-form";

const SetNewPasswordPage = async ({
  params,
}: {
  params: { token: string };
}) => {
  let invalidToken: boolean = false;
  let message: string | undefined = undefined;

  const passwordResetToken = await db.passwordResetToken.findUnique({
    where: {
      token: params.token,
      createdAt: { gt: new Date(Date.now() - 1000 * 60 * 60 * 4) },
    },
  });

  if (!passwordResetToken) {
    invalidToken = true;
    message =
      "Solicitud de restablecimiento de contraseña no válida. Intente restablecer su contraseña nuevamente.";
  } else if (passwordResetToken.resetAt !== null) {
    invalidToken = true;

    message = "El enlace de restablecimiento de contraseña ya fue usado.";
  }

  return (
    <div className="min-h-[calc(100vh)] w-full flex justify-center bg-blue-50">
      <div className="container w-full flex items-center justify-center h-fit pt-10">
        <SetNewPasswordForm
          token={params.token}
          invalidToken={invalidToken}
          messageError={message}
          passwordResetToken={passwordResetToken}
        />
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
