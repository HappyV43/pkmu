"use client"

import {
  LogOut,
} from "lucide-react"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function LogoutSidebar({
  onLogout,
}: {
  onLogout: () => void
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="justify-center items-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-2 justify-center items-center" />
          <span>Logout</span>
        </SidebarMenuButton>  
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
