"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/auth-client"
import type { MenuItemsByRole } from "@/types/dashboard"
import {
  Bookmark,
  Briefcase,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react"

const menuItemsByRole: MenuItemsByRole = {
  seeker: [
    { name: "Dashboard", url: "/dashboard/seeker", icon: LayoutDashboard },
    { name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    {
      name: "Applications",
      url: "/dashboard/seeker/applications",
      icon: FileText,
    },
    { name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCard },
    { name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],

  recruiter: [
    { name: "Dashboard", url: "/dashboard/recruiter", icon: LayoutDashboard },
    { name: "Manage Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    {
      name: "Add Jobs",
      url: "/dashboard/recruiter/jobs/new",
      icon: PlusCircle,
    },
    {
      name: "Applications",
      url: "/dashboard/recruiter/applications",
      icon: FileText,
    },
    { name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],

  admin: [
    { name: "Dashboard", url: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Users", url: "/dashboard/admin/users", icon: Users },
    { name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { name: "Payments", url: "/dashboard/admin/payments", icon: CreditCard },
    { name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

export function DashbaordSidebar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()
  const role = session?.user?.role || "seeker"
  const items = menuItemsByRole[role]

  // Longest matching URL wins so nested routes light up only their own item
  // (e.g. /jobs/new highlights "Add Jobs", not "Manage Jobs").
  const activeUrl = items
    .map((item) => item.url)
    .filter((url) => pathname === url || pathname.startsWith(`${url}/`))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link
          href="/"
          aria-label="HireLoop home"
          className="flex h-12 items-center px-1"
        >
          <Image
            src="/logo.png"
            alt="HireLoop"
            width={132}
            height={36}
            priority
          />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isPending
                ? Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuItem key={index}>
                      <div className="flex h-8 items-center gap-2 rounded-md px-2">
                        <Skeleton className="size-4 rounded-md" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </SidebarMenuItem>
                  ))
                : items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        isActive={activeUrl === item.url}
                        tooltip={item.name}
                        render={<Link href={item.url} />}
                      >
                        <item.icon />
                        <span>{item.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
