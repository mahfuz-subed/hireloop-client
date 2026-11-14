"use client"

import { ChevronDown } from "lucide-react"

import { JOB_SORT_OPTIONS, type JobSortValue } from "@/lib/jobs-filter"

type ResultsToolbarProps = {
  count: number
  sort: JobSortValue
  onSortChange?: (sort: JobSortValue) => void
}

/** Result count on the left, sort select on the right. */
export function ResultsToolbar({
  count,
  sort,
  onSortChange,
}: ResultsToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-sm font-semibold text-zinc-100">
        Found {count.toLocaleString("en-US")} Professional{" "}
        {count === 1 ? "Job" : "Jobs"}
      </h1>

      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
        <label htmlFor="jobs-sort">Sort by</label>
        <div className="relative">
          <select
            id="jobs-sort"
            value={sort}
            onChange={(event) =>
              onSortChange?.(event.target.value as JobSortValue)
            }
            className="appearance-none rounded-md border border-white/10 bg-surface py-1.5 pr-7 pl-2.5 text-[11px] text-zinc-200 outline-none transition-colors focus-visible:border-brand"
          >
            {JOB_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-2 size-3 -translate-y-1/2 text-zinc-500"
          />
        </div>
      </div>
    </div>
  )
}
