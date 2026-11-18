"use client"

import type { ReactNode } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type TablePaginationProps = {
  /** 1-based page number currently on screen. */
  page: number
  /** How many pages exist. Never 0 - pass at least 1. */
  totalPages: number
  /** Rows across every page (not just this page). */
  totalItems: number
  /** Rows per page, used for the "Showing 1-8 of 12" text. */
  pageSize: number
  onPageChange: (page: number) => void
  /** Plural noun for the footer, e.g. "applicants". */
  itemLabel?: string
}

/**
 * Footer shared by the dashboard tables:
 * "Showing 1-8 of 12 applicants" on the left, page buttons on the right.
 *
 * It holds no state of its own - the parent owns `page` and passes
 * `onPageChange`, so this component stays reusable.
 */
export function TablePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: TablePaginationProps) {
  const firstShown = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const lastShown = Math.min(page * pageSize, totalItems)

  return (
    <footer className="mt-4 flex flex-col items-center justify-between gap-3 text-[11px] text-zinc-500 sm:flex-row">
      <p>
        Showing {firstShown}-{lastShown} of {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <PageButton
          label="Previous page"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden className="size-3.5" />
        </PageButton>

        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
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
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden className="size-3.5" />
        </PageButton>
      </div>
    </footer>
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
  children: ReactNode
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
