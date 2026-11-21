import type { UserRole } from "@/types/auth"
import { USER_ROLES, type AdminUser } from "@/types/user"

/** Label, pill colour and dot colour for each role. */
export const USER_ROLE_STYLES: Record<
  UserRole,
  { label: string; badge: string; dot: string }
> = {
  seeker: {
    label: "Seeker",
    badge: "bg-zinc-500/10 text-zinc-300",
    dot: "bg-zinc-400",
  },
  recruiter: {
    label: "Recruiter",
    badge: "bg-violet-500/15 text-violet-300",
    dot: "bg-violet-400",
  },
  admin: {
    label: "Admin",
    badge: "bg-indigo-500/15 text-indigo-300",
    dot: "bg-indigo-400",
  },
}

/** Label, pill colour and dot colour for "has this account been verified?". */
export const USER_STATUS_STYLES = {
  active: {
    label: "Active",
    badge: "bg-emerald-500/10 text-emerald-400",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    badge: "bg-amber-500/10 text-amber-400",
    dot: "bg-amber-400",
  },
} as const

/**
 * The API stores `role` as a plain string. This turns anything unexpected
 * into the safest default ("seeker") so the UI never crashes on bad data.
 */
export const normalizeRole = (role?: string | null): UserRole =>
  USER_ROLES.includes(role as UserRole) ? (role as UserRole) : "seeker"

const DAY_IN_MS = 24 * 60 * 60 * 1000

/** True when the account was created in the last 24 hours. */
export const isNewSignup = (user: AdminUser, now = Date.now()) => {
  const createdAt = new Date(user.createdAt).getTime()
  return !Number.isNaN(createdAt) && now - createdAt <= DAY_IN_MS
}

/** The four numbers in the cards at the top of the admin users screen. */
export const getUserStats = (users: AdminUser[]) => {
  const countByRole = (role: UserRole) =>
    users.filter((user) => user.role === role).length

  const total = users.length
  const recruiters = countByRole("recruiter")
  const seekers = countByRole("seeker")
  const percent = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 100)

  return {
    total,
    admins: countByRole("admin"),
    recruiters,
    seekers,
    newSignups: users.filter((user) => isNewSignup(user)).length,
    recruiterPercent: percent(recruiters),
    seekerPercent: percent(seekers),
  }
}
