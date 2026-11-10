import Link from "next/link"
import {
  Code2,
  Globe,
  MapPin,
  Pencil,
  Trash2,
  MoreVertical,
  Plus,
  Users,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Job } from "@/app/dashboard/recruiter/jobs/new/page" // change if you moved it

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"

// the API also returns _id, which we need for the row key
type JobRow = Job & { _id: string }

const FREQ: Record<string, string> = {
  "per hour": "hr",
  "per month": "mo",
  "per year": "yr",
}

const money = (value: string) => {
  const n = Number(value)
  return n >= 1000 ? `€${n / 1000}k` : `€${n}`
}

const compensation = (job: JobRow) => {
  if (!job.minSalary && !job.maxSalary) return "—"
  return `${money(job.minSalary)} – ${money(job.maxSalary)} / ${FREQ[job.frequency] ?? job.frequency}`
}

const formatDate = (date: string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      })
    : "—"

async function getJobs(): Promise<JobRow[]> {
  const res = await fetch(`${BASE_URL}/jobs`, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`)
  return res.json()
}

const ManageJobsPage = async () => {
  const jobs = await getJobs()

  return (
    <div className="mx-auto max-w-6xl p-8 text-zinc-100">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-[11px] text-zinc-500">
            Manage Jobs /{" "}
            <span className="text-indigo-400">Job Listings &amp; Postings</span>
          </p>
          <h1 className="text-2xl font-bold">Manage Job Posts</h1>
          <p className="mt-1 text-xs text-zinc-500">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-400"
        >
          <Plus size={14} />
          New Job Post
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-[#111113]">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              {[
                "Job Title & Dept",
                "Company & Location",
                "Type",
                "Compensation",
                "Applicants",
                "Status",
                "Deadline",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="h-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"
                >
                  {h}
                </TableHead>
              ))}
              <TableHead className="h-11 text-right text-[10px] font-medium tracking-wider text-zinc-500 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {jobs.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={8}
                  className="py-10 text-center text-sm text-zinc-500"
                >
                  No jobs posted yet.
                </TableCell>
              </TableRow>
            )}

            {jobs.map((job) => {
              const remote = job.isRemote === "true"
              return (
                <TableRow
                  key={job._id}
                  className="border-zinc-800/60 hover:bg-white/[0.02]"
                >
                  {/* Title & category */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1a1a1d] text-indigo-400">
                        <Code2 size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{job.title}</p>
                        <p className="text-[11px] text-sky-400">
                          {job.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company & location */}
                  <TableCell>
                    <p className="text-xs font-medium">{job.companyName}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-zinc-500">
                      {remote ? <Globe size={12} /> : <MapPin size={12} />}
                      {remote ? `Remote (${job.location})` : job.location}
                    </p>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <span className="rounded-full bg-[#1a1a1d] px-2.5 py-1 text-[10px] text-zinc-300">
                      {job.jobType}
                    </span>
                  </TableCell>

                  {/* Compensation */}
                  <TableCell className="text-xs">{compensation(job)}</TableCell>

                  {/* Applicants (static for now) */}
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs text-indigo-300">
                      <Users size={14} />0 Candidates
                    </span>
                  </TableCell>

                  {/* Status (static for now) */}
                  <TableCell>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </TableCell>

                  {/* Deadline */}
                  <TableCell className="text-xs text-zinc-300">
                    {formatDate(job.deadline)}
                  </TableCell>

                  {/* Actions (static) */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 rounded-md bg-indigo-500/15 px-3 py-1.5 text-[11px] text-indigo-300 hover:bg-indigo-500/25"
                      >
                        <Pencil size={12} />
                        Update
                      </button>
                      <button
                        type="button"
                        aria-label="Delete job"
                        className="rounded-md bg-[#1a1a1d] p-1.5 text-zinc-400 hover:text-zinc-200"
                      >
                        <Trash2 size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="More actions"
                        className="rounded-md p-1.5 text-zinc-500 hover:text-zinc-300"
                      >
                        <MoreVertical size={14} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ManageJobsPage
