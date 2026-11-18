import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { ApplicationsView } from "@/app/components/dashboard/applications/applications-view"
import { PageShell } from "@/app/components/dashboard/page-shell"
import { getApplications } from "@/lib/actions/application"
import { auth } from "@/lib/auth"

/**
 * Seeker / My Applications
 *
 * The page runs on the server, so it can read the session directly and send
 * the logged-in user's id to the API as `?seekerId=...`.
 */
const MyApplicationsPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Without a session there is no `seekerId`, and the API would answer with
  // every application in the database. Send signed-out visitors to sign in.
  if (!session) {
    redirect("/sign-in?redirectTo=/dashboard/seeker/applications")
  }

  const applications = await getApplications(`seekerId=${session.user.id}`)

  return (
    <PageShell>
      <ApplicationsView applications={applications} />
    </PageShell>
  )
}

export default MyApplicationsPage
