"use client"

import * as React from "react"
import { Search } from "lucide-react"

import { StatCard } from "@/app/components/dashboard/applications/application-stats"
import { UsersTable } from "@/app/components/dashboard/admin/users-table"
import { PageHeader } from "@/app/components/dashboard/page-shell"
import { TablePagination } from "@/app/components/dashboard/table-pagination"
import { Input } from "@/components/ui/input"
import { USER_ROLE_STYLES, getUserStats } from "@/lib/users-format"
import type { UserRole } from "@/types/auth"
import { USER_ROLES, type AdminUser } from "@/types/user"

/** Users shown per page. */
const PAGE_SIZE = 8

type RoleFilter = "all" | UserRole

/**
 * The admin "User Management" screen.
 *
 * The page loads the users on the server and passes them in, so this
 * component only keeps UI state: the search text, the role filter and the
 * current page. No fetching happens here.
 */
export function UsersView({ users }: { users: AdminUser[] }) {
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState<RoleFilter>("all")
  const [page, setPage] = React.useState(1)

  // 1. Search by name or email, then keep only the chosen role.
  const search = query.trim().toLowerCase()
  const filtered = users.filter((user) => {
    const matchesRole = role === "all" || user.role === role
    const matchesSearch =
      search === "" ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)

    return matchesRole && matchesSearch
  })

  // 2. Cut out the rows for the current page.
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  // A filter can leave fewer pages than the one we were on.
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * PAGE_SIZE
  const pageUsers = filtered.slice(firstIndex, firstIndex + PAGE_SIZE)

  // The cards describe every user, not just the filtered slice.
  const stats = getUserStats(users)

  function changeQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  function changeRole(value: RoleFilter) {
    setRole(value)
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="User Management"
        description="Review, filter, and manage platform access for all users."
        action={
          <label className="flex items-center gap-2 text-[11px] text-zinc-500">
            <span className="sr-only sm:not-sr-only">Role</span>
            <select
              value={role}
              onChange={(event) =>
                changeRole(event.target.value as RoleFilter)
              }
              aria-label="Filter by role"
              className="h-9 w-full rounded-lg border border-zinc-800 bg-surface px-3 text-xs text-zinc-200 outline-none focus-visible:border-zinc-600 sm:w-auto"
            >
              <option value="all">All Roles</option>
              {USER_ROLES.map((value) => (
                <option key={value} value={value}>
                  {USER_ROLE_STYLES[value].label}
                </option>
              ))}
            </select>
          </label>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.total}
          hint={`${stats.admins} admin${stats.admins === 1 ? "" : "s"}`}
        />
        <StatCard
          label="Recruiters"
          value={stats.recruiters}
          hint={`${stats.recruiterPercent}% of all users`}
          hintTone="positive"
        />
        <StatCard
          label="Seekers"
          value={stats.seekers}
          hint={`${stats.seekerPercent}% of all users`}
        />
        <StatCard
          label="New Signups (24h)"
          value={stats.newSignups}
          hint="Last 24 hours"
          hintTone="warning"
        />
      </div>

      {/* Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-zinc-500"
          />
          <Input
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder="Search by name or email"
            aria-label="Search users"
            className="pl-8 text-xs"
          />
        </div>

        <p className="text-[11px] text-zinc-500">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4">
        {users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
            No users found.
          </div>
        ) : pageUsers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
            No users match your search or role filter.
          </div>
        ) : (
          <>
            <UsersTable users={pageUsers} />

            <TablePagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel={filtered.length === 1 ? "user" : "users"}
            />
          </>
        )}
      </div>
    </>
  )
}
