import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { DashbaordSidebar } from "@/app/components/dashboard/dashboard-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashbaordSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}
