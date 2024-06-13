import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { signOut } from "next-auth/react";

import { authOptions } from "@/lib/auth-options";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "ADMIN") {
      redirect("/admin/");
    } else if (session.user.role === "USER") {
      redirect("/analista/");
    } else {
      signOut();
    }
  }
  return (
    <div className="w-full">
      <div className=" w-full">{children}</div>
    </div>
  );
};

export default AuthLayout;
