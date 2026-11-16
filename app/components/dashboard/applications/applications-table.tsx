import Link from "next/link"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApplicationStatusBadge } from "@/app/components/dashboard/applications/application-status-badge"
import { formatAppliedAgo } from "@/lib/applications-format"
import { cn } from "@/lib/utils"
import type { Application } from "@/types/application"

const headClass =
  "h-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"

type ApplicationsTableProps = {
  /** Already sliced to the current page by the parent. */
  applications: Application[]
  className?: string
}

/**
 * The applications list. On tablets and up it is a real table; on phones the
 * same data is shown as small cards.
 */
export function ApplicationsTable({
  applications,
  className,
}: ApplicationsTableProps) {
  if (applications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 p-10 text-center text-sm text-zinc-500">
        No applications here yet.
      </div>
    )
  }

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
              <TableHead className={headClass}>Job Title</TableHead>
              <TableHead className={headClass}>Company</TableHead>
              <TableHead className={headClass}>Applied</TableHead>
              <TableHead className={headClass}>Status</TableHead>
              <TableHead className={`${headClass} text-right`}>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.map((application) => {
              const remote = application.isRemote === "true"

              return (
                <TableRow
                  key={application._id}
                  className="border-zinc-800/60 hover:bg-white/[0.02]"
                >
                  {/* Job title + type */}
                  <TableCell>
                    <div className="flex min-w-0 items-center gap-3">
                      <div
                        aria-hidden
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-[11px] font-semibold text-brand"
                      >
                        {application.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="max-w-[170px] truncate text-xs font-semibold xl:max-w-none">
                          {application.jobTitle}
                        </p>
                        <p className="max-w-[170px] truncate text-[11px] text-zinc-500 xl:max-w-none">
                          {application.jobType} •{" "}
                          {remote ? "Remote" : application.location}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Company */}
                  <TableCell className="text-xs text-zinc-400">
                    {application.companyName}
                  </TableCell>

                  {/* Applied */}
                  <TableCell className="text-xs text-zinc-400">
                    {formatAppliedAgo(application.appliedAt)}
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <ApplicationStatusBadge status={application.status} />
                  </TableCell>

                  {/* Action */}
                  <TableCell className="text-right">
                    <Link
                      href={`/browse-jobs/${application.jobId}`}
                      className="text-xs text-zinc-300 transition-colors hover:text-white"
                    >
                      Details
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className={cn("space-y-3 md:hidden", className)}>
        {applications.map((application) => {
          const remote = application.isRemote === "true"

          return (
            <li
              key={application._id}
              className="rounded-xl border border-zinc-800 bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">
                    {application.jobTitle}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                    {application.companyName} •{" "}
                    {remote ? "Remote" : application.location}
                  </p>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3">
                <span className="text-[11px] text-zinc-500">
                  Applied {formatAppliedAgo(application.appliedAt)}
                </span>
                <Link
                  href={`/browse-jobs/${application.jobId}`}
                  className="text-xs text-zinc-300 transition-colors hover:text-white"
                >
                  Details
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </>
  )
}
