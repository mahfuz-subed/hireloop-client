import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ApplicationStatusSelect } from "@/app/components/dashboard/applications/application-status-select"
import { formatAppliedAgo } from "@/lib/applications-format"
import { cn } from "@/lib/utils"
import type { Application } from "@/types/application"

const headClass =
  "h-11 text-[10px] font-medium tracking-wider text-zinc-500 uppercase"

type JobApplicantsTableProps = {
  /** Already sliced to the current page by the parent. */
  applications: Application[]
  className?: string
}

/** First letter of the applicant's name, used in the round avatar. */
const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?"

/**
 * Everybody who applied to one job.
 *
 * A real table from `md` upwards; on phones the same rows become small cards
 * (the pattern used by `ApplicationsTable` and the recruiter job list).
 *
 * The status column is a dropdown (`ApplicationStatusSelect`). It changes the
 * badge on screen only; the database write is left to be added inside that
 * component.
 */
export function JobApplicantsTable({
  applications,
  className,
}: JobApplicantsTableProps) {
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
              <TableHead className={headClass}>Applicant</TableHead>
              <TableHead className={headClass}>Contact</TableHead>
              <TableHead className={`${headClass} hidden lg:table-cell`}>
                Applied
              </TableHead>
              <TableHead className={headClass}>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {applications.map((application) => (
              <TableRow
                key={application._id}
                className="border-zinc-800/60 hover:bg-white/[0.02]"
              >
                {/* Applicant name + phone */}
                <TableCell>
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      aria-hidden
                      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold text-brand"
                    >
                      {initial(application.seekerName)}
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[170px] truncate text-xs font-semibold">
                        {application.seekerName}
                      </p>
                      {application.seekerPhone ? (
                        <p className="max-w-[170px] truncate text-[11px] text-zinc-500">
                          {application.seekerPhone}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </TableCell>

                {/* Email + optional resume link */}
                <TableCell>
                  <p className="max-w-[220px] truncate text-xs text-zinc-300">
                    {application.seekerEmail}
                  </p>
                  {application.resumeUrl ? (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-sky-400 transition-colors hover:text-sky-300"
                    >
                      Resume
                    </a>
                  ) : null}
                </TableCell>

                {/* How long ago */}
                <TableCell className="hidden text-xs text-zinc-400 lg:table-cell">
                  {formatAppliedAgo(application.appliedAt)}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <ApplicationStatusSelect
                    applicationId={application._id}
                    status={application.status}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <ul className={cn("space-y-3 md:hidden", className)}>
        {applications.map((application) => (
          <li
            key={application._id}
            className="rounded-xl border border-zinc-800 bg-surface p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  aria-hidden
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-xs font-semibold text-brand"
                >
                  {initial(application.seekerName)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">
                    {application.seekerName}
                  </p>
                  <p className="truncate text-[11px] text-zinc-500">
                    {application.seekerEmail}
                  </p>
                </div>
              </div>
              <ApplicationStatusSelect
                applicationId={application._id}
                status={application.status}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-800 pt-3 text-[11px] text-zinc-500">
              <span>Applied {formatAppliedAgo(application.appliedAt)}</span>
              {application.resumeUrl ? (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-400 transition-colors hover:text-sky-300"
                >
                  Resume
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
