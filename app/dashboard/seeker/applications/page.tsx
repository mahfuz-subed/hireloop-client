import { ApplicationsView } from "@/app/components/dashboard/applications/applications-view"
import { PageShell } from "@/app/components/dashboard/page-shell"
import { getApplications } from "@/lib/actions/application"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

/**
 * Seeker / My Applications
 *
 * Right now the list comes from `lib/dummy-applications.ts`.
 * When you are ready to show real data, replace the import with:
 *
 *   import { getApplications } from "@/lib/actions/application"
 *   const applications = await getApplications({ seekerId: user.id })
 *
 * and pass `applications` to `<ApplicationsView />` instead of the dummy list.
 */
const MyApplicationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const applications = await getApplications({ seekerId: session?.user.id })
  return (
    <PageShell>
      <ApplicationsView applications={applications} />
    </PageShell>
  )
}

export default MyApplicationsPage
