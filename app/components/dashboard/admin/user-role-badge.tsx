import { Briefcase, ShieldCheck, User, type LucideIcon } from "lucide-react"

import { USER_ROLE_STYLES } from "@/lib/users-format"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"

/** Small icon shown inside each role pill. */
const ROLE_ICONS: Record<UserRole, LucideIcon> = {
  seeker: User,
  recruiter: Briefcase,
  admin: ShieldCheck,
}

/** Coloured pill with an icon, e.g. "Seeker" or "Recruiter". */
export function UserRoleBadge({
  role,
  className,
}: {
  role: UserRole
  className?: string
}) {
  const style = USER_ROLE_STYLES[role] ?? USER_ROLE_STYLES.seeker
  const Icon = ROLE_ICONS[role] ?? ROLE_ICONS.seeker

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] whitespace-nowrap",
        style.badge,
        className
      )}
    >
      <Icon aria-hidden className="size-3" />
      {style.label}
    </span>
  )
}
