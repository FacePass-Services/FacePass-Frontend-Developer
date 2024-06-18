// app/layout.tsx
"use client";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import "./globals.css";
import ToolsBar from "@/components/ToolsBar";
import ConsoleBar from "@/components/console/ToolsBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${inter.className} dark:dark bg-secondary dark:bg-secondary-dark`}
      >
        {pathname === "/console" ? (
          <ConsoleBar />
        ) : pathname.startsWith("/console/") ? (
          <div></div>
        ) : (
          <ToolsBar />
        )}
        {/* {pathname !== '/console' && !pathname.startsWith('/project') && <ToolsBar />} */}
        <section className="VStack w-full items-center">{children}</section>
      </body>
    </html>
  );
}
