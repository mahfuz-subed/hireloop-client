import { Code2, Globe, MapPin, Users } from "lucide-react"

import { DeleteJobs } from "@/app/components/dashboard/deleteJobs"
import { ApplicationsLink } from "@/app/components/dashboard/applications-link"
import { JobStatusBadge } from "@/app/components/dashboard/status-badge"
import { UpdateJobs } from "@/app/components/dashboard/updateJobs"
import { formatCompensation, formatDate, timeAgo } from "@/lib/jobs-format"
import type { JobRow } from "@/types/job"

/** Mobile presentation of a job row. The table is used from `md` upwards. */
export function JobCard({ job }: { job: JobRow }) {
  const remote = job.isRemote === "true"
  const applicants = job.applicants ?? 0
  const posted = job.posted ? timeAgo(job.posted) : ""

  return (
    <article className="rounded-xl border border-zinc-800 bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-brand">
            <Code2 size={16} />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{job.title}</h2>
            <p className="truncate text-[11px] text-sky-400">{job.category}</p>
          </div>
        </div>
        <JobStatusBadge status={job.status} />
      </div>

      <dl className="mt-4 space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Company</dt>
          <dd className="truncate text-zinc-200">{job.companyName}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Location</dt>
          <dd className="flex min-w-0 items-center gap-1 text-zinc-200">
            {remote ? <Globe size={12} /> : <MapPin size={12} />}
            <span className="truncate">
              {remote ? `Remote (${job.location})` : job.location}
            </span>
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Type</dt>
          <dd className="text-zinc-200">{job.jobType}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Compensation</dt>
          <dd className="text-zinc-200">{formatCompensation(job)}</dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Applicants</dt>
          <dd className="flex items-center gap-1.5 text-indigo-300">
            <Users size={12} />
            {applicants} {applicants === 1 ? "Candidate" : "Candidates"}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="w-24 shrink-0 text-zinc-500">Deadline</dt>
          <dd className="text-zinc-200">
            {formatDate(job.deadline)}
            {posted ? <span className="text-zinc-500"> · {posted}</span> : null}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-zinc-800/60 pt-3">
        <ApplicationsLink jobId={job._id} withLabel />
        <UpdateJobs job={job} />
        <DeleteJobs job={job} />
      </div>
    </article>
  )
}
