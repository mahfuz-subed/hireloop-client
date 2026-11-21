import type { UserRole } from "@/types/auth"

/** Every role a user can have, in the order the admin screen shows them. */
export const USER_ROLES = [
  "seeker",
  "recruiter",
  "admin",
] as const satisfies readonly UserRole[]

/**
 * The part of a Better Auth user record the admin users screen needs.
 *
 * Better Auth returns the full record (sessions, tokens, etc.). We map it to
 * this smaller shape in `getAdminUsers()` so components only ever see what
 * they render.
 */
export type AdminUser = {
  id: string
  name: string
  email: string
  /** Profile picture URL, when the user signed up with a provider that has one. */
  image: string | null
  role: UserRole
  emailVerified: boolean
  /** ISO date string, e.g. "2026-11-18T09:30:00.000Z". */
  createdAt: string
}
