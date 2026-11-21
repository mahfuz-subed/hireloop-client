import { USER_STATUS_STYLES } from "@/lib/users-format"
import { cn } from "@/lib/utils"

/**
 * "Active" for a verified email, "Pending" before it is verified.
 *
 * Better Auth stores no separate suspended flag, so this is the only status
 * the data can honestly describe today.
 */
export function UserStatusBadge({
  verified,
  className,
}: {
  verified: boolean
  className?: string
}) {
  const style = verified
    ? USER_STATUS_STYLES.active
    : USER_STATUS_STYLES.pending

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
