"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"

import { JobApplicantsTable } from "@/app/components/dashboard/applications/job-applicants-table"
import { JobApplicationStats } from "@/app/components/dashboard/applications/job-application-stats"
import { PageHeader } from "@/app/components/dashboard/page-shell"
import { TablePagination } from "@/app/components/dashboard/table-pagination"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  APPLICATION_STATUS_STYLES,
  getJobApplicationStats,
} from "@/lib/applications-format"
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationStatus,
} from "@/types/application"
import type { JobRow } from "@/types/job"

/** Applicants shown per page. */
const PAGE_SIZE = 8

type StatusFilter = "all" | ApplicationStatus

/**
 * The recruiter "applicants for this job" screen.
 *
 * The page loads the data on the server and passes it in as props, so this
 * component only keeps UI state: the search text, the status filter and the
 * current page. No fetching happens here.
 */
export function JobApplicationsView({
  job,
  applications,
}: {
  job: JobRow
  applications: Application[]
}) {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<StatusFilter>("all")
  const [page, setPage] = React.useState(1)

  // 1. Search by name or email, then keep only the chosen status.
  const search = query.trim().toLowerCase()
  const filtered = applications.filter((application) => {
    const matchesStatus = status === "all" || application.status === status
    const matchesSearch =
      search === "" ||
      application.seekerName.toLowerCase().includes(search) ||
      application.seekerEmail.toLowerCase().includes(search)

    return matchesStatus && matchesSearch
  })

  // 2. Cut out the rows for the current page.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // A filter can leave fewer pages than the one we were on.
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * PAGE_SIZE
  const pageApplications = filtered.slice(firstIndex, firstIndex + PAGE_SIZE)

  // The cards describe the whole job, not the filtered slice.
  const stats = getJobApplicationStats(applications)

  function changeQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  function changeStatus(value: StatusFilter) {
    setStatus(value)
    setPage(1)
  }

  const remote = job.isRemote === "true"

  return (
    <>
      <PageHeader
        breadcrumb={
          <>
            <Link
              href="/dashboard/recruiter/jobs"
              className="transition-colors hover:text-zinc-300"
            >
              Manage Jobs
            </Link>
            <span aria-hidden>/</span>
            <span className="max-w-[140px] truncate sm:max-w-none">
              {job.title}
            </span>
            <span aria-hidden>/</span>
            <span className="text-brand">Applications</span>
          </>
        }
        title={`Applicants for ${job.title}`}
        description={`${job.companyName} · ${job.jobType} · ${
          remote ? `Remote (${job.location})` : job.location
        }`}
        action={
          <Button
            render={<Link href="/dashboard/recruiter/jobs" />}
            nativeButton={false}
            variant="outline"
            size="lg"
            className="w-full gap-1.5 sm:w-auto"
          >
            <ArrowLeft size={14} />
            Back to jobs
          </Button>
        }
      />

      <JobApplicationStats stats={stats} />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500"
          />
          <Input
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search applicants"
            className="pl-8 text-xs"
          />
        </div>

        <label className="flex items-center gap-2 text-[11px] text-zinc-500">
          Status
          <select
            value={status}
            onChange={(event) =>
              changeStatus(event.target.value as StatusFilter)
            }
            className="h-8 rounded-lg border border-zinc-800 bg-surface px-2.5 text-xs text-zinc-200 outline-none focus-visible:border-zinc-600"
          >
            <option value="all">All</option>
            {APPLICATION_STATUSES.map((value) => (
              <option key={value} value={value}>
                {APPLICATION_STATUS_STYLES[value].label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4">
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
            No one has applied to this job yet.
          </div>
        ) : pageApplications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
            No applicants match your search or status filter.
          </div>
        ) : (
          <>
            <JobApplicantsTable applications={pageApplications} />

            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel={filtered.length === 1 ? "applicant" : "applicants"}
            />
          </>
        )}
      </div>
    </>
  )
}
