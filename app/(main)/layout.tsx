import { Roboto } from "next/font/google";
import { getServerSession } from "next-auth";
import { ScrollUp } from "@/components/scroll-up";
import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { RedirectAfterLogin } from "./_components/redirect-after-login";
import { authOptions } from "@/lib/auth-options";
import { Navbar } from "./_components/navbar/navbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.role) {
    return <RedirectAfterLogin />;
  }

  const { user } = await session;

  return (
    <div>
      <main
        className={cn(
          "relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto bg-slate-500"
        )}
      >
        <Navbar
          name={user?.name || ""}
          isAdmin={user.role === "ADMIN"}
        />
        <div className=" md:pl-48 min-h-screen xl:flex justify-center items-start xl:w-full relative">
          <div className="mt-[48px] max-w-[1200px] w-full mx-auto bg-white min-h-[calc(100vh-48px)]">
            {children}
          </div>
        </div>
        <ScrollUp />
        {/* <Footer /> */}
      </main>
    </div>
  );
}
