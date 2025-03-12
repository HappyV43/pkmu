"use client";

import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import Image from "next/image";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { logOut } from "@/app/actions/auth.actions";
import { LogoutSidebar } from "./LogoutSidebar";
import { MainSidebar } from "./MainSidebar";
import { SummarySidebar } from "./SummarySidebar";
import { MasterSidebar } from "./MasterSidebar";
import { sidebarItems } from "@/constants/sidebarItems.constant";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const handleClick = async () => {
    const result = await logOut();
    if (result?.error) {
      toast({
        title: "Gagal",
        description: result.error,
        variant: "destructive",
        duration: 3000,
      });
    } else {
      toast({
        title: "Logout berhasil",
        duration: 3000,
      });
    }
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex justify-center items-center">
        <Image src="/icon.svg" width={125} height={125} alt="Icon PKMU" />
      </SidebarHeader>
      <SidebarContent>
        <SummarySidebar items={sidebarItems.summary} />
        <MainSidebar items={sidebarItems.dashboard} />
        <MasterSidebar items={sidebarItems.masterData} />
      </SidebarContent>
      <SidebarFooter>
        <LogoutSidebar onLogout={handleClick} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
