"use client"

import * as React from "react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  JOB_FILTER_GROUPS,
  type JobFilterCounts,
  type JobFilterKey,
  type JobFilterState,
} from "@/lib/jobs-filter"
import { cn } from "@/lib/utils"

type JobFiltersProps = {
  /** The current selection, which comes from the URL. */
  filters: JobFilterState
  /** Called with the new selection when the user clicks an option. */
  onFilterChange: (filters: JobFilterState) => void
  /** Per-group option counts, e.g. `{ jobType: { "Full-time": 10 } }`. */
  counts?: JobFilterCounts
  className?: string
}

/**
 * Filter sidebar. This component does not store anything itself: it shows the
 * `filters` it receives and calls `onFilterChange` when an option is clicked.
 *
 * Rule: one selection per group. Clicking the selected option again clears it
 * (`null`), which means "show every job".
 */
export function JobFilters({
  filters,
  onFilterChange,
  counts,
  className,
}: JobFiltersProps) {
  function handleClick(key: JobFilterKey, option: string) {
    const isAlreadySelected = filters[key] === option

    onFilterChange({
      ...filters, // keep the other group's selection
      [key]: isAlreadySelected ? null : option,
    })
  }

  return (
    <aside
      aria-label="Job filters"
      className={cn(
        "rounded-xl border border-white/10 bg-surface p-4",
        className
      )}
    >
      <h2 className="text-base font-semibold text-zinc-100">Filters</h2>

      <div className="mt-4 space-y-5">
        {JOB_FILTER_GROUPS.map((group) => (
          <fieldset key={group.key}>
            <legend className="mb-2 text-xs font-medium text-zinc-300">
              {group.label}
            </legend>

            <ul className="space-y-0.5">
              {group.options.map((option) => {
                const inputId = `filter-${group.key}-${option}`
                const labelId = `${inputId}-label`
                const selected = filters[group.key] === option

                return (
                  <li
                    key={option}
                    className="flex items-center gap-2.5 rounded-md px-1 py-1.5 transition-colors hover:bg-white/5"
                  >
                    <Checkbox
                      id={inputId}
                      aria-labelledby={labelId}
                      checked={selected}
                      onCheckedChange={() => handleClick(group.key, option)}
                    />

                    <label
                      htmlFor={inputId}
                      className={cn(
                        "flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-2 text-xs",
                        selected ? "text-zinc-100" : "text-zinc-400"
                      )}
                    >
                      <span id={labelId} className="truncate">
                        {option}
                      </span>
                      <span className="shrink-0 text-[11px] tabular-nums text-zinc-500">
                        {counts?.[group.key]?.[option] ?? 0}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
      </div>
    </aside>
  )
}
