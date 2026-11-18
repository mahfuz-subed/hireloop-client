import Link from "next/link"
import { redirect } from "next/navigation"
import { Code2, Globe, MapPin, Plus, Users } from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { getJobs } from "@/lib/api/jobs"
import { formatCompensation, formatDate, timeAgo } from "@/lib/jobs-format"
import { DeleteJobs } from "@/app/components/dashboard/deleteJobs"
import { UpdateJobs } from "@/app/components/dashboard/updateJobs"
import { ApplicationsLink } from "@/app/components/dashboard/applications-link"
import { JobCard } from "@/app/components/dashboard/job-card"
import { JobStatusBadge } from "@/app/components/dashboard/status-badge"
import { PageHeader, PageShell } from "@/app/components/dashboard/page-shell"
import { getSession } from "@/lib/core/server"

const headClass =
  "h-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"

const ManageJobsPage = async () => {
  const session = await getSession()

  // No session -> `recruiterId=undefined` would match nothing. Bounce instead.
  if (!session) redirect("/sign-in?redirectTo=/dashboard/recruiter/jobs")
  // There is no /dashboard index page, so send non-recruiters home.
  if (session.user.role !== "recruiter") redirect("/")

  const jobs = await getJobs(`recruiterId=${session.user.id}`)

  return (
    <PageShell>
      <PageHeader
        breadcrumb={
          <>
            Manage Jobs /{" "}
            <span className="text-brand">Job Listings &amp; Postings</span>
          </>
        }
        title="Manage Job Posts"
        description="Review live listings, monitor applicants, and update job details across your organization."
        action={
          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            nativeButton={false}
            variant="brand"
            size="lg"
            className="w-full gap-1.5 sm:w-auto"
          >
            <Plus size={14} />
            New Job Post
          </Button>
        }
      />

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
          No jobs posted yet.
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-xl border border-zinc-800 bg-surface md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className={headClass}>
                    Job Title &amp; Dept
                  </TableHead>
                  <TableHead className={headClass}>
                    Company &amp; Location
                  </TableHead>
                  <TableHead className={`${headClass} hidden xl:table-cell`}>
                    Type
                  </TableHead>
                  <TableHead className={`${headClass} hidden xl:table-cell`}>
                    Compensation
                  </TableHead>
                  <TableHead className={`${headClass} hidden xl:table-cell`}>
                    Applicants
                  </TableHead>
                  <TableHead className={headClass}>Status</TableHead>
                  <TableHead className={`${headClass} hidden xl:table-cell`}>
                    Deadline
                  </TableHead>
                  <TableHead className={`${headClass} text-right`}>
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {jobs.map((job) => {
                  const remote = job.isRemote === "true"
                  const applicants = job.applicants ?? 0

                  return (
                    <TableRow
                      key={job._id}
                      className="border-zinc-800/60 hover:bg-white/[0.02]"
                    >
                      {/* Title & category */}
                      <TableCell>
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-brand">
                            <Code2 size={16} />
                          </div>
                          <div className="min-w-0">
                            <p className="max-w-[150px] truncate text-xs font-semibold xl:max-w-none">
                              {job.title}
                            </p>
                            <p className="max-w-[150px] truncate text-[11px] text-sky-400 xl:max-w-none">
                              {job.category}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Company & location */}
                      <TableCell>
                        <p className="max-w-[140px] truncate text-xs font-medium xl:max-w-none">
                          {job.companyName}
                        </p>
                        <p className="mt-0.5 flex max-w-[140px] items-center gap-1 text-[11px] text-zinc-500 xl:max-w-none">
                          {remote ? (
                            <Globe size={12} className="shrink-0" />
                          ) : (
                            <MapPin size={12} className="shrink-0" />
                          )}
                          <span className="truncate">
                            {remote ? `Remote (${job.location})` : job.location}
                          </span>
                        </p>
                      </TableCell>

                      {/* Type */}
                      <TableCell className="hidden xl:table-cell">
                        <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[10px] text-zinc-300">
                          {job.jobType}
                        </span>
                      </TableCell>

                      {/* Compensation */}
                      <TableCell className="hidden text-xs xl:table-cell">
                        {formatCompensation(job)}
                      </TableCell>

                      {/* Applicants */}
                      <TableCell className="hidden xl:table-cell">
                        <span className="flex items-center gap-1.5 text-xs text-indigo-300">
                          <Users size={14} />
                          {applicants}{" "}
                          {applicants === 1 ? "Candidate" : "Candidates"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <JobStatusBadge status={job.status} />
                      </TableCell>

                      {/* Deadline */}
                      <TableCell className="hidden text-xs text-zinc-300 xl:table-cell">
                        {formatDate(job.deadline)}
                        {job.posted && (
                          <p className="mt-0.5 text-[10px] text-zinc-500">
                            {timeAgo(job.posted)}
                          </p>
                        )}
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <ApplicationsLink jobId={job._id} />
                          <UpdateJobs job={job} />
                          <DeleteJobs job={job} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  )
}

export default ManageJobsPage
