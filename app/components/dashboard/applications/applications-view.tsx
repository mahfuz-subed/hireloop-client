"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, Download } from "lucide-react"

import { ApplicationStats } from "@/app/components/dashboard/applications/application-stats"
import { ApplicationsTable } from "@/app/components/dashboard/applications/applications-table"
import { PageHeader } from "@/app/components/dashboard/page-shell"
import { getApplicationStats } from "@/lib/applications-format"
import { cn } from "@/lib/utils"
import type { Application } from "@/types/application"

/** Rows per page in the table. */
const APPLICATIONS_PER_PAGE = 5

type Tab = "active" | "archived"

/**
 * The "My Applications" screen.
 *
 * Only two pieces of state:
 *   - tab  → "active" or "archived"
 *   - page → which slice of 5 rows is on screen
 *
 * The full list arrives from the page as a prop, so this component never
 * fetches anything itself.
 */
export function ApplicationsView({
  applications,
}: {
  applications: Application[]
}) {
  const [tab, setTab] = React.useState<Tab>("active")
  const [page, setPage] = React.useState(1)

  // 1. Keep the rows for the selected tab.
  const shown = applications.filter((application) =>
    tab === "archived" ? application.archived : !application.archived
  )

  // 2. Cut out the 5 rows for the current page.
  const totalPages = Math.max(1, Math.ceil(shown.length / APPLICATIONS_PER_PAGE))
  const firstIndex = (page - 1) * APPLICATIONS_PER_PAGE
  const pageApplications = shown.slice(
    firstIndex,
    firstIndex + APPLICATIONS_PER_PAGE
  )

  function changeTab(nextTab: Tab) {
    setTab(nextTab)
    // Page 3 of "Active" may not exist in "Archived".
    setPage(1)
  }

  const stats = getApplicationStats(shown)

  const firstShown = shown.length === 0 ? 0 : firstIndex + 1
  const lastShown = Math.min(firstIndex + APPLICATIONS_PER_PAGE, shown.length)

  return (
    <>
      <PageHeader
        breadcrumb={
          <>
            Seeker / <span className="text-brand">My Applications</span>
          </>
        }
        title="My Applications"
        description="Track your job applications and interview progress in real time."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="tablist"
              aria-label="Application filter"
              className="flex rounded-lg border border-zinc-800 p-0.5"
            >
              <TabButton
                active={tab === "active"}
                onClick={() => changeTab("active")}
              >
                Active
              </TabButton>
              <TabButton
                active={tab === "archived"}
                onClick={() => changeTab("archived")}
              >
                Archived
              </TabButton>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-zinc-800 px-3 text-xs text-zinc-200 transition-colors hover:bg-white/5"
            >
              <Download aria-hidden className="size-3.5" />
              Export PDF
            </button>
          </div>
        }
      />

      <ApplicationStats stats={stats} />

      <div className="mt-6">
        <ApplicationsTable applications={pageApplications} />

        {shown.length > 0 ? (
          <footer className="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-zinc-500 sm:flex-row">
            <p>
              Showing {firstShown}-{lastShown} of {shown.length} applications
            </p>

            <div className="flex items-center gap-1">
              <PageButton
                label="Previous page"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
              >
                <ChevronLeft aria-hidden className="size-3.5" />
              </PageButton>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setPage(pageNumber)}
                    aria-current={page === pageNumber ? "page" : undefined}
                    className={cn(
                      "size-7 rounded-md border text-xs transition-colors",
                      page === pageNumber
                        ? "border-zinc-700 bg-white text-zinc-900"
                        : "border-transparent text-zinc-400 hover:bg-white/5"
                    )}
                  >
                    {pageNumber}
                  </button>
                )
              )}

              <PageButton
                label="Next page"
                disabled={page === totalPages}
                onClick={() =>
                  setPage((current) => Math.min(totalPages, current + 1))
                }
              >
                <ChevronRight aria-hidden className="size-3.5" />
              </PageButton>
            </div>
          </footer>
        ) : null}
      </div>
    </>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-1.5 text-xs transition-colors",
        active
          ? "bg-surface-muted text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300"
      )}
    >
      {children}
    </button>
  )
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md border border-zinc-800 text-zinc-400 transition-colors hover:bg-white/5 disabled:pointer-events-none disabled:opacity-40"
    >
      {children}
    </button>
  )
}
