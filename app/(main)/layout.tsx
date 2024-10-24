import { getServerSession } from "next-auth";
import { ScrollUp } from "@/components/scroll-up";
import { cn } from "@/lib/utils";
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
      <div
        style={{
          background: `url('/blob-scene.svg')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          minHeight: "100vh",
          overflow: "auto",
          width: "100%",
          minWidth: "100%",
          height: "100%",
          position: "fixed",
        }}
        className="non-print"
      />
      <main
        className={cn(
          "relative flex flex-col h-full min-h-screen m-0 p-0 mx-auto bg-transparent"
        )}
      >
        <Navbar
          name={user?.name || ""}
          isAdmin={user.role === "ADMIN"}
          isViewer={user.role === "VIEWER"}
          isMaster={user.isMaster || false}
        />
        <div
          className={cn(
            "min-h-screen xl:flex justify-center items-start xl:w-full relative",
            user.role !== "VIEWER" && "md:pl-48"
          )}
        >
          <div className="mt-[48px] max-w-[1200px] w-full mx-auto bg-white min-h-[calc(100vh-48px)]">
            {children}
          </div>
        </div>
        <ScrollUp />
        <footer className={cn("footer h-10 w-full bg-blue-900 flex items-center z-30 md:ps-[95px] mt-3",  user.role === "VIEWER" && "md:ps-0" )}>
          <div className={cn("w-full mx-auto flex justify-center gap-1 text-white text-sm md:ps-[95px]", user.role === "VIEWER" && "md:ps-0" )}>
            <span>2024</span>
            <p className="text-sm">&copy; Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
