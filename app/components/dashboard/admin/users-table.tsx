import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserRoleActions } from "@/app/components/dashboard/admin/user-role-actions"
import { UserRoleBadge } from "@/app/components/dashboard/admin/user-role-badge"
import { UserStatusBadge } from "@/app/components/dashboard/admin/user-status-badge"
import { formatDate } from "@/lib/jobs-format"
import { cn } from "@/lib/utils"
import type { AdminUser } from "@/types/user"

const headClass =
  "h-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"

type UsersTableProps = {
  /** Already sliced to the current page by the parent. */
  users: AdminUser[]
  className?: string
}

/** First letters of the name, used when the user has no profile picture. */
const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "?"

/**
 * The admin users list.
 *
 * A real table from `md` upwards; on phones the same rows become small cards
 * (the pattern used elsewhere in the dashboard).
 */
export function UsersTable({ users, className }: UsersTableProps) {
  return (
    <>
      <div
        className={cn(
          "hidden overflow-hidden rounded-xl border border-zinc-800 bg-surface md:block",
          className
        )}
      >
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className={headClass}>User Name</TableHead>
              <TableHead className={headClass}>Email Address</TableHead>
              <TableHead className={headClass}>Role</TableHead>
              <TableHead className={`${headClass} hidden lg:table-cell`}>
                Join Date
              </TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={`${headClass} text-right`}>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="border-zinc-800/60 hover:bg-white/[0.02]"
              >
                {/* Avatar + name */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <UserAvatar user={user} />
                    <p className="max-w-[160px] truncate text-xs font-semibold">
                      {user.name}
                    </p>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell>
                  <p className="max-w-[220px] truncate text-xs text-zinc-400">
                    {user.email}
                  </p>
                </TableCell>

                {/* Role */}
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>

                {/* Join date */}
                <TableCell className="hidden text-xs text-zinc-400 lg:table-cell">
                  {formatDate(user.createdAt)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <UserStatusBadge verified={user.emailVerified} />
                </TableCell>

                {/* Role actions */}
                <TableCell>
                  <UserRoleActions
                    userId={user.id}
                    currentRole={user.role}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className={cn("space-y-3 md:hidden", className)}>
        {users.map((user) => (
          <li
            key={user.id}
            className="rounded-xl border border-zinc-800 bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <UserAvatar user={user} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {user.email}
                  </p>
                </div>
              </div>
              <UserStatusBadge verified={user.emailVerified} />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
              <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                <UserRoleBadge role={user.role} />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>

            <UserRoleActions
              userId={user.id}
              currentRole={user.role}
              className="mt-3 justify-end"
            />
          </li>
        ))}
      </ul>
    </>
  )
}

/** Profile picture, or the user's initials when there is none. */
function UserAvatar({ user }: { user: AdminUser }) {
  if (user.image) {
    return (
      // Plain <img>: the dashboard has no remote image patterns configured.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt=""
        className="size-8 shrink-0 rounded-full object-cover"
      />
    )
  }

  return (
    <div
      aria-hidden
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold text-brand"
    >
      {initials(user.name)}
    </div>
  )
}
