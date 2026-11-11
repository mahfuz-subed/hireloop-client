import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { DashbaordSidebar } from "@/app/components/dashboard/dashboard-sidebar"
import { Toaster } from "@/components/ui/toast"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashbaordSidebar />
      <SidebarInset className="min-w-0 bg-background text-foreground">
        <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center border-b border-border/60 bg-background/80 px-2 backdrop-blur sm:px-3">
          <SidebarTrigger />
        </header>
        <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
