import { cn } from "@/lib/utils"
import { APPLICATION_STATUS_STYLES } from "@/lib/applications-format"
import type { ApplicationStatus } from "@/types/application"

/** Coloured pill showing where an application stands. */
export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus
  className?: string
}) {
  const style = APPLICATION_STATUS_STYLES[status] ?? APPLICATION_STATUS_STYLES.applied

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
