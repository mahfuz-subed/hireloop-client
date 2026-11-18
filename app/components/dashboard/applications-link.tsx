import Link from "next/link"
import { Users } from "lucide-react"

import { cn } from "@/lib/utils"

type ApplicationsLinkProps = {
  jobId: string
  /**
   * Keep the "Applications" text at every width. The mobile job card has room
   * for it; the desktop table only shows the text from `xl` upwards and an
   * icon-only button below that, so the Actions column stays narrow.
   */
  withLabel?: boolean
  className?: string
}

/**
 * Shortcut to one job's applicants:
 *
 *   /dashboard/recruiter/jobs/[id]/applications
 *
 * Shared by the desktop job table and the mobile `JobCard` so both always
 * point to the same place.
 */
export function ApplicationsLink({
  jobId,
  withLabel = false,
  className,
}: ApplicationsLinkProps) {
  return (
    <Link
      href={`/dashboard/recruiter/jobs/${jobId}/applications`}
      title="View applications"
      aria-label="View applications for this job"
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1 rounded-lg bg-indigo-500/10 px-2.5 text-[11px] font-medium text-indigo-300 transition-colors hover:bg-indigo-500/20",
        !withLabel && "w-7 px-0 xl:w-auto xl:px-2.5",
        className
      )}
    >
      <Users aria-hidden className="size-3.5" />
      <span className={withLabel ? undefined : "hidden xl:inline"}>
        Applications
      </span>
    </Link>
  )
}
