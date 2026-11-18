"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { updateApplicationStatus } from "@/lib/actions/users"
import { APPLICATION_STATUS_STYLES } from "@/lib/applications-format"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
} from "@/types/application"

type ApplicationStatusSelectProps = {
  /** The application this dropdown belongs to. */
  applicationId: string
  /** The status that came from the database. */
  status: ApplicationStatus
  className?: string
}

/**
 * Status dropdown for one applicant.
 *
 * The dropdown itself is done. Picking a status calls `handleJobStatus` below,
 * which is intentionally empty: that is where the database update goes.
 */
export function ApplicationStatusSelect({
  applicationId,
  status,
  className,
}: ApplicationStatusSelectProps) {
  const router = useRouter()
  /**
   * Runs when the recruiter picks a status from the dropdown.
   *
   * TODO: add the update here, for example:
   *
   *   await updateApplicationStatus(applicationId, { status: next })
   *   router.refresh()
   *
   * `updateApplicationStatus` already exists in `lib/actions/application.ts`.
   * `router.refresh()` re-reads the page from the server so the new status and
   * the stat cards above stay in sync.
   */
  async function handleJobStatus(next: ApplicationStatus) {
    const result = await updateApplicationStatus(applicationId, {
      status: next,
    })
    router.refresh()
    console.log("update result", result)
  }

  const style =
    APPLICATION_STATUS_STYLES[status] ?? APPLICATION_STATUS_STYLES.applied

  return (
    <div className={cn("inline-flex rounded-full", style.badge, className)}>
      <Select
        value={status}
        onValueChange={(next) => handleJobStatus(next as ApplicationStatus)}
      >
        <SelectTrigger
          id={`status-${applicationId}`}
          size="sm"
          aria-label="Change application status"
          className="h-7 gap-1.5 rounded-full border-0 bg-transparent px-2.5 py-1 text-[10px] font-normal hover:bg-transparent dark:bg-transparent dark:hover:bg-transparent [&>svg]:text-current [&>svg]:opacity-60"
        >
          <span
            aria-hidden
            className={cn("h-1.5 w-1.5 rounded-full", style.dot)}
          />
          {style.label}
        </SelectTrigger>

        <SelectContent>
          {APPLICATION_STATUSES.map((option) => (
            <SelectItem key={option} value={option}>
              <span
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  APPLICATION_STATUS_STYLES[option].dot
                )}
              />
              {APPLICATION_STATUS_STYLES[option].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
