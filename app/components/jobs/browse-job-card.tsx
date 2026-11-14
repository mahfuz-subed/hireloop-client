"use client"

import type { ReactNode } from "react"
import {
  Bookmark,
  Briefcase,
  Euro,
  Globe,
  MapPin,
  type LucideIcon,
} from "lucide-react"

import { formatSalaryRange } from "@/lib/jobs-format"
import { cn } from "@/lib/utils"
import type { JobRow } from "@/types/job"
import { useRouter } from "next/navigation"

type BrowseJobCardProps = {
  job: JobRow
  onSave?: (job: JobRow) => void
  className?: string
}

/** Public job listing card used on the browse-jobs results list. */
export function BrowseJobCard({ job, onSave, className }: BrowseJobCardProps) {
  const remote = job.isRemote === "true"
  const router = useRouter()

  function handleViewJobDetail(jobId: string) {
    router.push(`/browse-jobs/${jobId}`)
  }

  return (
    <article
      role="link"
      tabIndex={0}
      onClick={() => handleViewJobDetail(job._id)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          handleViewJobDetail(job._id)
        }
      }}
      className={cn(
        "cursor-pointer rounded-xl border border-white/10 bg-surface p-4 transition-colors hover:border-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-sm font-semibold text-brand"
        >
          {job.companyName.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-zinc-100">
                {job.title}
              </h2>
              <p className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[11px] text-zinc-500">
                <span className="truncate">{job.companyName}</span>
                <span aria-hidden>•</span>
                {remote ? (
                  <Globe aria-hidden className="size-3 shrink-0" />
                ) : (
                  <MapPin aria-hidden className="size-3 shrink-0" />
                )}
                <span className="truncate">
                  {remote ? `${job.location} (Remote)` : job.location}
                </span>
              </p>
            </div>

            <button
              type="button"
              aria-label={`Save ${job.title}`}
              onClick={(event) => {
                // Stop the card's onClick from also opening the details page.
                event.stopPropagation()
                onSave?.(job)
              }}
              className="shrink-0 rounded-md p-1 text-zinc-500 transition-colors hover:bg-white/5 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            >
              <Bookmark aria-hidden className="size-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <MetaBadge icon={Euro}>{formatSalaryRange(job)}</MetaBadge>
            <MetaBadge icon={Briefcase}>{job.jobType}</MetaBadge>
            {remote ? <MetaBadge icon={Globe}>Remote</MetaBadge> : null}
            {job.status === "expired" ? (
              <MetaBadge icon={Briefcase} className="text-destructive">
                Expired
              </MetaBadge>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function MetaBadge({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-surface-muted px-2 py-1 text-[11px] whitespace-nowrap text-zinc-300",
        className
      )}
    >
      <Icon aria-hidden className="size-3 shrink-0 text-zinc-500" />
      {children}
    </span>
  )
}
