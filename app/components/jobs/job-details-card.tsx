"use client"

import { Bookmark } from "lucide-react"

import { formatDate } from "@/lib/jobs-format"
import { cn } from "@/lib/utils"
import type { JobRow } from "@/types/job"

type JobDetailsCardProps = {
  /** The job to display. */
  job: JobRow
  /** `true` when the user has saved this job (controls the filled bookmark). */
  saved?: boolean
  /** Called when the bookmark icon is clicked. */
  onSave?: (job: JobRow) => void
  /** Called when "Apply Now" is clicked. */
  onApply?: (job: JobRow) => void
  /** `true` while the application is being saved, to disable the button. */
  isApplying?: boolean
}

/**
 * The title card at the top of the job details page.
 *
 * This component is "dumb": it only displays the props it is given and calls
 * `onSave` / `onApply` when a button is clicked. It stores nothing.
 * That is why all the interactive logic lives in `JobDetailsView`.
 */
export function JobDetailsCard({
  job,
  saved = false,
  onSave,
  onApply,
  isApplying = false,
}: JobDetailsCardProps) {
  const remote = job.isRemote === "true"
  const location = remote ? `${job.location} (Remote)` : job.location

  return (
    <section className="rounded-xl border border-white/10 bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            aria-hidden
            className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-lg font-semibold text-brand"
          >
            {job.companyName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-zinc-100 sm:text-2xl">
              {job.title}
            </h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
              <span>{job.companyName}</span>
              <span aria-hidden>•</span>
              <span>{location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={saved ? `Unsave ${job.title}` : `Save ${job.title}`}
            aria-pressed={saved}
            onClick={() => onSave?.(job)}
            className={cn(
              "flex size-9 items-center justify-center rounded-md border border-white/10 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
              saved ? "text-brand" : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            <Bookmark
              aria-hidden
              className={cn("size-4", saved && "fill-current")}
            />
          </button>

          <button
            type="button"
            onClick={() => onApply?.(job)}
            disabled={isApplying}
            className="h-9 rounded-md bg-white px-4 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplying ? "Applying..." : "Apply Now"}
          </button>
        </div>
      </div>

      <p className="mt-4 border-t border-white/10 pt-3 text-[11px] text-zinc-500">
        Posted {formatDate(job.posted)} · {job.applicants} applicants
      </p>
    </section>
  )
}
