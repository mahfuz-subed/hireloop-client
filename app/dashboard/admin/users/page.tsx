import { redirect } from "next/navigation"

import { UsersView } from "@/app/components/dashboard/admin/users-view"
import { PageShell } from "@/app/components/dashboard/page-shell"
import { getAdminUsers } from "@/lib/api/users"
import { getSession } from "@/lib/core/server"

/**
 * Admin / Users
 *
 * Loads every user on the server and passes them to the view. The admin check
 * runs first, so a signed-in non-admin never reaches `getAdminUsers()` (Better
 * Auth would reject the call anyway).
 */
const AdminUsersPage = async () => {
  // 1. Only a signed-in admin may open this screen.
  const session = await getSession()

  if (!session) {
    redirect("/sign-in?redirectTo=/dashboard/admin/users")
  }

  if (session.user.role !== "admin") {
    // There is no /dashboard index page, so send non-admins home.
    redirect("/")
  }

  // 2. Every user, trimmed to what the table renders.
  const users = await getAdminUsers()

  return (
    <PageShell>
      <UsersView users={users} />
    </PageShell>
  )
}

export default AdminUsersPage
