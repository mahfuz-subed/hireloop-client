"use client"

import { updateUserRole } from "@/lib/actions/users"
import { USER_ROLE_STYLES } from "@/lib/users-format"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"
import { USER_ROLES } from "@/types/user"
import { useRouter } from "next/navigation"

type UserRoleActionsProps = {
  /** Whose role is being changed. */
  userId: string
  /** The role the user has right now - it is never offered again. */
  currentRole: UserRole
  className?: string
}

/**
 * The two "Make ..." buttons on a user row.
 *
 * A user has three possible roles, so a row shows the two the user does not
 * already have. Picking one calls `handleRoleChange` below - that function is
 * intentionally empty and is where the role update goes.
 */
export function UserRoleActions({
  userId,
  currentRole,
  className,
}: UserRoleActionsProps) {
  const router = useRouter()
  /**
   * Runs when the admin clicks "Make admin" / "Make recruiter" / "Make seeker".
   *
   * TODO: add the role update here, using `userId` and `nextRole`, then call
   * `router.refresh()` so the row and the stat cards above re-read the new
   * data from the server.
   */
  async function handleRoleChange(userId: string, role: UserRole) {
    // Add the update here.
    const result = await updateUserRole(userId, role)
    router.refresh()
    console.log(result)
  }

  const otherRoles = USER_ROLES.filter((role) => role !== currentRole)

  return (
    <div
      className={cn("flex flex-wrap items-center justify-end gap-3", className)}
    >
      {otherRoles.map((role) => (
        <button
          key={role}
          type="button"
          onClick={() => handleRoleChange(userId, role)}
          className="text-[11px] font-medium whitespace-nowrap text-zinc-300 transition-colors hover:text-white"
        >
          Make {USER_ROLE_STYLES[role].label}
        </button>
      ))}
    </div>
  )
}
