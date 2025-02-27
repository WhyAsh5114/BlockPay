import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import getConfig from "next/config";
import { headers } from "next/headers";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import { cookieToInitialState } from "wagmi";
import { Providers } from "../providers";
import { DockDemo } from "@/components/BottomDock";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );

  return (
    <Providers initialState={initialState}>
      <main className="p-4 space-y-4">{children}</main>
      <DockDemo />
      <Toaster />
    </Providers>
  );
}
