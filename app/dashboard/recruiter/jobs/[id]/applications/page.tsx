import { notFound, redirect } from "next/navigation"

import { JobApplicationsView } from "@/app/components/dashboard/applications/job-applications-view"
import { PageShell } from "@/app/components/dashboard/page-shell"
import { getApplications } from "@/lib/actions/application"
import { getJob } from "@/lib/api/jobs"
import { getSession } from "@/lib/core/server"

type JobApplicationsPageProps = {
  /** `[id]` is the job id from the URL, exactly like /browse-jobs/[id]. */
  params: Promise<{ id: string }>
}

/**
 * Recruiter / Jobs / [id] / Applications
 *
 * Lists everyone who applied to one job. Everything is loaded on the server,
 * so the browser never receives another recruiter's applicants.
 *
 * The status dropdown only changes on screen; the API call is left to be added
 * inside `ApplicationStatusSelect`.
 */
const JobApplicationsPage = async ({ params }: JobApplicationsPageProps) => {
  const { id } = await params

  // 1. Only a signed-in recruiter may open this screen.
  const session = await getSession()

  if (!session) {
    redirect(`/sign-in?redirectTo=/dashboard/recruiter/jobs/${id}/applications`)
  }

  if (session.user.role !== "recruiter") {
    // There is no /dashboard index page, so send non-recruiters home.
    redirect("/")
  }

  // 2. Load the job. An unknown id gets the normal 404 page.
  const job = await getJob(id)
  if (!job) notFound()

  // 3. A recruiter may only read applicants for their own postings.
  if (job.recruiterId !== session.user.id) notFound()

  // 4. Every application for this job, newest first (the API sorts them).
  const applications = await getApplications(`jobId=${id}`)

  return (
    <PageShell>
      <JobApplicationsView job={job} applications={applications} />
    </PageShell>
  )
}

export default JobApplicationsPage
