import { JOB_CATEGORIES, JOB_TYPES, type JobRow } from "@/types/job"

/**
 * Filtering model for the public browse-jobs page.
 *
 * Each group allows a single selection. `null` means "no filter selected".
 * The keys are fields on `JobRow` (jobType, category) and match the query
 * parameters our Express API understands.
 */
export type JobFilterKey = "jobType" | "category"

export type JobFilterState = Record<JobFilterKey, string | null>

export type JobFilterCounts = Partial<Record<JobFilterKey, Record<string, number>>>

export const JOB_FILTER_GROUPS: ReadonlyArray<{
  key: JobFilterKey
  label: string
  options: readonly string[]
}> = [
  { key: "jobType", label: "Job Type", options: JOB_TYPES },
  { key: "category", label: "Job Category", options: JOB_CATEGORIES },
]

export const JOB_SORT_OPTIONS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Highest Salary" },
  { value: "deadline", label: "Closing Soon" },
] as const

export type JobSortValue = (typeof JOB_SORT_OPTIONS)[number]["value"]

export type JobQuery = {
  search?: string | null
  jobType?: string | null
  category?: string | null
}

/**
 * Builds the query string that the Express API expects:
 *
 *   { search: "designer", jobType: "Full-time" }
 *     -> "search=designer&jobType=Full-time"
 *
 * The same string is used for the page URL (`/browse-jobs?...`) and for the
 * API request (`GET /jobs?...`), so there is only one place to maintain.
 */
export const buildJobQuery = ({ search, jobType, category }: JobQuery) => {
  const params = new URLSearchParams()

  if (search?.trim()) params.set("search", search.trim())
  if (jobType) params.set("jobType", jobType)
  if (category) params.set("category", category)

  return params.toString()
}

/** How many jobs fall into each option of a group, e.g. `{ "Full-time": 10 }`. */
export const countJobsBy = (jobs: JobRow[], key: JobFilterKey) =>
  jobs.reduce<Record<string, number>>((counts, job) => {
    const value = job[key]
    if (value) counts[value] = (counts[value] ?? 0) + 1
    return counts
  }, {})
