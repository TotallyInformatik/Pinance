import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themeprovider";
import { ThemeToggler } from "@/components/themetoggler";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { ArrowUpCircleIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "π-nance",
  description: "π-nance",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
          >
            <SidebarProvider >
              <Sidebar collapsible="offcanvas" variant="inset">
                <SidebarHeader>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        className="data-[slot=sidebar-menu-button]:!p-1.5"
                      >
                        <a href="#">
                          <span className="text-base font-semibold">πnance</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarHeader>
                <SidebarContent >
                </SidebarContent>
                <SidebarFooter>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <div className="flex flex-1 flex-col">
                  <div className="@container/main flex flex-1 flex-col gap-2">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                      <div className="px-4 lg:px-6">
                        <ThemeToggler />
                      </div>
                    </div>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
        </body>
      </html>
    </>;
}
