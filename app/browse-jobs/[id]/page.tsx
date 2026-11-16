import type { ReactNode } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Briefcase,
  CalendarClock,
  Euro,
  MapPin,
  type LucideIcon,
} from "lucide-react"

import { SiteNavbar } from "@/components/site-navbar"
import { Toaster } from "@/components/ui/toast"
import { JobDetailsView } from "@/app/components/jobs/job-details-view"
import { getJob, getJobs } from "@/lib/api/jobs"
import { formatCompensation, formatDate } from "@/lib/jobs-format"

type JobDetailsPageProps = {
  params: Promise<{ id: string }>
}

/**
 * Job details page: /browse-jobs/[id]
 *
 * The folder name `[id]` means "this part of the URL is a variable", so
 * /browse-jobs/123 gives us `{ id: "123" }`. Next.js only turns a folder into
 * a real page when the file is named `page.tsx`.
 */
const JobDetailsPage = async ({ params }: JobDetailsPageProps) => {
  // 1. Read the id from the URL.
  const { id } = await params

  // 2. Ask the API for that one job.
  const job = await getJob(id)

  // 3. Unknown id -> show the normal 404 page instead of crashing.
  if (!job) notFound()

  // 4. Extra data for the company card: how many jobs this company has open.
  const allJobs = await getJobs()
  const openRoles = allJobs.filter(
    (item) => item.companyName === job.companyName
  ).length

  // 5. Qualifications are typed one per line in the create form,
  //    so split the text into a list of bullet points.
  const requirements = job.qualifications
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  const remote = job.isRemote === "true"
  const location = remote ? `${job.location} (Remote)` : job.location

  return (
    <div className="min-h-svh bg-[#010103] text-zinc-100">
      <SiteNavbar />

      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
        <Link
          href="/browse-jobs"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          Back to jobs
        </Link>

        {/* Title card: the interactive part lives in JobDetailsView */}
        <div className="mt-4">
          <JobDetailsView job={job} />
        </div>

        {/* Quick facts */}
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InfoTile
            icon={Euro}
            label="Salary Range"
            value={formatCompensation(job)}
          />
          <InfoTile icon={MapPin} label="Location" value={location} />
          <InfoTile icon={Briefcase} label="Job Type" value={job.jobType} />
          <InfoTile
            icon={CalendarClock}
            label="Apply Before"
            value={formatDate(job.deadline)}
          />
        </div>

        {/* Description + company */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-4">
            <Section title="Job Description">
              <p className="text-sm leading-relaxed text-zinc-400">
                {job.responsibilities}
              </p>
            </Section>

            <Section title="Requirements">
              {requirements.length > 0 ? (
                <ul className="space-y-2">
                  {requirements.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-sm leading-relaxed text-zinc-400"
                    >
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-zinc-600"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-zinc-500">Not specified.</p>
              )}
            </Section>
          </div>

          <aside>
            <Section title="Company Overview">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-sm font-semibold text-brand"
                >
                  {job.companyName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {job.companyName}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {job.category}
                  </p>
                </div>
              </div>

              <dl className="mt-4 space-y-3 border-t border-white/10 pt-4 text-xs">
                <DetailRow label="Industry" value={job.category} />
                <DetailRow label="Location" value={job.location} />
                <DetailRow label="Open roles" value={String(openRoles)} />
                <DetailRow label="Employment" value={job.jobType} />
              </dl>

              <Link
                href="/browse-jobs"
                className="mt-4 flex h-9 items-center justify-center rounded-md border border-white/10 text-xs text-zinc-200 transition-colors hover:bg-white/5"
              >
                Browse all jobs
              </Link>
            </Section>
          </aside>
        </div>
      </main>

      {/* Lets the Apply button show success / error messages. */}
      <Toaster />
    </div>
  )
}

/** A small card with an icon, a label and a value. */
function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface p-3.5">
      <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-zinc-500 uppercase">
        <Icon aria-hidden className="size-3.5" />
        {label}
      </div>
      <p className="mt-1.5 text-sm font-medium text-zinc-100">{value}</p>
    </div>
  )
}

/** A bordered card with a heading. */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-white/10 bg-surface p-5">
      <h2 className="text-sm font-semibold text-zinc-100">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** One `label ... value` line inside a card. */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-zinc-500">{label}</dt>
      <dd className="truncate text-right text-zinc-200">{value}</dd>
    </div>
  )
}

export default JobDetailsPage
