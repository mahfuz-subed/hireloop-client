import { cn } from "@/lib/utils"
import { JOB_STATUS_STYLES } from "@/lib/jobs-format"
import type { JobStatus } from "@/types/job"

/** Small green/grey pill used by both the table and the mobile cards. */
export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus
  className?: string
}) {
  const style = JOB_STATUS_STYLES[status] ?? JOB_STATUS_STYLES.expired

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap",
        style.badge,
        className
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
      {style.label}
    </span>
  )
}
