import type { Metadata, Viewport } from "next";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { LoadingProvider } from "@/components/providers/loading-provider";
import { Toaster } from "sonner";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Tisog interventoria HSE | Coca-Cola",
  description:
    "Sistema de interventoría para la gestión y supervisión eficiente de proyectos empresariales. Facilita el seguimiento de controles, reportes y auditorías para asegurar la calidad y cumplimiento de los estándares de seguridad.",
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  userScalable: false,
  maximumScale: 1,
  minimumScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NextAuthProvider>
      <html className={`${roboto.className} antialiased`} lang="es">
        <LoadingProvider>
          <Toaster richColors position="top-center" closeButton />
          {children}
        </LoadingProvider>
      </html>
    </NextAuthProvider>
  );
}
