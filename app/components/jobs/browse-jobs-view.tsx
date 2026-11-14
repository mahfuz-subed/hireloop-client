"use client"

import * as React from "react"

import { BrowseJobCard } from "@/app/components/jobs/browse-job-card"
import { JobFilters } from "@/app/components/jobs/job-filters"
import { JobSearchBar } from "@/app/components/jobs/job-search-bar"
import { ResultsToolbar } from "@/app/components/jobs/results-toolbar"
import {
  buildJobQuery,
  countJobsBy,
  type JobFilterCounts,
  type JobFilterState,
  type JobSortValue,
} from "@/lib/jobs-filter"
import type { JobRow } from "@/types/job"
import { usePathname, useRouter } from "next/navigation"

type BrowseJobsViewProps = {
  /** Already filtered by the server for the current URL. */
  jobs: JobRow[]
  /** Every job, used only to show the numbers next to each filter option. */
  allJobs: JobRow[]
  /** What the URL says is selected right now. */
  filters: JobFilterState
  search: string
}

/**
 * Browse-jobs screen.
 *
 * Filtering happens on the server:
 *   1. The user clicks a filter or submits the search box.
 *   2. We build a query string and `router.push()` a new URL.
 *   3. The page re-renders on the server, calls `GET /jobs?...`, and passes
 *      the filtered list back into this component.
 *
 * Only `sort` is handled here, because the API has no sort parameter.
 */
export function BrowseJobsView({
  jobs,
  allJobs,
  filters,
  search,
}: BrowseJobsViewProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [sort, setSort] = React.useState<JobSortValue>("recent")

  /** Navigate to this page with the given query string ("" = no params). */
  function goToQuery(query: string) {
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  function handleFilterChange(nextFilters: JobFilterState) {
    goToQuery(
      buildJobQuery({
        search,
        jobType: nextFilters.jobType,
        category: nextFilters.category,
      })
    )
  }

  function handleSearch(nextSearch: string) {
    goToQuery(
      buildJobQuery({
        search: nextSearch,
        jobType: filters.jobType,
        category: filters.category,
      })
    )
  }

  function clearEverything() {
    router.push(pathname)
  }

  // Sorting is the one thing the API cannot do, so it stays here.
  const visibleJobs = [...jobs].sort((a, b) => {
    if (sort === "salary") {
      return Number(b.maxSalary) - Number(a.maxSalary)
    }
    if (sort === "deadline") {
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    }
    return new Date(b.posted).getTime() - new Date(a.posted).getTime()
  })

  const counts: JobFilterCounts = {
    jobType: countJobsBy(allJobs, "jobType"),
    category: countJobsBy(allJobs, "category"),
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      <JobSearchBar defaultValue={search} onSearch={handleSearch} />

      <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
        <JobFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          counts={counts}
          className="h-fit lg:sticky lg:top-24"
        />

        <section aria-label="Job results" className="min-w-0">
          <ResultsToolbar
            count={jobs.length}
            sort={sort}
            onSortChange={setSort}
          />

          {jobs.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/10 p-10 text-center">
              <p className="text-sm text-zinc-400">
                No jobs match your search or filters.
              </p>
              <button
                type="button"
                onClick={clearEverything}
                className="mt-3 rounded-md border border-white/10 px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-white/5"
              >
                Clear search and filters
              </button>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {visibleJobs.map((job) => (
                <li key={job._id}>
                  <BrowseJobCard job={job} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
