
import { getServerSession } from "next-auth";
import { UserNotAuthorized } from "@/components/user-not-authorized";
import { authOptions } from "@/lib/auth-options";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user?.role !== "ADMIN")) {
    return <UserNotAuthorized />;
  }
  return <div className="relative">{children}</div>;
}