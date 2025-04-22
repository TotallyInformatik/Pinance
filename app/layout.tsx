'use client'
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider";
import { SidebarSituation } from "@/components/sidebarsituation";
import { useEffect, useState } from "react";
import { getAllTransactions, initDB } from "@/lib/db/sqlite";
import { Toaster } from "sonner";
import { Loading } from "@/components/loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [dbLoaded, setDBLoaded] = useState<boolean>(false);

  useEffect(() => {    
    (async () => {
      await initDB();
      setDBLoaded(true);

      const transactions = await getAllTransactions()
      console.log(transactions)

    })();

  }, [])

  return <html lang="en" suppressHydrationWarning>
    <head />
    <body>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
      >
        {

          dbLoaded && 
            <SidebarSituation>
              {children}
            </SidebarSituation>
        }
      </ThemeProvider>
      <Toaster />
    </body>
  </html>;
}
